import { ActiveSection } from "../models";

export const ACTIVE_SECTION_KEY = "active-section";

export const activeSectionService = {
  getActiveSection: (): ActiveSection => {
    const activeSectionJson = localStorage.getItem(ACTIVE_SECTION_KEY);
    return activeSectionJson ? JSON.parse(activeSectionJson) : undefined;
  },
  setActiveSection: (activeSection: ActiveSection) => {
    localStorage.setItem(ACTIVE_SECTION_KEY, JSON.stringify(activeSection));
  }
}