import { AppstoreAddOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, MenuProps } from "antd";
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
  const sectionsQuery = useQuery(
    queryKeys.sections,
    sectionsService.getSections
  );
  const orderedSections = orderBy(
    sectionsQuery?.data || [],
    (s) => s.createdAt
  );
  const sectionsNavItems: MenuProps["items"] = orderedSections.map((s) => ({
    label: s.name,
    key: s.name,
  }));

  const onClick: MenuProps["onClick"] = (e) => {
    onSectionSelected(e.key);
  };

  return (
    <div className="flex-align-items-center sections-menu">
      <Button
        type="text"
        title="Add new section"
        className="add-new-section-btn"
        onClick={onAddSection}
        icon={<AppstoreAddOutlined />}
      ></Button>

      <Menu
        mode="horizontal"
        onClick={onClick}
        selectedKeys={[selectedSection.name]}
        className="flex-1"
      >
        {sectionsNavItems.map((it) => (
          <Menu.Item key={it?.key}>
            {it?.key}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};
