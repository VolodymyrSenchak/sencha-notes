import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Menu, Popover } from "antd";
import { useState } from "react";
import { ActiveSection, Section } from "../../../models";

interface ISectionsMenuDisplay {
  onSelectedSection: (e: { key: string }) => void;
  editSectionClicked: (section: Section) => void;
  onSectionDeleteClicked: (sectionId: string) => void;

  activeSection: ActiveSection;
  orderedSections: Section[];
}

export const SectionsMenuDisplay: React.FC<ISectionsMenuDisplay> = ({
  onSelectedSection,
  editSectionClicked,
  onSectionDeleteClicked,
  activeSection,
  orderedSections,
}) => {
  const [popoverSelectedKey, setPopoverSelectedKey] = useState<string>();

  const onContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setPopoverSelectedKey(key);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) setPopoverSelectedKey(undefined);
  };

  return (
    <Menu
      mode="horizontal"
      onClick={onSelectedSection}
      selectedKeys={[activeSection!.sectionId]}
      className="flex-1"
    >
      {orderedSections.map((section) => (
        <Menu.Item
          key={section.id}
          onContextMenu={(e) => onContextMenu(e, section.id as string)}
        >
          <Popover
            content={
              <div className="flex-column context-menu-popover">
                <Button
                  icon={<EditOutlined></EditOutlined>}
                  type="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenChange(false);
                    editSectionClicked(section);
                  }}
                  className="width-full"
                >
                  Edit Section
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  type="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenChange(false);
                    onSectionDeleteClicked(section.id as string);
                  }}
                >
                  Remove Section
                </Button>
              </div>
            }
            trigger="click"
            open={popoverSelectedKey === section.id}
            onOpenChange={handleOpenChange}
          >
            {section.name}
          </Popover>
        </Menu.Item>
      ))}
    </Menu>
  );
};
