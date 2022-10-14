import { DeleteFilled, EditTwoTone, PlusCircleTwoTone } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

export interface ISectionActions {
  onAddNewPage: () => void;
  onDeleteThisSection: () => void;
  onEditThisSection: () => void;
}

export const SectionActions: React.FC<ISectionActions> = ({
  onAddNewPage,
  onDeleteThisSection,
  onEditThisSection
}) => {
  return (
    <div>
      <Button
        type="text"
        size="large"
        title="Add new page"
        icon={<PlusCircleTwoTone />}
        onClick={onAddNewPage}
      ></Button>

      <Button
        type="text"
        size="large"
        title="Edit this section"
        onClick={onEditThisSection}
        icon={<EditTwoTone color="#ececec" />}
      ></Button>
      
      <Popconfirm
        title="Are you sure to delete this section?"
        onConfirm={onDeleteThisSection}
        okText="Delete"
        cancelText="Cancel"
      >
        <Button
          type="text"
          size="large"
          title="Delete this section"
          icon={<DeleteFilled />}
          danger
        ></Button>
      </Popconfirm>
    </div>
  );
};
