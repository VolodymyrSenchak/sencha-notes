import { ConfigProvider } from "antd";
import "./App.scss";
import { NotesApp } from "./components/NotesApp/notesApp";
import { useAppSettingsData } from "./hooks/useAppSettingsData";

function App() {
  const { appTheme } = useAppSettingsData();
  const themeConfig = { token: { colorPrimary: appTheme.primaryColor } };

  return (
    <ConfigProvider theme={themeConfig}>
      <div className={`sencha-app ${appTheme.class}`}>
        <NotesApp></NotesApp>
      </div>
    </ConfigProvider>
  );
}

export default App;
