import { Menu, MenuProps } from "antd";
import { useState } from "react";
import { SectionPage } from "../../../models";

export interface ISectionPages {
  selectedPage: SectionPage;
  pages: SectionPage[];
  onPageSelected: (page: SectionPage) => void;
}

export const SectionPages: React.FC<ISectionPages> = ({ selectedPage, pages, onPageSelected }) => {
  const navItems: MenuProps['items'] = pages.map(p => ({ label: p.name, key: p.name }));

  const onClick: MenuProps['onClick'] = e => {
    const selectedPage = pages.find(p => p.name === e.key);
    onPageSelected(selectedPage!);
  };

  return <Menu mode="vertical" onClick={onClick} selectedKeys={[selectedPage.name]} items={navItems}></Menu>;
}