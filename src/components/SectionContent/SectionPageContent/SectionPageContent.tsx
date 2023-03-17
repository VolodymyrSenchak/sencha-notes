import { DeleteFilled } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { SectionPage } from "../../../models";
import { QUILL_MODULES } from "./quill-modules";
import "./SectionPageContent.scss";

export interface ISectionPageContent {
  page: SectionPage;
  isPageDeleteAllowed: boolean;
  onPageChanged: (page: SectionPage) => void;
  onPageDelete: (page: SectionPage) => void;
}

export const SectionPageContent: React.FC<ISectionPageContent> = ({
  page,
  isPageDeleteAllowed,
  onPageChanged,
  onPageDelete,
}) => {
  const [pageName, setPageName] = useState("");
  const [pageContent, setPageContent] = useState("");
  const pageId = page?.id;

  // Grap page name and content only when page has been changed or created
  useEffect(() => {
    setPageName(page?.name);
    setPageContent(page?.content.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  // Updating page is asynccrounous, so it's better to have inner state for pageName
  useEffect(() => {
    if (pageId) {
      onPageChanged({ ...page, name: pageName });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageName]);

  // Updating page is asynccrounous, so it's better to have inner state for page content
  useEffect(() => {
    if (pageId) {
      onPageChanged({ ...page, content: { text: pageContent } });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageContent]);

  if (!page) return null;

  return (
    <div className="section-page-content height-full flex-column">
      <div className="section-page-content-name flex-align-items-center">
        <Input
          className="page-title-editor"
          placeholder="Enter page name here"
          size="large"
          bordered={false}
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
        ></Input>

        <Button
          type="text"
          size="large"
          title="Delete this page"
          disabled={!isPageDeleteAllowed}
          icon={<DeleteFilled />}
          danger
          onClick={() => onPageDelete(page)}
        ></Button>
      </div>

      <div className="height-stub flex-1">
        <ReactQuill
          modules={QUILL_MODULES}
          className="quill-editor"
          theme="snow"
          value={pageContent}
          onChange={setPageContent}
        />
      </div>
    </div>
  );
};
