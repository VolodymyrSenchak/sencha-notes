import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Section } from "../models";
import { queryKeys } from "../services/queryKeys";
import { sectionsService } from "../services/sectionsService";

export const useSectionsData = () => {
  const queryClient = useQueryClient();
  const sectionsQuery = useQuery({
    queryKey: [queryKeys.sections],
    queryFn: sectionsService.getSections
  });

  const isSectionsLoading = sectionsQuery.isLoading;
  const sections = sectionsQuery.data;

  const removeSectionsQueries = () => {
    queryClient.removeQueries({ queryKey: [queryKeys.sections], exact: true });
  };

  const resetSectionsQueries = () => {
    queryClient.removeQueries({ queryKey: [queryKeys.sections], exact: true });
  };

  const editSectionMutator = useMutation({
    mutationFn: (sc: Section) => sectionsService.editSection(sc),
    onSuccess: () => resetSectionsQueries()
  });

  const editSectionDetailsMutator = useMutation({
    mutationFn: (sc: Section) => sectionsService.editSection(sc),
    onSuccess: ([key, sc]) => {
      removeSectionsQueries();
      queryClient.setQueryData([queryKeys.sections, key], sc);
    }
  });

  const deleteSectionMutator = useMutation({
    mutationFn: (key: string) => sectionsService.deleteSection(key),
    onSuccess: () => removeSectionsQueries(),
  });

  const addSectionMutator = useMutation({
    mutationFn: (key: Section) => sectionsService.addSection(key),
    onSuccess: () => resetSectionsQueries(),
  });

  return {
    sectionsQuery,
    sections,
    isSectionsLoading,
    editSectionMutator,
    editSectionDetailsMutator,
    addSectionMutator,
    deleteSectionMutator,
  };
}