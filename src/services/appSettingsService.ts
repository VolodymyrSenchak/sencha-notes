import { AppSettingsModel, LegacyAppSettingsModel } from "../models";
import { DEFAULT_SETTINGS, migrateLegacySettings } from "./themes";

export const APP_SETTINGS_KEY = "app-settings-v2";
export const LEGACY_APP_SETTINGS_KEY = "app-settings";

function readJson<T>(key: string): T | null {
  try {
    const json = localStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch {
    return null;
  }
}

export const appSettingsService = {
  getAppSettings: (): AppSettingsModel => {
    const current = readJson<Partial<AppSettingsModel>>(APP_SETTINGS_KEY);
    if (current) return { ...DEFAULT_SETTINGS, ...current };

    // First launch after the redesign: carry the old theme/size/zoom over. The legacy key is left in place.
    const legacy = readJson<LegacyAppSettingsModel>(LEGACY_APP_SETTINGS_KEY);
    return legacy ? migrateLegacySettings(legacy) : DEFAULT_SETTINGS;
  },
  setAppSettings: (appSettings: AppSettingsModel) => {
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(appSettings));
  },
};
