import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Menu, MenuProps } from "antd";
import { useQuery } from "react-query";
import { Section } from "../../models";
import { useAppSelector } from "../../store/hooks";
import "./Sections.scss";

export interface ISections {
  selectedSection: Section;
  onAddSection: () => void;
  onSectionSelected: (sectionName: string) => void;
}

export function getSections(): Promise<Array<Section>> {
  return Promise.resolve<Section[]>([
    {id: "343", name: "zalupa", pages: []  }
  ]);
}

export const Sections: React.FC<ISections> = ({
  onSectionSelected,
  selectedSection,
  onAddSection,
}) => {
  const sections = useAppSelector((state) => state.sections.sections);

  const sectionsQuery = useQuery("sections", getSections);

  const sectionsNavItems: MenuProps["items"] = sectionsQuery.data?.map((s) => ({
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
