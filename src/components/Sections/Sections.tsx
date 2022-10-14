import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Menu, MenuProps } from "antd";
import { Section } from "../../models";
import { useAppSelector } from "../../store/hooks";
import './Sections.scss';

export interface ISections {
  selectedSection: Section;
  onAddSection: () => void;
  onSectionSelected: (sectionName: string) => void;
}

export const Sections: React.FC<ISections> = ({ onSectionSelected, selectedSection, onAddSection }) => {
  const sections = useAppSelector((state) => state.sections.sections);

  const sectionsNavItems: MenuProps["items"] = sections.map((s) => ({
    label: s.name,
    key: s.name,
  }));

  const onClick: MenuProps["onClick"] = (e) => {
    onSectionSelected(e.key);
  };

  return (
    <div className="flex-align-items-center">
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
