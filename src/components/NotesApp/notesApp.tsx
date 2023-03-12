import { Button } from "antd";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useSectionsData } from "../../hooks/useSectionsData";
import { Section } from "../../models";
import { SectionContent } from "../SectionContent";
import { SectionsMenu } from "../SectionsMenu";
import { NewSection } from "../SectionsMenu/NewSection";

export const NotesApp: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>();
  const [isAddSectionOpened, setAddSectionOpened] = useState<boolean>(false);

  const { sections, isSectionsLoading } = useSectionsData();

  useEffect(() => {
    if (sections?.length! > 0 && selectedSectionId === undefined) {
      setSelectedSectionId(sections![0].id);
    }
  }, [sections, selectedSectionId]);

  const { addSectionMutator, deleteSectionMutator } = useSectionsData();

  const selectedSection = sections?.find((s) => s.id === selectedSectionId);

  const onSectionSelected = (sectionId: string) => setSelectedSectionId(sectionId);
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

    setSelectedSectionId(newSection.id);
    closeNewSectionModal();
  };

  const handleSectionDelete = async (sectionKey: string) => {
    const sectionToDelete = sections!.find(section => section.id === sectionKey);
    const existingSections = sections!.filter(section => section !== sectionToDelete);

    await deleteSectionMutator.mutateAsync(sectionToDelete!.id);

    if (existingSections.length > 0) {
      setSelectedSectionId(existingSections[0].id);
    }
  };

  if (isSectionsLoading) {
    return <div>Initializing your app...</div>;
  }

  return (
    <>
      {!!selectedSection ? (
        <>
          <header className="sencha-app-header">
            <SectionsMenu
              onAddSection={openNewSectionModal}
              onSectionSelected={onSectionSelected}
              onSectionDeleteCalled={handleSectionDelete}
              selectedSection={selectedSection}
            />
          </header>

          <main className="sencha-app-content">
            <SectionContent sectionId={selectedSection?.id} />
          </main>
        </>
      ) : (
        <Button onClick={openNewSectionModal}>Add your first notes</Button>
      )}

      <NewSection
        isModalOpened={isAddSectionOpened}
        cancel={closeNewSectionModal}
        submit={handleNewSectionAdded}
      ></NewSection>
    </>
  );
};
