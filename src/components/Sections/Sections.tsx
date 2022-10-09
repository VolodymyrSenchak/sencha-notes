import { PlusCircleFilled, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Menu, MenuProps } from "antd";
import { useState } from "react";

export const Sections: React.FC = () => {
  const [currentKey, setCurrentKey] = useState('');
  const sectionsNavItems: MenuProps['items'] = [];

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrentKey(e.key);
  };

  const addNewSection = async () => {
    const tempName = new Date().toISOString();
    //
  };

  return (
    <div className="flex-align-items-center">
      <Menu
        mode="horizontal"
        onClick={onClick}
        selectedKeys={[currentKey]}
        items={sectionsNavItems}
        className='flex-1'
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
