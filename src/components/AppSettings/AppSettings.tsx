import { SettingOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Select } from "antd";
import { useMemo, useState } from "react";
import { useAppSettingsData } from "../../hooks/useAppSettingsData";
import { AppSettingsModel, AppSize, AppZoom } from "../../models";
import { APP_THEMES, DEFAULT_THEME } from "../../services/themes";

export interface IAppSettings {}

export const AppSettings: React.FC<IAppSettings> = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { appSettings, setAppSettings } = useAppSettingsData();

  const appSizes = useMemo<AppSize[]>(() => ["small", "normal", "large"], []);
  const appZooms = useMemo<AppZoom[]>(() => ["90%", "100%", "110%", "120%"], []);

  const initialFormData: AppSettingsModel = {
    currentTheme: appSettings?.currentTheme || DEFAULT_THEME,
    currentSize: appSettings?.currentSize || "normal",
    appZoom: appSettings?.appZoom || "100%",
  };

  const closeModal = () => setModalVisible(false);

  const onFinish = async (data: AppSettingsModel) => {
    setAppSettings({
      currentTheme: data.currentTheme,
      currentSize: data.currentSize,
      appZoom: data.appZoom
    });

    closeModal();
  };

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
          width={300}
          footer={null}
          maskClosable={false}
          onCancel={closeModal}
        >
          <Form
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            initialValues={initialFormData}
          >
            <Form.Item label="Theme" name="currentTheme">
              <Select
                options={APP_THEMES.map((th) => ({
                  value: th.name,
                  label: th.name,
                }))}
              />
            </Form.Item>

            <Form.Item label="App Size" name="currentSize">
              <Select
                options={appSizes.map((appSize) => ({
                  value: appSize,
                  label: appSize,
                }))}
              />
            </Form.Item>

            <Form.Item label="App Zoom" name="appZoom">
              <Select
                options={appZooms.map((zoom) => ({
                  value: zoom,
                  label: zoom,
                }))}
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" size="large" htmlType="submit">
                  Save
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};
