import {
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Menu, MenuProps, Popover } from "antd";
import { orderBy } from "lodash";
import { useState } from "react";
import { useQuery } from "react-query";
import { Section } from "../../models";
import { queryKeys } from "../../services/queryKeys";
import { sectionsService } from "../../services/sectionsService";
import "./SectionsMenu.scss";

export interface ISections {
  selectedSection: Section;
  onAddSection: () => void;
  onSectionSelected: (sectionName: string) => void;
  onSectionDeleteCalled: (sectionId: string) => void;
}

export const SectionsMenu: React.FC<ISections> = ({
  onSectionSelected,
  selectedSection,
  onAddSection,
  onSectionDeleteCalled,
}) => {
  const [popoverSelectedKey, setPopoverSelectedKey] = useState<string>();

  const sectionsQuery = useQuery(
    queryKeys.sections,
    sectionsService.getSections
  );
  const orderedSections = orderBy(
    sectionsQuery?.data || [],
    (s) => s.createdAt
  );

  const onClick: MenuProps["onClick"] = (e) => {
    onSectionSelected(e.key);
  };

  const onContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setPopoverSelectedKey(key);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) setPopoverSelectedKey(undefined);
  };

  const onSectionDeleteClicked = (sectionId: string) => {
    handleOpenChange(false);
    onSectionDeleteCalled(sectionId);
  };

  return (
    <div className="flex-align-items-center sections-menu">
      <Button
        type="default"
        title="Add new section"
        className="add-new-section-btn"
        onClick={onAddSection}
        icon={<PlusOutlined />}
      >New Section</Button>

      <Menu
        mode="horizontal"
        onClick={onClick}
        selectedKeys={[selectedSection.name]}
        className="flex-1"
      >
        {orderedSections.map((section) => (
          <Menu.Item
            key={section.name}
            onContextMenu={(e) => onContextMenu(e, section.id as string)}
          >
            <Popover
              content={
                <Button
                  icon={<DeleteOutlined />}
                  type="text"
                  onClick={() => onSectionDeleteClicked(section.id as string)}
                >
                  Remove Section
                </Button>
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
    </div>
  );
};
