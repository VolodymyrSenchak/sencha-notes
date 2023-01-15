import { Section } from "../models";
import { sectionsStorage } from "../storage/sectionsStorage"

export const sectionsService = {
  getSection: (key: string) => sectionsStorage.get(key),
  getSections: (): Promise<Section[]> => sectionsStorage.getAll(),
  deleteSection: (sectionId: string) => sectionsStorage.delete(sectionId),
  editSection: (section: Section) => sectionsStorage.update(section.id, section),
  addSection: (section: Section) => sectionsStorage.insert(section),
};
