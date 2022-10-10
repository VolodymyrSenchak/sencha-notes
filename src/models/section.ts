export interface Section {
  name: string;
  pages: SectionPage[];
}

export interface SectionPage {
  name: string;
  content: SectionPageContent;
}

export interface SectionPageContent {
  text: string;
}
