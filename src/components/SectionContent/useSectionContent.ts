import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { v4 } from "uuid";
import { useSectionsData } from "../../hooks/useSectionsData";
import { Section, SectionPage } from "../../models";
import { queryKeys } from "../../services/queryKeys";
import { sectionsService } from "../../services/sectionsService";

interface IUseSectionContent {
  sectionId: string;
}

export const useSectionContent = ({ sectionId }: IUseSectionContent) => {
  const sectionQuery = useQuery(
    {
      queryKey: [queryKeys.sections, sectionId],
      queryFn: () => sectionsService.getSection(sectionId),
    }
  );

  const section = sectionQuery.data;
  const sectionPages = section?.pages || [];

  const [currentPage, setCurrentPage] = useState<SectionPage>(sectionPages[0]);
  const sectionName = section?.name;

  const { editSectionDetailsMutator } = useSectionsData();

  useEffect(() => {
    if (sectionPages.length > 0) {
      setCurrentPage(sectionPages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionName]);

  const createNewEmptyPage = (index: number): SectionPage => {
    return { id: v4(), name: "", content: { text: "" }, index };
  };

  const changeCurrentPage = (page: SectionPage) => {
    setCurrentPage(page);
  } 

  const addNewPage = async () => {
    const newPage = createNewEmptyPage(Math.max(sectionPages.length));
    const newSection: Section = { ...section!, pages: [...sectionPages, newPage] };

    await editSectionDetailsMutator.mutateAsync(newSection);
    setCurrentPage(newPage);
  };

  const handlePageContentChanged = async (newPage: SectionPage) => {
    await editSectionDetailsMutator.mutateAsync({
      ...section!,
      pages: section!.pages.map((p) => (p.id === newPage.id ? newPage : p)),
    });

    setCurrentPage(newPage);
  };

  const handlePagesOrderChanged = async (pages: SectionPage[]) => {
    await editSectionDetailsMutator.mutateAsync({ ...section!, pages });
  };

  const handlePageDeletion = async (page: SectionPage) => {
    const newState = { ...section!, pages: section!.pages.filter((p) => p.id !== page.id) };

    await editSectionDetailsMutator.mutateAsync(newState);

    setCurrentPage(newState.pages[0]);
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
