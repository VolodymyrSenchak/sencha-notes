import { ConfigProvider, theme } from "antd";
import { useLayoutEffect } from "react";
import "./App.scss";
import { NotesApp } from "./components/NotesApp/notesApp";
import { useAppSettingsData } from "./hooks/useAppSettingsData";
import {ENVIRONMENT_CONFIG} from "./services";

function App() {
  const { appTheme, appSize, appZoom } = useAppSettingsData();
  const algorithm = appTheme.mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm;
  const appModeClass = ENVIRONMENT_CONFIG.appMode === "SITE" ? "app-site" : "app-extension";

  const themeConfig = {
    token: { colorPrimary: appTheme.primaryColor },
    algorithm,
  };

  useLayoutEffect(() => {
    const result = document.getElementsByTagName("html");
    const htmlTag = result.item(0)!;
    const zoom = Math.trunc(Number(appZoom.substring(0, appZoom.length - 1)) / 10);

    htmlTag.style.fontSize = `${zoom}px`;
  }, [appZoom]);

  return (
    <ConfigProvider theme={themeConfig}>
      <div className={`sencha-app ${appTheme.class} ${appModeClass} ${appSize}-size ${appTheme.mode}-mode`}>
        <NotesApp></NotesApp>
      </div>
    </ConfigProvider>
  );
}

export default App;
