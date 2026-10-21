import { isEmpty, isNil } from "lodash";
import { useRef, useState } from "react";
import { v4 } from "uuid";
import { downloadObjectAsJson, readFile } from "../../common/utils/fileUtils";
import { Section } from "../../models";
import { sectionsService } from "../../services/sectionsService";
import { useNotes } from "../NotesApp/NotesContext";
import { Icon } from "../ui/Icon";

interface SectionToImport {
  section: Section;
  import: boolean;
  replaces: boolean;
}

// Same file format as v1: a JSON array of sections, so old backups keep working.
export const validateSectionsFile = (data: unknown): data is Section[] => {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item: Section) =>
      item &&
      !isEmpty(item.name) &&
      Array.isArray(item.pages) &&
      item.pages.every((page) => page && !isNil(page.content)),
  );
};

export const ImportExport: React.FC = () => {
  const app = useNotes();
  const { store } = app;
  const fileRef = useRef<HTMLInputElement>(null);
  const [toImport, setToImport] = useState<SectionToImport[]>([]);
  const [error, setError] = useState<string | null>(null);

  const total = store.sections.reduce((n, s) => n + s.pages.length, 0);

  const exportAll = async () => {
    const all = await sectionsService.getSections();
    downloadObjectAsJson(all, `sennotes-${new Date().toISOString().slice(0, 10)}`);
  };

  const onFile = async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    try {
      const data = await readFile<unknown>(file);
      if (!validateSectionsFile(data)) throw new Error("invalid");
      const names = new Set(store.sections.map((s) => s.name.trim().toLowerCase()));
      setToImport(
        data.map((section) => ({ section, import: true, replaces: names.has(section.name.trim().toLowerCase()) })),
      );
    } catch {
      setError("This file doesn’t look like a SenNotes export.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const runImport = async () => {
    const existing = await sectionsService.getSections();
    const selected = toImport.filter((s) => s.import).map((s) => s.section);
    const hasInbox = existing.some((s) => s.isInbox);

    for (const incoming of selected) {
      // Same name → replaces that section (the v1 behaviour, shown as a warning before importing).
      const sameName = existing.find((s) => s.name.trim().toLowerCase() === incoming.name.trim().toLowerCase());

      // Never overwrite a different section that happens to share the id.
      const idTaken = existing.some((s) => s.id === incoming.id && s.id !== sameName?.id);
      const id = idTaken ? v4() : incoming.id;
      const keepsInbox = incoming.isInbox && (!hasInbox || sameName?.isInbox);

      // Write the imported copy first; only then remove the section it replaces.
      await sectionsService.editSection({
        ...incoming,
        id,
        isInbox: keepsInbox || undefined,
        createdAt: incoming.createdAt ?? new Date(),
      });
      if (sameName && sameName.id !== id) await sectionsService.deleteSection(sameName.id);
    }

    await store.reload();
    setToImport([]);
    app.notify(`Imported ${selected.length} section${selected.length === 1 ? "" : "s"}`);
  };

  const replacing = toImport.filter((s) => s.import && s.replaces).length;

  return (
    <div className="vn-data">
      <div className="vn-field-label">Your data</div>
      <p>
        {total} note{total === 1 ? "" : "s"} in {store.sections.length} section{store.sections.length === 1 ? "" : "s"},
        stored in this browser only. Export a backup before you clear browsing data.
      </p>
      <div className="vn-data-actions">
        <button type="button" className="vn-btn" onClick={exportAll}>
          <Icon name="download" size={14} stroke={2} />
          Export all
        </button>
        <button type="button" className="vn-btn" onClick={() => fileRef.current?.click()}>
          <Icon name="upload" size={14} stroke={2} />
          Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="vn-sr"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>

      {error && (
        <p className="vn-data-error" role="alert">
          {error}
        </p>
      )}

      {toImport.length > 0 && (
        <div className="vn-import">
          <div className="vn-field-label">Choose sections to import</div>
          {toImport.map((item, i) => (
            <label key={`${item.section.id}-${i}`} className="vn-check">
              <input
                type="checkbox"
                checked={item.import}
                onChange={(e) =>
                  setToImport(toImport.map((t, j) => (j === i ? { ...t, import: e.target.checked } : t)))
                }
              />
              <span className="vn-check-label">{item.section.name}</span>
              <span className="vn-check-meta">
                {item.section.pages.length} note{item.section.pages.length === 1 ? "" : "s"}
                {item.replaces ? " · replaces existing" : ""}
              </span>
            </label>
          ))}
          {replacing > 0 && (
            <p className="vn-data-warn">
              {replacing} existing section{replacing === 1 ? "" : "s"} with the same name will be replaced by the
              imported version.
            </p>
          )}
          <div className="vn-data-actions">
            <button type="button" className="vn-btn" onClick={() => setToImport([])}>
              Cancel
            </button>
            <button
              type="button"
              className="vn-btn is-primary"
              disabled={toImport.every((t) => !t.import)}
              onClick={runImport}
            >
              Import {toImport.filter((t) => t.import).length}
            </button>
          </div>
        </div>
      )}

      <div className="vn-sync">
        <span>Sync across devices</span>
        <span className="vn-pill">Coming soon</span>
      </div>
    </div>
  );
};
