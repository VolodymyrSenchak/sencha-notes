import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { Section, SectionPage } from "../../models";
import { useAppDispatch } from "../../store/hooks";
import { editSection } from "../../store/sectionsReducer";
import { SectionActions } from "./SectionActions";
import "./SectionContent.scss";
import { SectionPageContent } from "./SectionPageContent";
import { SectionPages } from "./SectionPages";
import { SectionWithoutPages } from "./SectionWithoutPages";

export interface ISectionContent {
  section: Section;
  onDeleteSection: () => void;
}

export const SectionContent: React.FC<ISectionContent> = ({
  section,
  onDeleteSection,
}) => {
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
    return {
      id: v4(),
      name: "",
      content: { text: "" },
      index,
    };
  };

  const addNewPage = () => {
    const newPage = createNewEmptyPage(Math.max(section.pages.length));
    const newSection: Section = {
      ...section,
      pages: [...section.pages, newPage],
    };

    dispatch(editSection(newSection));
    setCurrentPage(newPage);
  };

  const onPageContentChanged = (newPageState: SectionPage) => {
    dispatchEditSection({
      ...section,
      pages: section.pages.map((p) =>
        p.id === newPageState.id ? newPageState : p
      ),
    });

    setCurrentPage(newPageState);
  };

  const onPagesOrderChanged = (newPagesState: SectionPage[]) => {
    dispatchEditSection({
      ...section,
      pages: newPagesState,
    });
  };

  const onPageDelete = (page: SectionPage) => {
    const newState = {
      ...section,
      pages: section.pages.filter((p) => p.id !== page.id),
    };
    const newSelectedPage = newState.pages[0];

    dispatchEditSection(newState);
    setCurrentPage(newSelectedPage);
  };

  return (
    <>
      {section.pages.length > 0 ? (
        <section className="section-details">
          <div className="section-content">
            <div className="section-pages">
              <div className="section-pages-menu">
                <SectionPages
                  selectedPage={currentPage!}
                  pages={section.pages}
                  onPageSelected={(page) => setCurrentPage(page)}
                  onPagesOrderChanged={onPagesOrderChanged}
                />
              </div>

              <SectionActions
                onAddNewPage={addNewPage}
                onDeleteThisSection={onDeleteSection}
                onEditThisSection={() => {}}
              ></SectionActions>
            </div>

            <div className="page-content">
              <SectionPageContent
                page={currentPage}
                isPageDeleteAllowed={section.pages.length > 1}
                onPageChanged={onPageContentChanged}
                onPageDelete={onPageDelete}
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="section-details">
          <SectionWithoutPages onAddNewPage={addNewPage}></SectionWithoutPages>
        </section>
      )}
    </>
  );
};
