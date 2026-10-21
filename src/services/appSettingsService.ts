import { AppSettingsModel } from "../models";

export const APP_SETTINGS_KEY = "app-settings";

export const appSettingsService = {
  getAppSettings: (): AppSettingsModel | null => {
    const appSettingsJSON = localStorage.getItem(APP_SETTINGS_KEY);
    return appSettingsJSON ? JSON.parse(appSettingsJSON) : null;
  },
  setAppSettings: (appSettings: AppSettingsModel) => {
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(appSettings));
  }
}