import { ConfigProvider } from "antd";
import { useState } from "react";
import "./App.scss";
import { NotesApp } from "./components/NotesApp/notesApp";

const appThemes = {
  lightBlue: { class: "light-blue", primaryColor: "#6096B4" },
  lightGreen: { class: "light-green", primaryColor: "#609966" },
};

function App() {
  const [currentTheme] = useState(appThemes.lightBlue);

  const themeConfig = { token: { colorPrimary: currentTheme.primaryColor } };

  return (
    <ConfigProvider theme={themeConfig}>
      <div className={`sencha-app ${currentTheme.class}`}>
        <NotesApp></NotesApp>
      </div>
    </ConfigProvider>
  );
}

export default App;
