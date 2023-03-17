import { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
import { useSectionsData } from "../../hooks/useSectionsData";
import { useActiveSectionData } from "../../hooks/useSectionSelection";
import { Section } from "../../models";

export const useNotesApp = () => {
  const [isAddSectionOpened, setAddSectionOpened] = useState<boolean>(false);

  const {
    sections,
    isSectionsLoading,
    addSectionMutator,
    deleteSectionMutator,
  } = useSectionsData();
  
  const { activeSection, setActiveSection } = useActiveSectionData();

  const setDefaultActiveSection = useCallback(
    (section: Section) => {
      setActiveSection({
        sectionId: section.id,
        sectionPageId: section.pages[0].id,
      });
    },
    [setActiveSection]
  );

  useEffect(() => {
    if (sections?.length! > 0 && activeSection === undefined) {
      setDefaultActiveSection(sections![0]);
    }
  }, [activeSection, sections, setDefaultActiveSection]);

  const openNewSectionModal = () => setAddSectionOpened(true);
  const closeNewSectionModal = () => setAddSectionOpened(false);

  const handleNewSectionAdded = async (name: string) => {
    const newSection: Section = {
      id: v4(),
      name,
      pages: [{ id: v4(), name: "", content: { text: "" }, index: 0 }],
      createdAt: new Date(),
    };

    await addSectionMutator.mutateAsync(newSection);

    setDefaultActiveSection(newSection);
    closeNewSectionModal();
  };

  const handleSectionDelete = async (sectionKey: string) => {
    const sectionToDelete = sections!.find(
      (section) => section.id === sectionKey
    );
    const existingSections = sections!.filter(
      (section) => section !== sectionToDelete
    );

    await deleteSectionMutator.mutateAsync(sectionToDelete!.id);

    if (existingSections.length > 0) {
      setDefaultActiveSection(existingSections[0]);
    }
  };

  return {
    activeSection,
    isAddSectionOpened,
    isSectionsLoading,
    isAnySectionExist: sections && sections.length  > 0,

    openNewSectionModal,
    closeNewSectionModal,
    handleNewSectionAdded,
    handleSectionDelete,
  }
};
