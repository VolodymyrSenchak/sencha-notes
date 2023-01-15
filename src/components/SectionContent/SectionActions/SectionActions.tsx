import { DeleteFilled, EditTwoTone, PlusCircleTwoTone } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

export interface ISectionActions {
  onAddNewPage: () => void;
  onDeleteThisSection: () => void;
}

export const SectionActions: React.FC<ISectionActions> = ({
  onAddNewPage,
  onDeleteThisSection,
}) => {
  return (
    <div className="flex-column">
      <Button
        type="default"
        size="middle"
        title="Add new page"
        icon={<PlusCircleTwoTone />}
        onClick={onAddNewPage}
      >Add new page</Button>
      
      <Popconfirm
        title="Are you sure to delete this section?"
        onConfirm={onDeleteThisSection}
        okText="Delete"
        cancelText="Cancel"
      >
        <Button
          type="default"
          size="middle"
          title="Delete section"
          icon={<DeleteFilled />}
          danger
        >Delete section</Button>
      </Popconfirm>
    </div>
  );
};
