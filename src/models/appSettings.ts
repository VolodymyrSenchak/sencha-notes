export type AppSize = "small" | "normal" | "large";

export interface AppSettingsModel {
  currentTheme: string;
  currentSize: AppSize;
}
