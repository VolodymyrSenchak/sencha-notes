import { useEffect, useMemo, useRef, useState } from "react";
import { htmlToText, orderPages, pageTitle, searchNotes } from "../../common/utils/notes";
import { useNotes } from "../NotesApp/NotesContext";
import { dotColor } from "../Sidebar/Sidebar";
import { Icon } from "../ui/Icon";
import "./SearchPalette.scss";

type Item =
  | { kind: "note"; key: string; run: () => void }
  | { kind: "section"; key: string; run: () => void }
  | { kind: "create"; key: string; run: () => void };

const NOTE_LIMIT = 6;

export const SearchPalette: React.FC = () => {
  const app = useNotes();
  const { store } = app;
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const q = query.trim();
  const total = store.sections.reduce((n, s) => n + s.pages.length, 0);
  const hits = useMemo(() => searchNotes(store.sections, q), [store.sections, q]);
  const notes = hits.slice(0, showAll ? hits.length : q ? NOTE_LIMIT : 5);
  const sections = q ? store.sections.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())) : [];

  const close = () => app.setOverlay(null);

  const items: Item[] = [
    ...notes.map((h) => ({
      kind: "note" as const,
      key: h.page.id,
      run: () => {
        app.openNote(h.section, h.page);
        close();
      },
    })),
    ...sections.map((s) => ({
      kind: "section" as const,
      key: s.id,
      run: () => {
        const [first] = orderPages(s.pages);
        if (first) app.openNote(s, first);
        else app.setSectionOpen(s.id, true);
        close();
      },
    })),
    ...(q ? [{ kind: "create" as const, key: "create", run: () => app.newNote(undefined, q) }] : []),
  ];

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") setActive((a) => Math.min(items.length - 1, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && q) app.newNote(undefined, q);
    else if (e.key === "Enter") items[active]?.run();
    else if (e.key === "Escape") close();
    else return;
    e.preventDefault();
    e.stopPropagation();
  };

  let index = -1;
  const option = () => {
    index += 1;
    const i = index;
    return {
      "data-index": i,
      role: "option",
      "aria-selected": i === active,
      id: `vn-opt-${i}`,
      onMouseMove: () => setActive(i),
      onClick: () => items[i].run(),
    };
  };

  return (
    <>
      <div className="vn-scrim" onMouseDown={close} />
      <div className="vn-palette" role="dialog" aria-label="Search">
        <div className="vn-palette-input">
          <Icon name="search" size={17} stroke={2.2} />
          <label htmlFor="vn-palette-q" className="vn-sr">
            Search notes, sections and actions
          </label>
          <input
            id="vn-palette-q"
            autoFocus
            type="search"
            autoComplete="off"
            role="combobox"
            aria-expanded="true"
            aria-controls="vn-palette-list"
            aria-activedescendant={items.length ? `vn-opt-${active}` : undefined}
            placeholder="Search notes, sections, actions"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowAll(false);
            }}
            onKeyDown={onKeyDown}
          />
          <kbd>Esc</kbd>
        </div>

        <div className="vn-palette-list" id="vn-palette-list" role="listbox" ref={listRef}>
          <div className="vn-palette-group">
            <span>{q ? "Notes" : "Recent"}</span>
            {q && <span>{hits.length ? `${hits.length} of ${total}` : ""}</span>}
          </div>

          {notes.map((h) => {
            const body = htmlToText(h.page.content?.text ?? "");
            return (
              <button type="button" key={h.page.id} className="vn-result" {...option()}>
                <span className="vn-result-main">
                  <span className="vn-result-title">
                    {h.inTitle ? <Highlight text={pageTitle(h.page)} query={q} /> : pageTitle(h.page)}
                  </span>
                  <span className="vn-result-snippet">
                    {h.snippet ? (
                      <>
                        {h.snippet.before}
                        <mark>{h.snippet.match}</mark>
                        {h.snippet.after}
                      </>
                    ) : (
                      body || "Empty note"
                    )}
                  </span>
                </span>
                <span className="vn-chip">
                  <span className="vn-dot" style={{ background: dotColor(h.section) }} aria-hidden="true" />
                  {h.section.name}
                </span>
              </button>
            );
          })}

          {q && hits.length === 0 && <div className="vn-palette-empty">No notes match “{q}”</div>}

          {!showAll && hits.length > notes.length && q && (
            <button type="button" className="vn-palette-more" onClick={() => setShowAll(true)}>
              Show all {hits.length} results
            </button>
          )}

          {sections.length > 0 && (
            <>
              <div className="vn-palette-sep" />
              <div className="vn-palette-group">
                <span>Sections</span>
              </div>
              {sections.map((s) => (
                <button type="button" key={s.id} className="vn-result is-one" {...option()}>
                  <span className="vn-dot" style={{ background: dotColor(s) }} aria-hidden="true" />
                  <span className="vn-result-main">
                    <Highlight text={s.name} query={q} />
                  </span>
                  <span className="vn-chip">
                    {s.pages.length} note{s.pages.length === 1 ? "" : "s"}
                  </span>
                </button>
              ))}
            </>
          )}

          {q && (
            <>
              <div className="vn-palette-sep" />
              <button type="button" className="vn-result is-one" {...option()}>
                <span className="vn-accent-icon">
                  <Icon name="plus" size={15} stroke={2.2} />
                </span>
                <span className="vn-result-main">
                  Create note “<b>{q}</b>” in Inbox
                </span>
                <kbd>Ctrl Enter</kbd>
              </button>
            </>
          )}
        </div>

        <div className="vn-palette-foot">
          <span>
            <kbd>↑↓</kbd> move
          </span>
          <span>
            <kbd>Enter</kbd> open
          </span>
          <span>
            <kbd>Esc</kbd> close
          </span>
        </div>
      </div>
    </>
  );
};

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const i = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
};
