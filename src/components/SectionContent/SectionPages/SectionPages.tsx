import { Menu, MenuProps } from "antd";
import { useState } from "react";

const navigationItems: MenuProps['items']  = [
  {
    label: 'First Page',
    key: '1',
  },
  {
    label: 'Second Page',
    key: '2',
  }
]

export const SectionPages: React.FC = () => {
  const [currentKey, setCurrentKey] = useState('1');

  const onClick: MenuProps['onClick'] = e => {
    console.log('click ', e);
    setCurrentKey(e.key);
  };

  return <Menu mode="vertical" onClick={onClick} selectedKeys={[currentKey]} items={navigationItems}></Menu>;
}