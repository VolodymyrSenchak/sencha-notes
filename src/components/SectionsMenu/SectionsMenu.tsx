import { Button } from "antd";
import { orderBy } from "lodash";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useActiveSectionData } from "../../hooks/useSectionSelection";
import { Section } from "../../models";
import { queryKeys } from "../../services/queryKeys";
import { sectionsService } from "../../services/sectionsService";
import { AppSettings } from "../AppSettings/AppSettings";
import { SectionEdit } from "./SectionEdit/SectionEdit";
import "./SectionsMenu.scss";
import { useAppSettingsData } from "../../hooks/useAppSettingsData";
import { SectionsMenuDisplay } from "./SectionsMenuDisplay/SectionsMenuDisplay";
import { SectionsMenuDropDown } from "./SectionsMenuDropDown/SectionsMenuDropDown";

export interface ISections {
  onAddSection: () => void;
  onSectionDeleteCalled: (sectionId: string) => void;
}

export const SectionsMenu: React.FC<ISections> = ({
  onAddSection,
  onSectionDeleteCalled,
}) => {
  const [sectionForEdit, setSectionForEdit] = useState<Section>();
  const { sectionsMenuType } = useAppSettingsData();
  const { activeSection, setActiveSection } = useActiveSectionData();

  const sectionsQuery = useQuery({
    queryKey: [queryKeys.sections],
    queryFn: sectionsService.getSections
  });

  const orderedSections = orderBy(sectionsQuery?.data || [], [
    (s) => s.displayOrder,
    (s) => s.createdAt,
  ]);

  const onSelectedSection = (e: { key: string }) => {
    if (e.key !== activeSection?.sectionId) {
      const section = orderedSections.find((s) => s.id === e.key);
      const [firstPage] = orderBy(section!.pages, (p) => p.index);
      setActiveSection({ sectionId: section!.id, sectionPageId: firstPage.id });
    }
  };

  const onSectionDeleteClicked = (id: string) => onSectionDeleteCalled(id);
  const editSectionClicked = (section: Section) => setSectionForEdit(section);
  const onSectionEditingStopped = () => setSectionForEdit(undefined);

  return (
    <div className="flex-align-items-center sections-menu">
      {sectionsMenuType === "drop-down" && (
        <SectionsMenuDropDown
          activeSection={activeSection!}
          orderedSections={orderedSections}
          editSectionClicked={editSectionClicked}
          onSectionDeleteClicked={onSectionDeleteClicked}
          onSelectedSection={onSelectedSection}
        />
      )}

      {sectionsMenuType === "menu" && (
        <SectionsMenuDisplay
          activeSection={activeSection!}
          orderedSections={orderedSections}
          editSectionClicked={editSectionClicked}
          onSectionDeleteClicked={onSectionDeleteClicked}
          onSelectedSection={onSelectedSection}
        />
      )}

      <Button
        type="default"
        title="Add section"
        className="add-new-section-btn"
        onClick={onAddSection}
      >Add section</Button>

      <AppSettings></AppSettings>

      <SectionEdit
        section={sectionForEdit}
        isModalOpened={!!sectionForEdit}
        onCloseModal={onSectionEditingStopped}
      ></SectionEdit>
    </div>
  );
};
