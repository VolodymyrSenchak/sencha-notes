import { useEffect, useRef } from "react";
import { useAppSettingsData } from "../../hooks/useAppSettingsData";
import { AppSettingsModel, OpenOn, PopupSize, TextSize, ThemeMode } from "../../models";
import { ENVIRONMENT_CONFIG } from "../../services";
import { ACCENTS } from "../../services/themes";
import { useNotes } from "../NotesApp/NotesContext";
import { Icon } from "../ui/Icon";
import { ImportExport } from "./ImportExport";
import "./SettingsSheet.scss";

const SIZE_HINT: Record<PopupSize, string> = {
  compact: "650 × 500 px",
  default: "700 × 550 px",
  roomy: "780 × 600 px",
};

export const SettingsSheet: React.FC = () => {
  const app = useNotes();
  const { appSettings, updateAppSettings } = useAppSettingsData();
  const sheetRef = useRef<HTMLElement>(null);
  const close = () => app.setOverlay(null);

  useEffect(() => sheetRef.current?.querySelector<HTMLElement>("button")?.focus(), []);

  function segmented<K extends keyof AppSettingsModel>(
    key: K,
    label: string,
    options: [AppSettingsModel[K], string][],
  ) {
    return (
      <div className="vn-seg" role="group" aria-label={label}>
        {options.map(([value, text]) => (
          <button
            key={String(value)}
            type="button"
            aria-pressed={appSettings[key] === value}
            onClick={() => updateAppSettings({ [key]: value })}
          >
            {text}
          </button>
        ))}
      </div>
    );
  }

  const accent = ACCENTS.find((a) => a.name === appSettings.accent) ?? ACCENTS[0];

  return (
    <>
      <div className="vn-scrim" onMouseDown={close} />
      <section
        ref={sheetRef}
        className="vn-sheet"
        role="dialog"
        aria-labelledby="vn-settings-title"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            close();
          }
        }}
      >
        <div className="vn-sheet-head">
          <h1 id="vn-settings-title">Settings</h1>
          <button type="button" className="vn-ib" aria-label="Close settings" onClick={close}>
            <Icon name="close" stroke={2} />
          </button>
        </div>

        <div className="vn-sheet-body">
          <div>
            <div className="vn-field-label">Appearance</div>
            {segmented<"theme">("theme", "Appearance", [
              ["light" as ThemeMode, "Light"],
              ["dark", "Dark"],
              ["system", "System"],
            ])}
          </div>

          <div>
            <div className="vn-field-label">Accent · {accent.label}</div>
            <div className="vn-swatches" role="group" aria-label="Accent colour">
              {ACCENTS.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  aria-pressed={a.name === appSettings.accent}
                  aria-label={a.label}
                  title={a.label}
                  style={{ "--vn-swatch": a.light, background: a.light } as React.CSSProperties}
                  onClick={() => updateAppSettings({ accent: a.name })}
                />
              ))}
            </div>
          </div>

          {ENVIRONMENT_CONFIG.appMode === "EXTENSION" && (
            <div>
              <div className="vn-field-label">Popup size</div>
              {segmented<"size">("size", "Popup size", [
                ["compact" as PopupSize, "Compact"],
                ["default", "Default"],
                ["roomy", "Roomy"],
              ])}
              <div className="vn-hint">{SIZE_HINT[appSettings.size]}</div>
            </div>
          )}

          <div>
            <div className="vn-field-label">
              <label htmlFor="vn-text-size">Text size</label>
              <span className="vn-field-value">{appSettings.textSize}%</span>
            </div>
            <input
              id="vn-text-size"
              type="range"
              min={90}
              max={120}
              step={10}
              value={appSettings.textSize}
              onChange={(e) => updateAppSettings({ textSize: Number(e.target.value) as TextSize })}
            />
          </div>

          <div>
            <div className="vn-field-label">When the app opens</div>
            {segmented<"openOn">("openOn", "When the app opens", [
              ["last" as OpenOn, "Last note"],
              ["new", "New note"],
            ])}
          </div>

          <ImportExport />
        </div>
      </section>
    </>
  );
};
