import { useLayoutEffect } from "react";
import "./App.scss";
import { NotesApp } from "./components/NotesApp/notesApp";
import { useAppSettingsData } from "./hooks/useAppSettingsData";
import { ENVIRONMENT_CONFIG } from "./services";

function App() {
  const { appSettings } = useAppSettingsData();
  const appModeClass = ENVIRONMENT_CONFIG.appMode === "EXTENSION" ? "is-extension" : "is-site";

  // Theme, accent and popup size are CSS-variable switches on <html> (see styles/tokens.scss).
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (appSettings.theme === "system") root.removeAttribute("data-theme");
    else root.dataset.theme = appSettings.theme;
    root.dataset.accent = appSettings.accent;
    root.dataset.size = appSettings.size;
    root.style.setProperty("--vn-text-zoom", String(appSettings.textSize / 100));
  }, [appSettings]);

  return (
    <div className={`vn-app ${appModeClass}`}>
      <NotesApp />
    </div>
  );
}

export default App;
