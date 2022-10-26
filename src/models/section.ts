export interface Section {
  id: string;
  name: string;
  pages: SectionPage[];
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
