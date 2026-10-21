export type ThemeMode = "light" | "dark" | "system";
export type AccentName = "tea" | "teal" | "blue" | "clay" | "plum";
export type PopupSize = "compact" | "default" | "roomy";
export type TextSize = 90 | 100 | 110 | 120;
export type OpenOn = "last" | "new";

export interface AppSettingsModel {
  theme: ThemeMode;
  accent: AccentName;
  size: PopupSize;
  textSize: TextSize;
  openOn: OpenOn;
}

// Settings format used up to v1.2 (localStorage "app-settings"). Read once to migrate, never deleted.
export type LegacyAppSize = "small" | "normal" | "large";
export type LegacyAppZoom = "90%" | "100%" | "110%" | "120%";

export interface LegacyAppSettingsModel {
  currentTheme?: string;
  currentSize?: LegacyAppSize;
  appZoom?: LegacyAppZoom;
  sectionsMenuType?: "menu" | "drop-down";
}
