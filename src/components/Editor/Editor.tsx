import type Quill from "quill";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import { pageTitle, relativeTime, wordCount } from "../../common/utils/notes";
import { Section, SectionPage } from "../../models";
import { useNotes } from "../NotesApp/NotesContext";
import { dotColor } from "../Sidebar/Sidebar";
import { Icon, MoreIcon } from "../ui/Icon";
import { anchorFromElement, MenuItem } from "../ui/Menu";
import { QUILL_MODULES } from "./quill-modules";
import { Formats, Toolbar } from "./Toolbar";
import "./Editor.scss";

export const Editor: React.FC = () => {
  const { store } = useNotes();
  if (!store.current) return <main className="vn-editor" />;

  // Remount per note so Quill starts clean with that note's content.
  return <NoteEditor key={store.current.page.id} section={store.current.section} page={store.current.page} />;
};

interface NoteEditorProps {
  section: Section;
  page: SectionPage;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ section, page }) => {
  const app = useNotes();
  const { store } = app;
  const [title, setTitle] = useState(page.name);
  const [formats, setFormats] = useState<Formats>({});
  const [saveError, setSaveError] = useState(false);
  const [, setTick] = useState(0);
  const quillRef = useRef<ReactQuill>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const total = store.sections.reduce((n, s) => n + s.pages.length, 0);
  const isFirstRun = total === 1 && !page.name && !page.content.text.replace(/<[^>]+>/g, "").trim();

  // A freshly created note opens with the cursor in its title.
  const { focusNextTitle } = app;
  useEffect(() => {
    if (!focusNextTitle.current) return;
    focusNextTitle.current = false;
    titleRef.current?.focus();
  }, [focusNextTitle]);

  // Keep "Edited 3 min ago" honest while the popup stays open.
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const save = useCallback(
    async (patch: Partial<SectionPage>) => {
      try {
        await store.updatePage(section.id, page.id, patch);
        setSaveError(false);
      } catch (e) {
        console.error("Failed to save note", e);
        setSaveError(true);
      }
    },
    [store, section.id, page.id],
  );

  const getQuill = useCallback((): Quill | undefined => quillRef.current?.getEditor(), []);

  const refreshFormats = useCallback(() => {
    const quill = getQuill();
    const range = quill?.getSelection();
    if (quill && range) setFormats(quill.getFormat(range));
  }, [getQuill]);

  const download = () => {
    const title = escapeHtml(pageTitle(page));
    const html =
      `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head>` +
      `<body><h1>${title}</h1>${page.content.text}</body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = `${pageTitle(page)
      .replace(/[\\/:*?"<>|]+/g, "-")
      .slice(0, 80)}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const moveItems: MenuItem[] = store.sections.map((s) => ({
    label: s.name,
    checked: s.id === section.id,
    disabled: s.id === section.id,
    onSelect: () => store.movePage(page.id, section.id, s.id),
  }));

  const moreItems: MenuItem[] = [
    { label: "Move to", icon: "move", children: moveItems },
    { label: "Duplicate", icon: "copy", onSelect: () => store.duplicatePage(section.id, page) },
    { label: "Download as .html", icon: "download", onSelect: download },
    { divider: true },
    { label: "Delete note", icon: "trash", danger: true, onSelect: () => app.deleteNote(section, page) },
  ];

  const edited = relativeTime(page.updatedAt);
  const words = wordCount(page);

  return (
    <main className="vn-editor">
      <div className="vn-topbar">
        <button
          type="button"
          className="vn-crumb"
          title="Move to another section"
          onClick={(e) =>
            app.openMenu({ anchor: anchorFromElement(e.currentTarget, "start"), items: moveItems, label: "Move to" })
          }
        >
          <span className="vn-dot" style={{ background: dotColor(section) }} aria-hidden="true" />
          <span>{section.name}</span>
        </button>
        <span className={`vn-saved${saveError ? " is-error" : ""}`} role={saveError ? "alert" : undefined}>
          {saveError ? (
            "Couldn’t save — keep this popup open"
          ) : (
            <>
              <Icon name="check" size={13} stroke={2.2} />
              Saved
            </>
          )}
        </span>
        <button
          type="button"
          className="vn-ib"
          aria-pressed={!!page.pinned}
          aria-label={page.pinned ? "Unpin note" : "Pin note"}
          title={page.pinned ? "Unpin note" : "Pin note"}
          onClick={() => store.togglePin(section.id, page)}
        >
          <Icon name="pin" />
        </button>
        <button type="button" className="vn-ib" aria-label="Download note" title="Download as .html" onClick={download}>
          <Icon name="download" />
        </button>
        <button
          type="button"
          className="vn-ib"
          aria-label="More actions"
          title="More"
          onClick={(e) =>
            app.openMenu({
              anchor: anchorFromElement(e.currentTarget, "end"),
              items: moreItems,
              label: "Note actions",
              align: "end",
            })
          }
        >
          <MoreIcon />
        </button>
      </div>

      <div className="vn-doc">
        <div className="vn-doc-inner">
          <label htmlFor="vn-note-title" className="vn-sr">
            Note title
          </label>
          <input
            id="vn-note-title"
            ref={titleRef}
            className="vn-title"
            type="text"
            autoComplete="off"
            placeholder="Untitled"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              save({ name: e.target.value });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || (e.key === "ArrowDown" && !e.altKey)) {
                e.preventDefault();
                getQuill()?.focus();
              }
            }}
          />
          <div className="vn-meta">
            {isFirstRun
              ? "Just now"
              : [edited && `Edited ${edited}`, `${words} word${words === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}
          </div>

          <Toolbar getQuill={getQuill} formats={formats} onFormatsChange={refreshFormats} />

          <ReactQuill
            ref={quillRef}
            className="vn-quill"
            theme="snow"
            modules={QUILL_MODULES}
            defaultValue={page.content.text}
            placeholder={
              isFirstRun
                ? "Start typing. This note is already saved to Inbox — move it into a section later, or never."
                : "Start writing — every keystroke is saved."
            }
            onChange={(html, _delta, source) => {
              // Only user edits are written; loading or re-highlighting a note never rewrites it.
              if (source === "user") save({ content: { text: html } });
              refreshFormats();
            }}
            onChangeSelection={(range, _source, editor) => {
              if (range) setFormats(getQuill()?.getFormat(range) ?? {});
              else if (!editor) setFormats({});
            }}
          />

          {isFirstRun && (
            <div className="vn-shortcuts">
              <div className="vn-group">
                <span>Shortcuts</span>
              </div>
              <div className="vn-shortcuts-grid">
                <div>
                  <kbd>Alt N</kbd>New note
                </div>
                <div>
                  <kbd>Ctrl K</kbd>Search every note
                </div>
                <div>
                  <kbd>[ ]</kbd>then space: checklist
                </div>
                <div>
                  <kbd>-</kbd>then space: bullet list
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" };
const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => HTML_ESCAPES[c]);
