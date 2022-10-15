import { Menu, MenuProps } from "antd";
import { SectionPage } from "../../../models";

export interface ISectionPages {
  selectedPage: SectionPage;
  pages: SectionPage[];
  onPageSelected: (page: SectionPage) => void;
}

export const SectionPages: React.FC<ISectionPages> = ({
  selectedPage,
  pages,
  onPageSelected,
}) => {
  const navItems: MenuProps["items"] = pages.map((p) => ({
    label: p.name || "Untitled",
    key: p.id,
  }));

  const onClick: MenuProps["onClick"] = (e) => {
    const newSelection = pages.find((p) => p.id === e.key);
    onPageSelected(newSelection!);
  };

  return (
    <Menu
      mode="vertical"
      onClick={onClick}
      selectedKeys={[selectedPage.id]}
      items={navItems}
    ></Menu>
  )
};
