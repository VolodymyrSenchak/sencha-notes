import { appSettingsService, APP_SETTINGS_KEY, LEGACY_APP_SETTINGS_KEY } from "./appSettingsService";
import { DEFAULT_SETTINGS, migrateLegacySettings } from "./themes";

beforeEach(() => localStorage.clear());

describe("migrateLegacySettings", () => {
  it.each([
    ["Light Default", "light", "teal"],
    ["Light Blue", "light", "blue"],
    ["Light Green", "light", "tea"],
    ["Light Brown", "light", "clay"],
    ["Dark Brown", "dark", "clay"],
    ["Dark Green", "dark", "tea"],
    ["Dark Blue", "dark", "teal"],
  ])("maps the v1 theme %p to %p + %p", (currentTheme, theme, accent) => {
    expect(migrateLegacySettings({ currentTheme })).toMatchObject({ theme, accent });
  });

  it("maps size and zoom", () => {
    expect(migrateLegacySettings({ currentSize: "small", appZoom: "120%" })).toMatchObject({
      size: "compact",
      textSize: 120,
    });
    expect(migrateLegacySettings({ currentSize: "large", appZoom: "90%" })).toMatchObject({
      size: "roomy",
      textSize: 90,
    });
    expect(migrateLegacySettings({ currentTheme: "Removed theme" })).toMatchObject({
      theme: "light",
      accent: "teal",
      size: "default",
    });
  });
});

describe("appSettingsService", () => {
  it("uses defaults for brand-new users", () => {
    expect(appSettingsService.getAppSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("migrates v1 settings without deleting the old key", () => {
    const legacy = JSON.stringify({
      currentTheme: "Dark Blue",
      currentSize: "large",
      appZoom: "110%",
      sectionsMenuType: "menu",
    });
    localStorage.setItem(LEGACY_APP_SETTINGS_KEY, legacy);

    expect(appSettingsService.getAppSettings()).toMatchObject({
      theme: "dark",
      accent: "teal",
      size: "roomy",
      textSize: 110,
    });
    expect(localStorage.getItem(LEGACY_APP_SETTINGS_KEY)).toBe(legacy);
  });

  it("prefers saved v2 settings over the legacy key", () => {
    localStorage.setItem(LEGACY_APP_SETTINGS_KEY, JSON.stringify({ currentTheme: "Dark Blue" }));
    appSettingsService.setAppSettings({ ...DEFAULT_SETTINGS, accent: "plum" });
    expect(appSettingsService.getAppSettings().accent).toBe("plum");
    expect(JSON.parse(localStorage.getItem(APP_SETTINGS_KEY)!).accent).toBe("plum");
  });

  it("survives corrupted JSON", () => {
    localStorage.setItem(APP_SETTINGS_KEY, "{not json");
    expect(appSettingsService.getAppSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
