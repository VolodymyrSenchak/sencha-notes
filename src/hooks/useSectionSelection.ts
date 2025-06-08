import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../services/queryKeys";

export interface ActiveSection {
  sectionId: string;
  sectionPageId: string;
}

const ACTIVE_SECTION_KEY = "active-section";

export const useActiveSectionData = () => {
  const queryClient = useQueryClient();

  const selectedSectionQuery = useQuery<ActiveSection>({
    queryKey: [queryKeys.activeSection, ACTIVE_SECTION_KEY],
    queryFn: () => {
      const activeSectionJson = localStorage.getItem(ACTIVE_SECTION_KEY);
      return activeSectionJson ? JSON.parse(activeSectionJson) : undefined;
    }
  });

  const editSectionDetailsMutator = useMutation({
    mutationFn: (activeSection: ActiveSection) => {
      localStorage.setItem(ACTIVE_SECTION_KEY, JSON.stringify(activeSection));
      return Promise.resolve([ACTIVE_SECTION_KEY, activeSection]);
    },
    onSuccess: ([key, activeSection]) => {
      queryClient.setQueryData([queryKeys.activeSection, key], activeSection);
    }
  });

  const activeSection = selectedSectionQuery.data;

  const setActiveSection = (value: ActiveSection) => {
    editSectionDetailsMutator.mutate(value);
  };

  return {
    activeSection,
    setActiveSection
  };
};
