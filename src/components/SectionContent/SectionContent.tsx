import {
  DeleteFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import "./SectionContent.scss";
import { SectionPageContent } from "./SectionPageContent";
import { SectionPages } from "./SectionPages";
import { useSectionContent } from "./useSectionContent";

export interface ISectionContent {
  sectionId: string;
}

export const SectionContent: React.FC<ISectionContent> = ({
  sectionId,
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
          <div className="section-pages-menu flex-1">
            <SectionPages
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
              className="flex-1 margin-x-1"
              icon={<PlusOutlined />}
              onClick={addNewPage}
            >
              New Page
            </Button>
          </div>
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
