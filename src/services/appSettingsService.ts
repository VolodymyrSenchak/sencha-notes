import { AppSettingsModel } from "../models";

export const APP_SETTINGS_KEY = "app-settings";

export const appSettingsService = {
  getActiveSection: (): AppSettingsModel => {
    const appSettingsJSON = localStorage.getItem(APP_SETTINGS_KEY);
    return appSettingsJSON ? JSON.parse(appSettingsJSON) : undefined;
  },
  setActiveSection: (activeSection: AppSettingsModel) => {
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(activeSection));
  }
}