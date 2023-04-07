import { Button, Form, Select } from "antd";
import React, { useMemo } from "react";
import { useAppSettingsData } from "../../../hooks/useAppSettingsData";
import { AppSettingsModel, AppSize, AppZoom } from "../../../models";
import { APP_THEMES, DEFAULT_THEME } from "../../../services/themes";

interface ISettingsForm {
  formSubmitted: () => void;
}

export const SettingsForm: React.FC<ISettingsForm> = ({ formSubmitted }) => {
  const { appSettings, setAppSettings } = useAppSettingsData();

  const appSizes = useMemo<AppSize[]>(() => ["small", "normal", "large"], []);
  const appZooms = useMemo<AppZoom[]>(
    () => ["90%", "100%", "110%", "120%"],
    []
  );

  const initialFormData: AppSettingsModel = {
    currentTheme: appSettings?.currentTheme || DEFAULT_THEME,
    currentSize: appSettings?.currentSize || "normal",
    appZoom: appSettings?.appZoom || "100%",
  };

  const onFinish = async (data: AppSettingsModel) => {
    setAppSettings({
      currentTheme: data.currentTheme,
      currentSize: data.currentSize,
      appZoom: data.appZoom,
    });

    formSubmitted();
  };

  return (
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
  );
};
