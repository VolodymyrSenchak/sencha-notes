import { Input } from "antd";
import JoditEditor from "jodit-react";
import { SectionPage } from "../../../models";
import { JOBIT_EDITOR_CONFIG } from "./jobitEditorConfig";

export interface ISectionPageContent {
  page: SectionPage;
  onPageChanged: (page: SectionPage) => void;
}

export const SectionPageContent: React.FC<ISectionPageContent> = ({
  page,
  onPageChanged,
}) => {
  const onContentChanged = (text: string) =>
    onPageChanged({ ...page, content: { text } });

  const onSectionNameChanged = (name: string) =>
    onPageChanged({ ...page, name });

  return (
    <div className="section-page-content height-full flex-column">
      <div className="section-page-content-name">
        <Input
          placeholder="Enter page name here"
          size="large"
          bordered={false}
          value={page.name}
          onChange={(e) => onSectionNameChanged(e.target.value)}
        ></Input>
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
