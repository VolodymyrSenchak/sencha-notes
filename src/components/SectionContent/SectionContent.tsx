import {
  DeleteFilled,
  PlusCircleTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
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
              shape="circle"
              title="Add new page"
              className="margin-right-1"
              icon={<PlusOutlined />}
              onClick={addNewPage}
              style={{ height: "40px", width: "40px" }}
            ></Button>

            <Popconfirm
              title="Are you sure to delete this section?"
              onConfirm={onDeleteSection}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button
                type="primary"
                size="large"
                shape="circle"
                className="margin-right-1"
                title="Delete section"
                icon={<DeleteFilled />}
                danger
              ></Button>
            </Popconfirm>
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
