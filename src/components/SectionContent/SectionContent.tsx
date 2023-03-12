import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "./SectionContent.scss";
import { SectionPageContent } from "./SectionPageContent/SectionPageContent";
import { SectionPagesMenu } from "./SectionPagesMenu";
import { useSectionContent } from "./useSectionContent";

export interface ISectionContent {
}

export const SectionContent: React.FC<ISectionContent> = () => {
  const {
    sectionPages,
    currentPage,
    changeCurrentPage,
    addNewPage,
    handlePageContentChanged,
    handlePageDeletion,
    handlePagesOrderChanged,
  } = useSectionContent();

  return (
    <section className="section-details">
      <div className="section-content">
        <div className="section-pages flex-column">
          <div className="section-pages-menu flex-1">
            <SectionPagesMenu
              selectedPage={currentPage!}
              pages={sectionPages}
              onPageSelected={(page) => changeCurrentPage(page)}
              onPagesOrderChanged={handlePagesOrderChanged}
            />
          </div>

          <div className="flex-justify-content-end flex-align-items-center width-full ">
            <Button
              type="primary"
              size="middle"
              title="Add new page"
              className="flex-1 margin-x-1 margin-bottom-1"
              icon={<PlusOutlined />}
              onClick={addNewPage}
            >
              New Page
            </Button>
          </div>
        </div>

        <div className="page-content">
          <SectionPageContent
            page={currentPage!}
            isPageDeleteAllowed={sectionPages.length > 1}
            onPageChanged={handlePageContentChanged}
            onPageDelete={handlePageDeletion}
          />
        </div>
      </div>
    </section>
  );
};
