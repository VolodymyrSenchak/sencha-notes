import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Menu, MenuProps } from "antd";
import { orderBy } from "lodash";
import { useQuery } from "react-query";
import { Section } from "../../models";
import { queryKeys } from "../../services/queryKeys";
import { sectionsService } from "../../services/sectionsService";
import "./Sections.scss";

export interface ISections {
  selectedSection: Section;
  onAddSection: () => void;
  onSectionSelected: (sectionName: string) => void;
}

export const Sections: React.FC<ISections> = ({
  onSectionSelected,
  selectedSection,
  onAddSection,
}) => {
  const sectionsQuery = useQuery(queryKeys.sections, sectionsService.getSections);
  const orderedSections = orderBy(sectionsQuery?.data || [], s => s.createdAt);
  const sectionsNavItems: MenuProps["items"] = orderedSections.map((s) => ({
    label: s.name,
    key: s.name,
  }));

  const onClick: MenuProps["onClick"] = (e) => {
    onSectionSelected(e.key);
  };

  return (
    <div className="flex-align-items-center sections-menu">
      <Menu
        mode="horizontal"
        onClick={onClick}
        selectedKeys={[selectedSection.name]}
        items={sectionsNavItems}
        className="flex-1"
      ></Menu>

      <Button
        type="text"
        title="Add new section"
        onClick={onAddSection}
        icon={<PlusCircleOutlined />}
      ></Button>
    </div>
  );
};
