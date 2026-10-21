import { orderBy } from "lodash";
import { Section, SectionColor, SectionPage } from "../../models";

export interface NoteRef {
  section: Section;
  page: SectionPage;
}

export interface SearchHit extends NoteRef {
  inTitle: boolean;
  snippet: { before: string; match: string; after: string } | null;
}

// Inbox first, then the user's order, then creation time (the v1 ordering).
export function orderSections(sections: Section[]): Section[] {
  return orderBy(
    sections,
    [
      (s) => (s.isInbox ? 0 : 1),
      (s) => s.displayOrder ?? Number.MAX_SAFE_INTEGER,
      (s) => new Date(s.createdAt).getTime(),
    ],
    ["asc", "asc", "asc"],
  );
}

export function orderPages(pages: SectionPage[]): SectionPage[] {
  return orderBy(pages, (p) => p.index);
}

const textCache = new Map<string, string>();

// DOMParser builds an inert document: no scripts run and no images load, even for imported HTML.
export function htmlToText(html: string): string {
  if (!html) return "";
  const cached = textCache.get(html);
  if (cached !== undefined) return cached;

  const doc = new DOMParser().parseFromString(
    html.replace(/<\/(p|li|h[1-6]|pre|blockquote|div)>/gi, "$& "),
    "text/html",
  );
  const text = (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();

  if (textCache.size > 2000) textCache.clear();
  textCache.set(html, text);
  return text;
}

export function pageTitle(page: SectionPage): string {
  return page.name.trim() || "Untitled";
}

export function isPageBlank(page: SectionPage): boolean {
  return !page.name.trim() && !htmlToText(page.content?.text ?? "");
}

export function wordCount(page: SectionPage): number {
  const text = `${page.name} ${htmlToText(page.content?.text ?? "")}`.trim();
  return text ? text.split(/\s+/).length : 0;
}

export function allNotes(sections: Section[]): NoteRef[] {
  return orderSections(sections).flatMap((section) => orderPages(section.pages).map((page) => ({ section, page })));
}

export function matchesNote(ref: NoteRef, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    ref.page.name.toLowerCase().includes(q) ||
    htmlToText(ref.page.content?.text ?? "")
      .toLowerCase()
      .includes(q)
  );
}

export function makeSnippet(text: string, query: string, lead = 28): SearchHit["snippet"] {
  const q = query.trim().toLowerCase();
  const i = q ? text.toLowerCase().indexOf(q) : -1;
  if (i < 0) return null;

  let start = Math.max(0, i - lead);
  if (start > 0) {
    const space = text.indexOf(" ", start);
    start = space > -1 && space < i ? space + 1 : start;
  }

  return {
    before: (start > 0 ? "…" : "") + text.slice(start, i),
    match: text.slice(i, i + q.length),
    after: text.slice(i + q.length, i + q.length + 120),
  };
}

// Title matches first, then body matches; most recently edited first within each group.
export function searchNotes(sections: Section[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  const notes = allNotes(sections);

  if (!q) {
    return orderBy(notes, (n) => n.page.updatedAt ?? 0, "desc").map((n) => ({ ...n, inTitle: false, snippet: null }));
  }

  const hits: SearchHit[] = [];
  for (const note of notes) {
    const inTitle = note.page.name.toLowerCase().includes(q);
    const text = htmlToText(note.page.content?.text ?? "");
    const snippet = inTitle ? null : makeSnippet(text, q);
    if (inTitle || snippet) hits.push({ ...note, inTitle, snippet });
  }

  return orderBy(hits, [(h) => (h.inTitle ? 0 : 1), (h) => h.page.updatedAt ?? 0], ["asc", "desc"]);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function relativeTime(timestamp: number | undefined, now = Date.now()): string | null {
  if (!timestamp) return null;
  const diff = Math.max(0, now - timestamp);
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (hours < 48) return "yesterday";

  const date = new Date(timestamp);
  const sameYear = date.getFullYear() === new Date(now).getFullYear();
  return `${MONTHS[date.getMonth()]} ${date.getDate()}${sameYear ? "" : `, ${date.getFullYear()}`}`;
}

export function isSectionNameTaken(sections: Section[], name: string, exceptId?: string): boolean {
  const n = name.trim().toLowerCase();
  return sections.some((s) => s.id !== exceptId && s.name.trim().toLowerCase() === n);
}

const AUTO_COLORS: SectionColor[] = ["blue", "plum", "orange", "green", "olive", "red", "teal"];

// Sections from v1 have no colour. Derive a stable one from the id instead of writing it to the record.
export function sectionColor(section: Pick<Section, "id" | "color" | "isInbox">): SectionColor {
  if (section.color) return section.color;
  if (section.isInbox) return "gray";
  let hash = 0;
  for (let i = 0; i < section.id.length; i++) hash = (hash * 31 + section.id.charCodeAt(i)) | 0;
  return AUTO_COLORS[Math.abs(hash) % AUTO_COLORS.length];
}
