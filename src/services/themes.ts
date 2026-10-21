import { AccentName, LegacyAppSettingsModel, AppSettingsModel, SectionColor } from "../models";

export const ACCENTS: { name: AccentName; label: string; light: string; dark: string }[] = [
  { name: "tea", label: "Tea", light: "#2F7A55", dark: "#7CC9A0" },
  { name: "teal", label: "Teal", light: "#276678", dark: "#7DBBCB" },
  { name: "blue", label: "Blue", light: "#3D6FB0", dark: "#8DB6EA" },
  { name: "clay", label: "Clay", light: "#9A6440", dark: "#D9A77F" },
  { name: "plum", label: "Plum", light: "#74509F", dark: "#B99DE2" },
];

export const SECTION_COLORS: SectionColor[] = ["gray", "blue", "plum", "orange", "green", "olive", "red", "teal"];

export const DEFAULT_SETTINGS: AppSettingsModel = {
  theme: "light",
  accent: "tea",
  size: "default",
  textSize: 100,
  openOn: "last",
};

// The seven v1 themes collapse into light/dark + the closest accent.
const LEGACY_THEMES: Record<string, Pick<AppSettingsModel, "theme" | "accent">> = {
  "Light Default": { theme: "light", accent: "teal" },
  "Light Blue": { theme: "light", accent: "blue" },
  "Light Green": { theme: "light", accent: "tea" },
  "Light Brown": { theme: "light", accent: "clay" },
  "Dark Brown": { theme: "dark", accent: "clay" },
  "Dark Green": { theme: "dark", accent: "tea" },
  "Dark Blue": { theme: "dark", accent: "teal" },
};

export function migrateLegacySettings(legacy: LegacyAppSettingsModel): AppSettingsModel {
  const theme = LEGACY_THEMES[legacy.currentTheme ?? "Light Default"] ?? LEGACY_THEMES["Light Default"];
  const size = ({ small: "compact", normal: "default", large: "roomy" } as const)[legacy.currentSize ?? "normal"];
  const zoom = Number.parseInt(legacy.appZoom ?? "100%", 10);
  const textSize = ([90, 100, 110, 120] as const).find((z) => z === zoom) ?? 100;

  return { ...DEFAULT_SETTINGS, ...theme, size: size ?? "default", textSize };
}
