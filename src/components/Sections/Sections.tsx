import { PlusCircleFilled, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Menu, MenuProps } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addSection, fetchSections } from "../../store/sectionsReducer";

export const Sections: React.FC = () => {
  const count = useAppSelector((state) => state.sections.sections);
  const dispatch = useAppDispatch();

  const [currentKey, setCurrentKey] = useState('');
  const sectionsNavItems: MenuProps['items'] = [];

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrentKey(e.key);
  };

  useEffect(() => {
    dispatch(fetchSections());
  }, []);

  const addNewSection = async () => {
    const tempName = new Date().toISOString();
    
    dispatch(addSection({ name: tempName }));
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
