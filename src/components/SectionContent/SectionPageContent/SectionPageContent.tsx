import { Input } from "antd";
import { SectionPageContent as SectionPageContentModel } from "../../../models";

export interface ISectionPageContent {
  pageContent: SectionPageContentModel;
  onPageContentChanged: (content: SectionPageContentModel) => void;
}

export const SectionPageContent: React.FC<ISectionPageContent> = ({
  pageContent,
  onPageContentChanged
}) => {
  const { TextArea } = Input;

  const onChanged = (text: string) => {
    onPageContentChanged({ text })
  }

  return (
    <div style={{ height: "100%" }}>
      <TextArea
        readOnly={false}
        value={pageContent?.text}
        style={{ height: "100%", resize: 'none' }}
        onChange={e => onChanged(e.target.value)}
      ></TextArea>
    </div>
  );
};
