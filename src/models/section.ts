export interface Section {
  id: string;
  name: string;
  pages: SectionPage[];
}

export interface SectionPage {
  id: string;
  name: string;
  content: SectionPageContent;
}

export interface SectionPageContent {
  text: string;
}
