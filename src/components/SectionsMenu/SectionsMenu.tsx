import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Menu, MenuProps, Popover } from "antd";
import { orderBy } from "lodash";
import { useState } from "react";
import { useQuery } from "react-query";
import { useActiveSectionData } from "../../hooks/useSectionSelection";
import { Section } from "../../models";
import { queryKeys } from "../../services/queryKeys";
import { sectionsService } from "../../services/sectionsService";
import { AppSettings } from "../AppSettings/AppSettings";
import { SectionEdit } from "./SectionEdit/SectionEdit";
import "./SectionsMenu.scss";

export interface ISections {
  onAddSection: () => void;
  onSectionDeleteCalled: (sectionId: string) => void;
}

export const SectionsMenu: React.FC<ISections> = ({
  onAddSection,
  onSectionDeleteCalled,
}) => {
  const [popoverSelectedKey, setPopoverSelectedKey] = useState<string>();
  const [sectionForEdit, setSectionForEdit] = useState<Section>();

  const { activeSection, setActiveSection } = useActiveSectionData();

  const sectionsQuery = useQuery(
    queryKeys.sections,
    sectionsService.getSections
  );
  const orderedSections = orderBy(
    sectionsQuery?.data || [],
    [s => s.displayOrder, (s) => s.createdAt]
  );

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key !== activeSection?.sectionId) {
      const section = orderedSections.find(s => s.id === e.key);
      const [firstPage] = orderBy(section!.pages, (p) => p.index);
      setActiveSection({ sectionId: section!.id, sectionPageId: firstPage.id });
    }
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

  const editSectionClicked = (section: Section) => {
    handleOpenChange(false);
    setSectionForEdit(section);
  };

  const onSectionEditingStopped = () => {
    setSectionForEdit(undefined);
  };

  return (
    <div className="flex-align-items-center sections-menu">
      <Button
        type="default"
        title="Add new section"
        className="add-new-section-btn"
        onClick={onAddSection}
        icon={<PlusOutlined />}
      >
        New Section
      </Button>

      <Menu
        mode="horizontal"
        onClick={onClick}
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
                    onClick={(e) => { e.stopPropagation(); editSectionClicked(section); }}
                    className="width-full"
                  >
                    Edit Section
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    type="text"
                    onClick={(e) => { e.stopPropagation(); onSectionDeleteClicked(section.id as string) }}
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

      <AppSettings></AppSettings>

      <SectionEdit
        section={sectionForEdit}
        isModalOpened={!!sectionForEdit}
        onCloseModal={onSectionEditingStopped}
      ></SectionEdit>
    </div>
  );
};
