import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppSettingsModel } from "../models";
import { appSettingsService, APP_SETTINGS_KEY } from "../services/appSettingsService";
import { queryKeys } from "../services/queryKeys";
import { DEFAULT_SETTINGS } from "../services/themes";

export const useAppSettingsData = () => {
  const queryClient = useQueryClient();
  const queryKey = [queryKeys.appSettings, APP_SETTINGS_KEY];

  const { data } = useQuery<AppSettingsModel>({
    queryKey,
    queryFn: () => appSettingsService.getAppSettings(),
    staleTime: Infinity,
  });

  const appSettings = data ?? DEFAULT_SETTINGS;

  // Settings apply immediately; there is no Save step.
  const updateAppSettings = (patch: Partial<AppSettingsModel>) => {
    const next = { ...appSettings, ...patch };
    appSettingsService.setAppSettings(next);
    queryClient.setQueryData(queryKey, next);
  };

  return { appSettings, updateAppSettings };
};
