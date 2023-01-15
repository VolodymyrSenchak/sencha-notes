import { DeleteFilled } from "@ant-design/icons";
import { Button, Input } from "antd";
import JoditEditor from "jodit-react";
import { SectionPage } from "../../../models";
import { JOBIT_EDITOR_CONFIG } from "./jobitEditorConfig";
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
  const onContentChanged = (text: string) =>
    onPageChanged({ ...page, content: { text } });

  const onSectionNameChanged = (name: string) =>
    onPageChanged({ ...page, name });

  if (!page) return null;

  return (
    <div className="section-page-content height-full flex-column">
      <div className="section-page-content-name flex-align-items-center">
        <Input
          className="page-title-editor"
          placeholder="Enter page name here"
          size="large"
          bordered={false}
          value={page.name}
          onChange={(e) => onSectionNameChanged(e.target.value)}
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
        <JoditEditor
          value={page.content.text}
          config={JOBIT_EDITOR_CONFIG}
          // preferred to use only this option to update the content for performance reasons
          onBlur={(newContent) => onContentChanged(newContent)}
        />
      </div>
    </div>
  );
};
