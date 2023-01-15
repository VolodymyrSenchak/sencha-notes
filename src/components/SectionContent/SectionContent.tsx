import { DeleteFilled, PlusCircleTwoTone } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
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
        <div className="section-pages flex-column">
          <Button
            type="default"
            size="middle"
            title="Add new page"
            icon={<PlusCircleTwoTone />}
            onClick={addNewPage}
          >
            Add new page
          </Button>

          <div className="section-pages-menu flex-1">
            <SectionPages
              selectedPage={currentPage!}
              pages={sectionPages}
              onPageSelected={(page) => changeCurrentPage(page)}
              onPagesOrderChanged={handlePagesOrderChanged}
            />
          </div>

          <Popconfirm
            title="Are you sure to delete this section?"
            onConfirm={onDeleteSection}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              type="default"
              size="middle"
              title="Delete section"
              icon={<DeleteFilled />}
              danger
            >
              Delete section
            </Button>
          </Popconfirm>
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
