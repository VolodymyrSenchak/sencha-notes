import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import ReactQuill from "react-quill";
import { SectionPage } from "../../../models";
import { QUILL_MODULES } from "./quill-modules";
import "./SectionPageContent.scss";
import { useSectionPageContent } from "./useSectionPageContent";

export interface ISectionPageContent {
  page: SectionPage;
  isPageDeleteAllowed: boolean;
  onPageChanged: (page: SectionPage) => void;
  onPageDelete: (pageId: string) => void;
}

export const SectionPageContent: React.FC<ISectionPageContent> = ({
  page,
  isPageDeleteAllowed,
  onPageChanged,
  onPageDelete,
}) => {
  const usePageContentParams = useSectionPageContent({ page, onPageChanged });

  if (!page) return null;

  return (
    <div className={`transition-content height-full ${usePageContentParams.isLoadingPageContent ? "hidden" : ""}`}>
      {usePageContentParams.isLoadingPageContent ? (
        <></>
      ) : (
        <div className="section-page-content height-full flex-column">
          <div className="section-page-content-name flex-align-items-center">
            <Input
              className="page-title-editor"
              placeholder="Enter page name here"
              size="large"
              bordered={false}
              value={usePageContentParams.pageName}
              onChange={(e) => usePageContentParams.setPageName(e.target.value)}
            ></Input>

            <Button
              type="text"
              size="large"
              title="Delete this page"
              disabled={!isPageDeleteAllowed}
              icon={<DeleteOutlined />}
              onClick={() => onPageDelete(page.id)}
            ></Button>
          </div>

          <div className="height-stub flex-1">
            <ReactQuill
              modules={QUILL_MODULES}
              className="quill-editor"
              theme="snow"
              value={usePageContentParams.pageContent}
              onChange={usePageContentParams.setPageContent}
            />
          </div>
        </div>
      )}
    </div>
  );
};
