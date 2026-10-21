import { useMemo, useRef, useState } from "react";
import {
  allNotes,
  isSectionNameTaken,
  matchesNote,
  orderPages,
  pageTitle,
  sectionColor,
} from "../../common/utils/notes";
import { Section, SectionPage } from "../../models";
import { SECTION_COLORS } from "../../services/themes";
import { useNotes } from "../NotesApp/NotesContext";
import { Icon, MoreIcon } from "../ui/Icon";
import { LogoMark } from "../ui/LogoMark";
import { anchorFromElement, MenuItem } from "../ui/Menu";
import "./Sidebar.scss";

type Drag = { type: "page"; pageId: string; sectionId: string } | { type: "section"; sectionId: string };
type Drop = { id: string; pos: "before" | "after" | "into" } | null;

export const Sidebar: React.FC = () => {
  const app = useNotes();
  const { store } = app;
  const [query, setQuery] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [drop, setDrop] = useState<Drop>(null);
  const drag = useRef<Drag | null>(null);

  const q = query.trim().toLowerCase();
  const total = store.sections.reduce((n, s) => n + s.pages.length, 0);
  const pinned = useMemo(() => allNotes(store.sections).filter((n) => n.page.pinned), [store.sections]);

  const tree = useMemo(
    () =>
      store.sections
        .map((section) => {
          const pages = orderPages(section.pages);
          const sectionHit = q && section.name.toLowerCase().includes(q);
          const shown = q && !sectionHit ? pages.filter((page) => matchesNote({ section, page }, q)) : pages;
          return { section, shown, open: q ? shown.length > 0 || !!sectionHit : app.openSections.has(section.id) };
        })
        .filter((row) => !q || row.shown.length > 0 || row.section.name.toLowerCase().includes(q)),
    [store.sections, q, app.openSections],
  );

  const isCurrent = (page: SectionPage) => store.current?.page.id === page.id;

  // ----- menus -----
  const sectionMenu = (section: Section): MenuItem[] => [
    { label: "New note here", icon: "plus", onSelect: () => app.newNote(section.id) },
    ...(section.isInbox ? [] : [{ label: "Rename", icon: "edit" as const, onSelect: () => setRenamingId(section.id) }]),
    {
      custom: (
        <div className="vn-colors" role="group" aria-label="Section colour">
          {SECTION_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={color}
              aria-pressed={sectionColor(section) === color}
              title={color}
              style={{ background: `var(--vn-section-${color})` }}
              onClick={() => {
                store.setSectionColor(section.id, color);
                app.closeMenu();
              }}
            />
          ))}
        </div>
      ),
    },
    ...(section.isInbox
      ? []
      : [
          { divider: true } as const,
          {
            label: "Delete section…",
            icon: "trash" as const,
            danger: true,
            onSelect: () => app.deleteSection(section),
          },
        ]),
  ];

  const noteMenu = (section: Section, page: SectionPage): MenuItem[] => [
    { label: page.pinned ? "Unpin" : "Pin", icon: "pin", onSelect: () => store.togglePin(section.id, page) },
    {
      label: "Move to",
      icon: "move",
      children: store.sections.map((s) => ({
        label: s.name,
        checked: s.id === section.id,
        disabled: s.id === section.id,
        onSelect: () => store.movePage(page.id, section.id, s.id),
      })),
    },
    { label: "Duplicate", icon: "copy", onSelect: () => store.duplicatePage(section.id, page) },
    { divider: true },
    { label: "Delete note", icon: "trash", danger: true, onSelect: () => app.deleteNote(section, page) },
  ];

  const openContext = (e: React.MouseEvent, label: string, items: MenuItem[]) => {
    e.preventDefault();
    app.openMenu({ anchor: { x: e.clientX, y: e.clientY }, items, label });
  };

  // ----- drag and drop -----
  const dragEnabled = !q;
  const endDrag = () => {
    drag.current = null;
    setDrop(null);
  };
  const posFromEvent = (e: React.DragEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return e.clientY < r.top + r.height / 2 ? "before" : "after";
  };

  const onNoteDragOver = (e: React.DragEvent, page: SectionPage) => {
    if (drag.current?.type !== "page") return;
    e.preventDefault();
    setDrop({ id: page.id, pos: posFromEvent(e) });
  };

  const onNoteDrop = (e: React.DragEvent, section: Section, page: SectionPage) => {
    const d = drag.current;
    endDrag();
    if (d?.type !== "page") return;
    e.preventDefault();
    const ordered = orderPages(section.pages).filter((p) => p.id !== d.pageId);
    const at = ordered.findIndex((p) => p.id === page.id);
    const before = posFromEvent(e) === "before" ? page.id : (ordered[at + 1]?.id ?? null);
    store.movePage(d.pageId, d.sectionId, section.id, before);
  };

  const onSectionDragOver = (e: React.DragEvent, section: Section) => {
    const d = drag.current;
    if (!d) return;
    if (d.type === "page") {
      e.preventDefault();
      setDrop({ id: section.id, pos: "into" });
    } else if (!section.isInbox && d.sectionId !== section.id) {
      e.preventDefault();
      setDrop({ id: section.id, pos: posFromEvent(e) });
    }
  };

  const onSectionDrop = (e: React.DragEvent, section: Section) => {
    const d = drag.current;
    const pos = posFromEvent(e);
    endDrag();
    if (!d) return;
    e.preventDefault();
    if (d.type === "page") {
      store.movePage(d.pageId, d.sectionId, section.id, null);
      app.setSectionOpen(section.id, true);
      return;
    }
    const ids = store.sections.filter((s) => !s.isInbox && s.id !== d.sectionId).map((s) => s.id);
    const at = ids.indexOf(section.id) + (pos === "after" ? 1 : 0);
    ids.splice(at, 0, d.sectionId);
    store.reorderSections(ids);
  };

  const dropClass = (id: string) => (drop?.id === id ? ` is-drop-${drop.pos}` : "");

  // ----- rows -----
  const noteRow = (section: Section, page: SectionPage, variant: "note" | "pinned") => (
    <button
      key={`${variant}-${page.id}`}
      type="button"
      className={`vn-row is-${variant}${dropClass(variant === "note" ? page.id : "")}`}
      aria-current={isCurrent(page)}
      draggable={dragEnabled && variant === "note"}
      onDragStart={(e) => {
        drag.current = { type: "page", pageId: page.id, sectionId: section.id };
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", pageTitle(page));
      }}
      onDragOver={variant === "note" ? (e) => onNoteDragOver(e, page) : undefined}
      onDrop={variant === "note" ? (e) => onNoteDrop(e, section, page) : undefined}
      onDragEnd={endDrag}
      onClick={() => app.openNote(section, page)}
      onContextMenu={(e) => openContext(e, pageTitle(page), noteMenu(section, page))}
    >
      {variant === "pinned" && <Icon name="pin" size={13} stroke={2} className="vn-row-icon" />}
      <span className="vn-row-label">{pageTitle(page)}</span>
    </button>
  );

  return (
    <aside className="vn-sidebar" aria-label="Notes">
      <div className="vn-brand">
        <LogoMark size={20} />
        <span className="vn-brand-name">SenNotes</span>
        <button
          type="button"
          className="vn-new"
          aria-label="New note"
          title="New note (Alt N)"
          onClick={() => app.newNote()}
        >
          <Icon name="plus" size={15} stroke={2.2} />
        </button>
      </div>

      <label htmlFor="vn-side-search" className="vn-sr">
        Search notes
      </label>
      <div className="vn-search">
        <Icon name="search" size={14} stroke={2} />
        <input
          id="vn-side-search"
          type="search"
          autoComplete="off"
          placeholder={total === 1 ? "Search 1 note" : "Search notes"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && query && (e.stopPropagation(), setQuery(""))}
        />
        <kbd title="Search everything">Ctrl K</kbd>
      </div>

      <nav className="vn-nav" aria-label="Sections">
        {!q && pinned.length > 0 && (
          <>
            <div className="vn-group">
              <span>Pinned</span>
            </div>
            {pinned.map(({ section, page }) => noteRow(section, page, "pinned"))}
          </>
        )}

        <div className="vn-group">
          <span>Sections</span>
          <button
            type="button"
            className="vn-ib is-sm"
            aria-label="New section"
            title="New section"
            onClick={() => setCreating(true)}
          >
            <Icon name="plus" size={14} stroke={2} />
          </button>
        </div>

        {tree.map(({ section, shown, open }) => (
          <div key={section.id} className="vn-tree-section">
            {renamingId === section.id ? (
              <SectionNameInput
                initial={section.name}
                sections={store.sections}
                exceptId={section.id}
                color={sectionColor(section)}
                onDone={(name) => {
                  setRenamingId(null);
                  if (name && name !== section.name) store.renameSection(section.id, name);
                }}
              />
            ) : (
              <div
                className={`vn-row is-section${dropClass(section.id)}`}
                draggable={dragEnabled && !section.isInbox}
                onDragStart={(e) => {
                  drag.current = { type: "section", sectionId: section.id };
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", section.name);
                }}
                onDragOver={(e) => onSectionDragOver(e, section)}
                onDragLeave={() => drop?.id === section.id && setDrop(null)}
                onDrop={(e) => onSectionDrop(e, section)}
                onDragEnd={endDrag}
                onContextMenu={(e) => openContext(e, section.name, sectionMenu(section))}
              >
                <button
                  type="button"
                  className="vn-row-main"
                  aria-expanded={open}
                  onClick={() => (q ? setQuery("") : app.setSectionOpen(section.id, !open))}
                  onDoubleClick={() => !section.isInbox && setRenamingId(section.id)}
                >
                  <Icon name="chevron" size={14} stroke={2} className="vn-chev" />
                  <span className="vn-dot" style={{ background: dotColor(section) }} aria-hidden="true" />
                  <span className="vn-row-label">{section.name}</span>
                  <span className="vn-count">{q ? shown.length : section.pages.length}</span>
                </button>
                <span className="vn-row-actions">
                  <button
                    type="button"
                    className="vn-ib is-xs"
                    aria-label={`New note in ${section.name}`}
                    title="New note here"
                    onClick={() => app.newNote(section.id)}
                  >
                    <Icon name="plus" size={13} stroke={2.2} />
                  </button>
                  <button
                    type="button"
                    className="vn-ib is-xs"
                    aria-label={`${section.name} options`}
                    title="Options"
                    onClick={(e) =>
                      app.openMenu({
                        anchor: anchorFromElement(e.currentTarget, "start"),
                        items: sectionMenu(section),
                        label: section.name,
                      })
                    }
                  >
                    <MoreIcon size={14} />
                  </button>
                </span>
              </div>
            )}
            {open && shown.map((page) => noteRow(section, page, "note"))}
            {open && !q && shown.length === 0 && (
              <button type="button" className="vn-row is-note is-empty" onClick={() => app.newNote(section.id)}>
                <span className="vn-row-label">No notes yet — add one</span>
              </button>
            )}
          </div>
        ))}

        {creating && (
          <SectionNameInput
            initial=""
            sections={store.sections}
            onDone={async (name) => {
              setCreating(false);
              if (!name) return;
              app.focusNextTitle.current = true;
              const section = await store.createSection(name);
              app.setSectionOpen(section.id, true);
            }}
          />
        )}

        {q && tree.length === 0 && (
          <div className="vn-no-results">
            <div>No notes match “{query.trim()}”</div>
            <button
              type="button"
              className="vn-btn"
              onClick={() => {
                app.newNote(undefined, query.trim());
                setQuery("");
              }}
            >
              Create “{query.trim()}”
            </button>
          </div>
        )}
      </nav>

      <div className="vn-foot">
        <Icon name="lock" size={13} stroke={2} />
        <span>Stored on this device</span>
        <button
          type="button"
          className="vn-ib"
          aria-label="Settings"
          title="Settings"
          onClick={() => app.setOverlay("settings")}
        >
          <Icon name="settings" />
        </button>
      </div>
    </aside>
  );
};

