import { max } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { v4 } from "uuid";
import { useSectionsData } from "../../hooks/useSectionsData";
import { useActiveSectionData } from "../../hooks/useSectionSelection";
import { Section, SectionPage } from "../../models";
import { queryKeys } from "../../services/queryKeys";
import { sectionsService } from "../../services/sectionsService";

export const useSectionContent = () => {
  const {activeSection, setActiveSection} = useActiveSectionData();

  const sectionQuery = useQuery(
    {
      queryKey: [queryKeys.sections, activeSection!.sectionId],
      queryFn: ({ queryKey }) => sectionsService.getSection(queryKey[1]),
    }
  );

  const section = sectionQuery.data;
  const sectionPages = section?.pages || [];
  const currentPage = section?.pages.find(page => page.id === activeSection?.sectionPageId);

  const { editSectionDetailsMutator } = useSectionsData();

  const changeCurrentPage = (page: SectionPage) => {
    setActiveSection({ sectionId: section!.id, sectionPageId: page.id });
  } 

  const addNewPage = async () => {
    const index = max(sectionPages.map(s => s.index)) || 0 + 1;
    const newPage: SectionPage = { id: v4(), name: "", content: { text: "" }, index };
    const newSection: Section = { ...section!, pages: [...sectionPages, newPage] };

    await editSectionDetailsMutator.mutateAsync(newSection);
    changeCurrentPage(newPage);
  };

  const handlePageContentChanged = async (newPage: SectionPage) => {
    await editSectionDetailsMutator.mutateAsync({
      ...section!,
      pages: section!.pages.map((p) => (p.id === newPage.id ? newPage : p)),
    });
  };

  const handlePagesOrderChanged = async (pages: SectionPage[]) => {
    await editSectionDetailsMutator.mutateAsync({ ...section!, pages });
  };

  const handlePageDeletion = async (pageId: string) => {
    const newState = { ...section!, pages: section!.pages.filter((p) => p.id !== pageId) };

    await editSectionDetailsMutator.mutateAsync(newState);

    changeCurrentPage(newState.pages[0]);
  };

  return {
    section,
    sectionPages,
    currentPage,
    changeCurrentPage,
    addNewPage,
    handlePageContentChanged,
    handlePagesOrderChanged,
    handlePageDeletion
  }
};
