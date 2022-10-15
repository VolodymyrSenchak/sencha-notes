import { FrownOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";

export interface ISectionWithoutPages {
    onAddNewPage: () => void;
}

export const SectionWithoutPages: React.FC<ISectionWithoutPages> = ({ onAddNewPage }) => {
  return (
    <div className="flex-column flex-align-items-center height-full flex-justify-content-center">
      <FrownOutlined
        className="margin-bottom-1"
        style={{ fontSize: "5rem" }}
        size={64}
      />
      <Typography.Title level={4}>There are no pages yet</Typography.Title>
      <Button size="large" type="primary" onClick={onAddNewPage}>
        Add new page
      </Button>
    </div>
  );
};
