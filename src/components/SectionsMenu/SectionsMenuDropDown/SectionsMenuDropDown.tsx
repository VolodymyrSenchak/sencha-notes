import { Button, Dropdown, Popconfirm } from "antd";
import { ActiveSection, Section } from "../../../models";
import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";

interface ISectionsMenuDropDown {
  onSelectedSection: (e: { key: string }) => void;
  editSectionClicked: (section: Section) => void;
  onSectionDeleteClicked: (sectionId: string) => void;

  activeSection: ActiveSection;
  orderedSections: Section[];
}

export const SectionsMenuDropDown: React.FC<ISectionsMenuDropDown> = ({
  activeSection,
  orderedSections,
  onSectionDeleteClicked,
  editSectionClicked,
  onSelectedSection,
}) => {
  const dropDownSectionsMenuProps = {
    items: orderedSections.map((s) => ({
      label: s.name,
      key: s.id,
    })) as any,
    onClick: (e: any) => onSelectedSection!(e),
  };

  const activeSectionDetails = orderedSections.find(
    (s) => s.id === activeSection?.sectionId
  );

  return (
    <div style={{ margin: "0.5rem" }} className="flex-1">
      <Dropdown menu={dropDownSectionsMenuProps}>
        <Button type="default" size="large" className="selected-section">
          {activeSectionDetails?.name}
          <DownOutlined />
        </Button>
      </Dropdown>

      <Button
        style={{ margin: "0 0.5rem" }}
        type="text"
        title="Edit Current Section"
        onClick={() => editSectionClicked(activeSectionDetails!)}
        icon={<EditOutlined />}
      ></Button>

      <Popconfirm
        title="Delete Section"
        description="Are you sure to delete this section?"
        onConfirm={() => onSectionDeleteClicked(activeSection!.sectionId)}
        okText="Delete"
        cancelText="No"
      >
        <Button
          title="Delete Current Section"
          type="text"
          icon={<DeleteOutlined />}
        ></Button>
      </Popconfirm>
    </div>
  );
};
