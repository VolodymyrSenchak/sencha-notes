import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { ActiveSection } from "../models";
import { queryKeys } from "../services/queryKeys";

// Same key and shape as v1, so the last opened note is kept across the update.
const ACTIVE_SECTION_KEY = "active-section";
const QUERY_KEY = [queryKeys.activeSection, ACTIVE_SECTION_KEY];

const readActiveSection = (): ActiveSection | null => {
  try {
    const json = localStorage.getItem(ACTIVE_SECTION_KEY);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
};

export const useActiveSectionData = () => {
  const queryClient = useQueryClient();

  // React Query v5 rejects `undefined` query data, so "nothing selected yet" is null.
  const selectedSectionQuery = useQuery<ActiveSection | null>({
    queryKey: QUERY_KEY,
    queryFn: readActiveSection,
    staleTime: Infinity,
  });

  // Synchronous on purpose: the editor must switch in the same render as the click,
  // so no menu or shortcut can act on the previously open note.
  const setActiveSection = useCallback(
    (value: ActiveSection) => {
      localStorage.setItem(ACTIVE_SECTION_KEY, JSON.stringify(value));
      queryClient.setQueryData(QUERY_KEY, value);
    },
    [queryClient],
  );

  return {
    activeSection: selectedSectionQuery.data ?? undefined,
    setActiveSection,
  };
};
