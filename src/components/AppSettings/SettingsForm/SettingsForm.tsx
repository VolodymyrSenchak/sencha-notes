import { Button, Form, Select } from "antd";
import React, { useMemo } from "react";
import { useAppSettingsData } from "../../../hooks/useAppSettingsData";
import {
  AppSettingsModel,
  AppSize,
  AppZoom,
  SectionsMenuType,
} from "../../../models";
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

  const sectionsMenuTypes = useMemo<SectionsMenuType[]>(
    () => ["menu", "drop-down"],
    []
  );

  const initialFormData: AppSettingsModel = {
    currentTheme: appSettings?.currentTheme || DEFAULT_THEME,
    currentSize: appSettings?.currentSize || "normal",
    appZoom: appSettings?.appZoom || "100%",
    sectionsMenuType: appSettings?.sectionsMenuType || "menu",
  };

  const onFinish = async (data: AppSettingsModel) => {
    setAppSettings({
      currentTheme: data.currentTheme,
      currentSize: data.currentSize,
      appZoom: data.appZoom,
      sectionsMenuType: data.sectionsMenuType,
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
      <div className="flex flex-gap-1">
        <Form.Item
          label="Theme"
          name="currentTheme"
          className="flex-1 margin-bottom-1"
        >
          <Select
            options={APP_THEMES.map((th) => ({
              value: th.name,
              label: th.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Sections Display"
          name="sectionsMenuType"
          className="flex-1 margin-bottom-1"
        >
          <Select
            options={sectionsMenuTypes.map((type) => ({
              value: type,
              label: type,
            }))}
          />
        </Form.Item>
      </div>

      <div className="flex flex-gap-1">
        <Form.Item
          label="App Size"
          name="currentSize"
          className="flex-1 margin-bottom-1"
        >
          <Select
            options={appSizes.map((appSize) => ({
              value: appSize,
              label: appSize,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="App Zoom"
          name="appZoom"
          className="flex-1 margin-bottom-1"
        >
          <Select
            options={appZooms.map((zoom) => ({
              value: zoom,
              label: zoom,
            }))}
          />
        </Form.Item>
      </div>

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
