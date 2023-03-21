import { ConfigProvider, theme } from "antd";
import "./App.scss";
import { NotesApp } from "./components/NotesApp/notesApp";
import { useAppSettingsData } from "./hooks/useAppSettingsData";

function App() {
  const { appTheme, appSize } = useAppSettingsData();
  const algorithm = appTheme.mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm;

  const themeConfig = {
    token: { colorPrimary: appTheme.primaryColor },
    algorithm,
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div className={`sencha-app ${appTheme.class} ${appSize}-size ${appTheme.mode}-mode`}>
        <NotesApp></NotesApp>
      </div>
    </ConfigProvider>
  );
}

export default App;