export const dotColor = (section: Section) => `var(--vn-section-${sectionColor(section)})`;

interface SectionNameInputProps {
  initial: string;
  sections: Section[];
  exceptId?: string;
  color?: string;
  onDone: (name: string | null) => void;
}

const SectionNameInput: React.FC<SectionNameInputProps> = ({ initial, sections, exceptId, color, onDone }) => {
  const [value, setValue] = useState(initial);
  const done = useRef(false);
  const name = value.trim();
  const error = name && isSectionNameTaken(sections, name, exceptId) ? "That name is already used" : null;

  const finish = (commit: boolean) => {
    if (done.current) return;
    if (commit && error) return;
    done.current = true;
    onDone(commit && name ? name : null);
  };

  return (
    <div className="vn-rename">
      <span className="vn-dot" style={{ background: `var(--vn-section-${color ?? "green"})` }} aria-hidden="true" />
      <input
        autoFocus
        aria-label="Section name"
        aria-invalid={!!error}
        aria-describedby={error ? "vn-rename-error" : undefined}
        placeholder="Section name"
        value={value}
        maxLength={60}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") finish(true);
          if (e.key === "Escape") {
            e.stopPropagation();
            finish(false);
          }
        }}
        onBlur={() => finish(!error)}
      />
      {error && (
        <div id="vn-rename-error" className="vn-rename-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
