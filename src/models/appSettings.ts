export type AppSize = "small" | "normal" | "large";
export type AppZoom = "90%" | "100%" | "110%" | "120%";
export type SectionsMenuType = "menu" | "drop-down";

export interface AppSettingsModel {
  currentTheme: string;
  currentSize: AppSize;
  appZoom?: AppZoom;
  sectionsMenuType: SectionsMenuType;
}
