import { SettingOutlined } from "@ant-design/icons";
import { Button, Modal, Tabs } from "antd";
import { useState } from "react";
import { ImportExport } from "./ImportExport/ImportExport";
import { SettingsForm } from "./SettingsForm/SettingsForm";

export interface IAppSettings {}

export const AppSettings: React.FC<IAppSettings> = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const closeModal = () => setModalVisible(false);

  return (
    <>
      <Button
        type="text"
        icon={<SettingOutlined />}
        title="Settings"
        className="margin-right-1"
        onClick={() => setModalVisible(true)}
      ></Button>

      {isModalVisible && (
        <Modal
          open={isModalVisible}
          title="App Settings"
          width={340}
          footer={null}
          maskClosable={false}
          onCancel={closeModal}
        >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: "Settings",
                key: "1",
                children: <SettingsForm formSubmitted={closeModal} />,
              },
              {
                label: "Import/Export",
                key: "2",
                children: <ImportExport />,
              },
            ]}
          />
        </Modal>
      )}
    </>
  );
};
