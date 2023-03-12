import { useMutation, useQuery, useQueryClient } from "react-query";
import { AppSettingsModel } from "../models";
import {
  appSettingsService,
  APP_SETTINGS_KEY,
} from "../services/appSettingsService";
import { queryKeys } from "../services/queryKeys";
import { APP_THEMES, DEFAULT_THEME } from "../services/themes";

export const useAppSettingsData = () => {
  const queryClient = useQueryClient();

  const appSettingsQuery = useQuery<AppSettingsModel>(
    [queryKeys.appSettings, APP_SETTINGS_KEY],
    () => appSettingsService.getActiveSection()
  );

  const editAppSettingsMutator = useMutation({
    mutationFn: (appSettings: AppSettingsModel) => {
      appSettingsService.setActiveSection(appSettings);
      return Promise.resolve([APP_SETTINGS_KEY, appSettings]);
    },
    onSuccess: ([key, appSettings]) => {
      queryClient.setQueryData([queryKeys.appSettings, key], appSettings);
    },
  });

  const appSettings = appSettingsQuery.data;

  const appTheme =
    APP_THEMES.find((t) => t.name === appSettings?.currentTheme) ||
    APP_THEMES.find((t) => t.name === DEFAULT_THEME)!;

  const setAppSettings = (value: AppSettingsModel) => {
    editAppSettingsMutator.mutate(value);
  };

  return {
    appSettings,
    appTheme,
    setAppSettings,
  };
};
