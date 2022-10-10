import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Menu, MenuProps } from "antd";
import { Section } from "../../models";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addSection } from "../../store/sectionsReducer";
import './Sections.scss';

export interface ISections {
  onSectionSelected: (section: Section) => void;
  selectedSection: Section;
}

export const Sections: React.FC<ISections> = ({ onSectionSelected, selectedSection }) => {
  const sections = useAppSelector((state) => state.sections.sections);
  const dispatch = useAppDispatch();

  const sectionsNavItems: MenuProps["items"] = sections.map((s) => ({
    label: s.name,
    key: s.name,
  }));

  const onClick: MenuProps["onClick"] = (e) => {
    const section = sections.find(s => s.name === e.key);
    onSectionSelected(section!);
  };

  const addNewSection = async () => {
    const tempName = new Date().toISOString();

    dispatch(addSection({ name: tempName, pages: [] }));
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
        onClick={addNewSection}
        icon={<PlusCircleOutlined />}
      ></Button>
    </div>
  );
};
