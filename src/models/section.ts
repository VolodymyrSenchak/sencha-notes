export interface Section {
  id: string;
  name: string;
  pages: SectionPage[];
  createdAt: Date;
}

export interface SectionPage {
  id: string;
  name: string;
  content: SectionPageContent;
  index: number;
}

export interface SectionPageContent {
  text: string;
}
