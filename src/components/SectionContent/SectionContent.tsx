import { Section } from "../../models";
import { SectionActions } from "./SectionActions";
import "./SectionContent.scss";
import { SectionPageContent } from "./SectionPageContent";
import { SectionPages } from "./SectionPages";
import { useSectionContent } from "./useSectionContent";

export interface ISectionContent {
  sectionId: string;
  onDeleteSection: () => void;
}

export const SectionContent: React.FC<ISectionContent> = ({
  sectionId,
  onDeleteSection,
}) => {
  const {
    sectionPages,
    currentPage,
    changeCurrentPage,
    addNewPage,
    handlePageContentChanged,
    handlePageDeletion,
    handlePagesOrderChanged,
  } = useSectionContent({ sectionId });

  return (
    <section className="section-details">
      <div className="section-content">
        <div className="section-pages">
          <div className="section-pages-menu">
            <SectionPages
              selectedPage={currentPage!}
              pages={sectionPages}
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
            isPageDeleteAllowed={sectionPages.length > 1}
            onPageChanged={handlePageContentChanged}
            onPageDelete={handlePageDeletion}
          />
        </div>
      </div>
    </section>
  );
};
