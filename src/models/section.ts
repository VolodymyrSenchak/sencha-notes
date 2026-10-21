// Stored as-is in IndexedDB ("notesDB" → "sections"). Every field added after v1 is optional,
// so records written by older versions of the app stay valid and are never rewritten on load.

export type SectionColor = "gray" | "blue" | "plum" | "orange" | "green" | "olive" | "red" | "teal";

export interface Section {
  id: string;
  name: string;
  pages: SectionPage[];
  createdAt: Date;
  displayOrder?: number;
  color?: SectionColor;
  isInbox?: boolean;
}

export interface SectionPage {
  id: string;
  name: string;
  content: SectionPageEditorContent;
  index: number;
  pinned?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface SectionPageEditorContent {
  text: string;
}
