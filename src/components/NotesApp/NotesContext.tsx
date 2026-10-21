import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { pageTitle } from "../../common/utils/notes";
import { NotesStore, useNotesStore } from "../../hooks/useNotesStore";
import { Section, SectionPage } from "../../models";
import { MenuAnchor, MenuItem } from "../ui/Menu";

type Overlay = "search" | "settings" | null;

interface ToastState {
  id: number;
  message: string;
  undo?: () => void;
}

interface ConfirmState {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
}

interface MenuState {
  anchor: MenuAnchor;
  items: MenuItem[];
  label: string;
  align?: "start" | "end";
}

const OPEN_SECTIONS_KEY = "vn-open-sections";

function readOpenSections(): string[] | null {
  try {
    const json = localStorage.getItem(OPEN_SECTIONS_KEY);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

const useNotesAppState = () => {
  const store = useNotesStore();
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [storedOpen, setStoredOpen] = useState<string[] | null>(readOpenSections);

  // Until the user toggles anything, the Inbox and the section of the open note are expanded.
  const { sections, current } = store;

  // A menu belongs to the note it was opened for; close it when the open note changes.
  const currentPageId = current?.page.id;
  useEffect(() => setMenu(null), [currentPageId]);

  const openSections = useMemo(() => {
    if (storedOpen) return new Set(storedOpen);
    const ids = sections.filter((s) => s.isInbox).map((s) => s.id);
    if (current) ids.push(current.section.id);
    return new Set(ids);
  }, [storedOpen, sections, current]);

  const setSectionOpen = useCallback(
    (sectionId: string, open: boolean) => {
      const next = new Set(openSections);
      if (open) next.add(sectionId);
      else next.delete(sectionId);
      const list = Array.from(next);
      localStorage.setItem(OPEN_SECTIONS_KEY, JSON.stringify(list));
      setStoredOpen(list);
    },
    [openSections],
  );

  const notify = useCallback((message: string, undo?: () => void) => setToast({ id: Date.now(), message, undo }), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const openNote = useCallback(
    (section: Section, page: SectionPage) => {
      store.select(section.id, page.id);
      if (!openSections.has(section.id)) setSectionOpen(section.id, true);
    },
    [store, openSections, setSectionOpen],
  );

  // Set right before creating a note; the next editor that mounts focuses its title and clears it.
  const focusNextTitle = useRef(false);

  const newNote = useCallback(
    async (sectionId?: string, name = "") => {
      focusNextTitle.current = true;
      setOverlay(null);
      try {
        const created = await store.createNote(sectionId, name);
        if (!openSections.has(created.sectionId)) setSectionOpen(created.sectionId, true);
        return created.page;
      } catch (e) {
        focusNextTitle.current = false;
        throw e;
      }
    },
    [store, openSections, setSectionOpen],
  );

  const deleteNote = useCallback(
    async (section: Section, page: SectionPage) => {
      const deleted = await store.deletePage(section.id, page.id);
      if (deleted) notify(`“${pageTitle(page)}” deleted`, () => store.restore(deleted));
    },
    [store, notify],
  );

  const deleteSection = useCallback(
    (section: Section) => {
      const count = section.pages.length;
      setConfirm({
        title: `Delete “${section.name}”?`,
        body: count
          ? `This section and its ${count} note${count === 1 ? "" : "s"} will be deleted. You can undo right after.`
          : "This empty section will be deleted.",
        confirmLabel: "Delete section",
        onConfirm: async () => {
          setConfirm(null);
          const deleted = await store.deleteSection(section.id);
          if (deleted) notify(`“${section.name}” deleted`, () => store.restore(deleted));
        },
      });
    },
    [store, notify],
  );

  return {
    store,
    overlay,
    setOverlay,
    toast,
    notify,
    dismissToast,
    confirm,
    setConfirm,
    menu,
    openMenu: setMenu,
    closeMenu: useCallback(() => setMenu(null), []),
    focusNextTitle,
    openSections,
    setSectionOpen,
    openNote,
    newNote,
    deleteNote,
    deleteSection,
  };
};

export type NotesAppState = ReturnType<typeof useNotesAppState> & { store: NotesStore };

const NotesContext = createContext<NotesAppState | null>(null);

export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const state = useNotesAppState();
  return <NotesContext.Provider value={state}>{children}</NotesContext.Provider>;
};

export const useNotes = (): NotesAppState => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used inside NotesProvider");
  return ctx;
};
