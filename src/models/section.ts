export interface Section {
  id: string;
  name: string;
  pages: SectionPage[];
  createdAt: Date;
  displayOrder?: number;
}

export interface SectionPage {
  id: string;
  name: string;
  content: SectionPageEditorContent;
  index: number;
}

export interface SectionPageEditorContent {
  text: string;
}
