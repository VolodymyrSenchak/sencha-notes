import { Section } from "../../models";
import { SectionActions } from "./SectionActions";
import "./SectionContent.scss";
import { SectionPageContent } from "./SectionPageContent";
import { SectionPages } from "./SectionPages";
import { useSectionContent } from "./useSectionContent";

export interface ISectionContent {
  section: Section;
  onDeleteSection: () => void;
}

export const SectionContent: React.FC<ISectionContent> = ({
  section,
  onDeleteSection,
}) => {
  const {
    currentPage,
    changeCurrentPage,
    addNewPage,
    handlePageContentChanged,
    handlePageDeletion,
    handlePagesOrderChanged,
  } = useSectionContent({ section });

  return (
    <section className="section-details">
      <div className="section-content">
        <div className="section-pages">
          <div className="section-pages-menu">
            <SectionPages
              selectedPage={currentPage!}
              pages={section.pages}
              onPageSelected={(page) => changeCurrentPage(page)}
              onPagesOrderChanged={handlePagesOrderChanged}
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
            onPageChanged={handlePageContentChanged}
            onPageDelete={handlePageDeletion}
          />
        </div>
      </div>
    </section>
  );
};
