import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { Section, SectionPage } from "../../models";
import { useAppDispatch } from "../../store/hooks";
import { editSection } from "../../store/sectionsReducer";

interface IUseSectionContent {
  section: Section;
}

export const useSectionContent = ({ section }: IUseSectionContent) => {
  const [currentPage, setCurrentPage] = useState<SectionPage>(section.pages[0]);
  const dispatch = useAppDispatch();

  const { name } = section;

  useEffect(() => {
    if (section.pages.length > 0) {
      setCurrentPage(section.pages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const dispatchEditSection = (newSectionState: Section) => {
    dispatch(editSection(newSectionState));
  };

  const createNewEmptyPage = (index: number): SectionPage => {
    return { id: v4(), name: "", content: { text: "" }, index };
  };

  const changeCurrentPage = (page: SectionPage) => {
    setCurrentPage(page);
  } 

  const addNewPage = () => {
    const newPage = createNewEmptyPage(Math.max(section.pages.length));
    const newSection: Section = {
      ...section,
      pages: [...section.pages, newPage],
    };

    dispatch(editSection(newSection));
    setCurrentPage(newPage);
  };

  const handlePageContentChanged = (newPage: SectionPage) => {
    dispatchEditSection({
      ...section,
      pages: section.pages.map((p) => (p.id === newPage.id ? newPage : p)),
    });

    setCurrentPage(newPage);
  };

  const handlePagesOrderChanged = (pages: SectionPage[]) => {
    dispatchEditSection({ ...section, pages });
  };

  const handlePageDeletion = (page: SectionPage) => {
    const newState = {
      ...section,
      pages: section.pages.filter((p) => p.id !== page.id),
    };

    dispatchEditSection(newState);
    setCurrentPage(newState.pages[0]);
  };

  return {
    currentPage,
    changeCurrentPage,
    addNewPage,
    handlePageContentChanged,
    handlePagesOrderChanged,
    handlePageDeletion
  }
};
