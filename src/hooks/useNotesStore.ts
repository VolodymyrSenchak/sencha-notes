import { useQuery, useQueryClient } from "@tanstack/react-query";
import { max, min } from "lodash";
import { useCallback, useMemo } from "react";
import { v4 } from "uuid";
import { orderPages, orderSections } from "../common/utils/notes";
import { Section, SectionColor, SectionPage } from "../models";
import { queryKeys } from "../services/queryKeys";
import { sectionsService } from "../services/sectionsService";
import { useActiveSectionData } from "./useSectionSelection";

export interface DeletedPage {
  kind: "page";
  sectionId: string;
  page: SectionPage;
  position: number;
}

export interface DeletedSection {
  kind: "section";
  section: Section;
}

export type Deleted = DeletedPage | DeletedSection;

const SECTIONS_KEY = [queryKeys.sections];

const newPage = (index: number, name = ""): SectionPage => {
  const now = Date.now();
  return { id: v4(), name, content: { text: "" }, index, createdAt: now, updatedAt: now };
};

/**
 * Every change goes to the query cache first (instant UI) and straight to IndexedDB after.
 * Only fields the user changed are written; existing records are never rewritten on load.
 */
export const useNotesStore = () => {
  const queryClient = useQueryClient();
  const { activeSection, setActiveSection } = useActiveSectionData();

  const sectionsQuery = useQuery({
    queryKey: SECTIONS_KEY,
    queryFn: sectionsService.getSections,
    staleTime: Infinity,
  });

  const sections = useMemo(() => orderSections(sectionsQuery.data ?? []), [sectionsQuery.data]);

  const latest = useCallback(() => queryClient.getQueryData<Section[]>(SECTIONS_KEY) ?? [], [queryClient]);

  const writeCache = useCallback(
    (update: (all: Section[]) => Section[]) =>
      queryClient.setQueryData<Section[]>(SECTIONS_KEY, (all) => update(all ?? [])),
    [queryClient],
  );

  const saveSection = useCallback(
    async (section: Section) => {
      writeCache((all) =>
        all.some((s) => s.id === section.id) ? all.map((s) => (s.id === section.id ? section : s)) : [...all, section],
      );
      await sectionsService.editSection(section);
    },
    [writeCache],
  );

  const select = useCallback(
    (sectionId: string, pageId: string) => setActiveSection({ sectionId, sectionPageId: pageId }),
    [setActiveSection],
  );

  // The active selection, falling back to the first note when the stored one no longer exists.
  const current = useMemo(() => {
    const section = sections.find((s) => s.id === activeSection?.sectionId);
    const page = section?.pages.find((p) => p.id === activeSection?.sectionPageId);
    if (section && page) return { section, page };

    for (const s of sections) {
      const [first] = orderPages(s.pages);
      if (first) return { section: s, page: first };
    }
    return null;
  }, [sections, activeSection]);

  const ensureInbox = useCallback(async (): Promise<Section> => {
    const all = latest();
    const inbox = all.find((s) => s.isInbox);
    if (inbox) return inbox;

    // An existing user section called "Inbox" becomes the inbox instead of creating a duplicate name.
    const named = all.find((s) => s.name.trim().toLowerCase() === "inbox");
    if (named) {
      const marked = { ...named, isInbox: true };
      await saveSection(marked);
      return marked;
    }

    const created: Section = {
      id: v4(),
      name: "Inbox",
      color: "gray",
      isInbox: true,
      pages: [],
      createdAt: new Date(),
    };
    writeCache((s) => [...s, created]);
    await sectionsService.addSection(created);
    return created;
  }, [latest, saveSection, writeCache]);

  const createNote = useCallback(
    async (sectionId?: string, name = ""): Promise<{ sectionId: string; page: SectionPage }> => {
      const target = sectionId ? latest().find((s) => s.id === sectionId) : await ensureInbox();
      if (!target) throw new Error("Section not found");

      // New Inbox notes go on top (newest first); elsewhere they are appended, as before.
      const indexes = target.pages.map((p) => p.index);
      const index = target.isInbox ? (min(indexes) ?? 1) - 1 : (max(indexes) ?? -1) + 1;
      const page = newPage(index, name);

      await saveSection({ ...target, pages: [...target.pages, page] });
      select(target.id, page.id);
      return { sectionId: target.id, page };
    },
    [ensureInbox, latest, saveSection, select],
  );

  const updatePage = useCallback(
    async (sectionId: string, pageId: string, patch: Partial<SectionPage>, touch = true) => {
      const section = latest().find((s) => s.id === sectionId);
      if (!section) return;
      const pages = section.pages.map((p) =>
        p.id === pageId ? { ...p, ...patch, ...(touch ? { updatedAt: Date.now() } : {}) } : p,
      );
      await saveSection({ ...section, pages });
    },
    [latest, saveSection],
  );

  const togglePin = useCallback(
    (sectionId: string, page: SectionPage) => updatePage(sectionId, page.id, { pinned: !page.pinned }, false),
    [updatePage],
  );

  const deletePage = useCallback(
    async (sectionId: string, pageId: string): Promise<DeletedPage | null> => {
      const section = latest().find((s) => s.id === sectionId);
      if (!section) return null;
      const ordered = orderPages(section.pages);
      const position = ordered.findIndex((p) => p.id === pageId);
      if (position < 0) return null;

      const remaining = ordered.filter((p) => p.id !== pageId);
      await saveSection({ ...section, pages: section.pages.filter((p) => p.id !== pageId) });

      if (current?.page.id === pageId) {
        const next = remaining[position] ?? remaining[position - 1];
        if (next) select(section.id, next.id);
      }
      return { kind: "page", sectionId, page: ordered[position], position };
    },
    [current, latest, saveSection, select],
  );

  const duplicatePage = useCallback(
    async (sectionId: string, page: SectionPage) => {
      const section = latest().find((s) => s.id === sectionId);
      if (!section) return;
      const ordered = orderPages(section.pages);
      const at = ordered.findIndex((p) => p.id === page.id);
      const copy: SectionPage = { ...newPage(0, page.name ? `${page.name} (copy)` : ""), content: { ...page.content } };
      ordered.splice(at + 1, 0, copy);
      await saveSection({ ...section, pages: ordered.map((p, i) => ({ ...p, index: i })) });
      select(section.id, copy.id);
    },
    [latest, saveSection, select],
  );

  // Moves a note to another section (or position). `beforePageId` null = end of the list.
  const movePage = useCallback(
    async (pageId: string, fromSectionId: string, toSectionId: string, beforePageId: string | null = null) => {
      const all = latest();
      const from = all.find((s) => s.id === fromSectionId);
      const to = all.find((s) => s.id === toSectionId);
      const page = from?.pages.find((p) => p.id === pageId);
      if (!from || !to || !page || pageId === beforePageId) return;

      const targetPages = orderPages(to.pages).filter((p) => p.id !== pageId);
      const at = beforePageId ? targetPages.findIndex((p) => p.id === beforePageId) : -1;
      targetPages.splice(at < 0 ? targetPages.length : at, 0, page);
      const renumbered = targetPages.map((p, i) => ({ ...p, index: i }));

      if (from.id === to.id) {
        await saveSection({ ...to, pages: renumbered });
      } else {
        await saveSection({ ...from, pages: from.pages.filter((p) => p.id !== pageId) });
        await saveSection({ ...to, pages: renumbered });
        if (current?.page.id === pageId) select(to.id, pageId);
      }
    },
    [current, latest, saveSection, select],
  );

  const createSection = useCallback(
    async (name: string) => {
      const all = latest();
      const page = newPage(0);
      const section: Section = {
        id: v4(),
        name: name.trim(),
        pages: [page],
        createdAt: new Date(),
        displayOrder: (max(all.map((s) => s.displayOrder ?? 0)) ?? 0) + 1,
      };
      writeCache((s) => [...s, section]);
      await sectionsService.addSection(section);
      select(section.id, page.id);
      return section;
    },
    [latest, select, writeCache],
  );

  const renameSection = useCallback(
    async (sectionId: string, name: string) => {
      const section = latest().find((s) => s.id === sectionId);
      if (section) await saveSection({ ...section, name: name.trim() });
    },
    [latest, saveSection],
  );

  const setSectionColor = useCallback(
    async (sectionId: string, color: SectionColor) => {
      const section = latest().find((s) => s.id === sectionId);
      if (section) await saveSection({ ...section, color });
    },
    [latest, saveSection],
  );

  const reorderSections = useCallback(
    async (orderedIds: string[]) => {
      const all = latest();
      const updates = orderedIds
        .map((id, i) => ({ section: all.find((s) => s.id === id), order: i + 1 }))
        .filter((u): u is { section: Section; order: number } => !!u.section && u.section.displayOrder !== u.order);
      for (const { section, order } of updates) await saveSection({ ...section, displayOrder: order });
    },
    [latest, saveSection],
  );

  const deleteSection = useCallback(
    async (sectionId: string): Promise<DeletedSection | null> => {
      const section = latest().find((s) => s.id === sectionId);
      if (!section || section.isInbox) return null;

      writeCache((all) => all.filter((s) => s.id !== sectionId));
      await sectionsService.deleteSection(sectionId);

      if (current?.section.id === sectionId) {
        const next = orderSections(latest()).find((s) => s.pages.length > 0);
        const [first] = next ? orderPages(next.pages) : [];
        if (next && first) select(next.id, first.id);
      }
      return { kind: "section", section };
    },
    [current, latest, select, writeCache],
  );

  const restore = useCallback(
    async (deleted: Deleted) => {
      if (deleted.kind === "section") {
        await saveSection(deleted.section);
        return;
      }
      const section = latest().find((s) => s.id === deleted.sectionId);
      if (!section) return;
      const pages = orderPages(section.pages);
      pages.splice(deleted.position, 0, deleted.page);
      await saveSection({ ...section, pages: pages.map((p, i) => ({ ...p, index: i })) });
      select(section.id, deleted.page.id);
    },
    [latest, saveSection, select],
  );

  const reload = useCallback(() => queryClient.resetQueries({ queryKey: SECTIONS_KEY, exact: true }), [queryClient]);

  return {
    sections,
    isLoading: sectionsQuery.isLoading,
    isError: sectionsQuery.isError,
    current,
    select,
    createNote,
    updatePage,
    togglePin,
    deletePage,
    duplicatePage,
    movePage,
    createSection,
    renameSection,
    setSectionColor,
    reorderSections,
    deleteSection,
    restore,
    reload,
  };
};

export type NotesStore = ReturnType<typeof useNotesStore>;
