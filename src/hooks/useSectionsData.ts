import { useMutation, useQuery, useQueryClient } from "react-query";
import { Section } from "../models";
import { queryKeys } from "../services/queryKeys";
import { sectionsService } from "../services/sectionsService";

export const useSectionsData = () => {
  const queryClient = useQueryClient();
  const sectionsQuery = useQuery(queryKeys.sections, sectionsService.getSections);

  const sections = sectionsQuery.data;

  const editSectionMutator = useMutation({
    mutationFn: (sc: Section) => sectionsService.editSection(sc),
    onSuccess: ([key, sc]) => {
      queryClient.setQueryData([queryKeys.sections, key], sc)
    }
  });

  const deleteSectionMutator = useMutation({
    mutationFn: (key: string) => sectionsService.deleteSection(key),
    onSuccess: () => queryClient.removeQueries(queryKeys.sections),
  });

  const addSectionMutator = useMutation({
    mutationFn: (key: Section) => sectionsService.addSection(key),
    onSuccess: () => queryClient.resetQueries(queryKeys.sections),
  });

  return {
    sectionsQuery,
    sections,
    editSectionMutator,
    addSectionMutator,
    deleteSectionMutator,
  };
}