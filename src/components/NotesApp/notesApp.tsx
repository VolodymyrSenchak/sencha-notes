import { Button } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { v4 } from "uuid";
import { useSectionsData } from "../../hooks/useSectionsData";
import { Section } from "../../models";
import { queryKeys } from "../../services/queryKeys";
import { sectionsService } from "../../services/sectionsService";
import { SectionContent } from "../SectionContent";
import { SectionsMenu } from "../SectionsMenu";
import { NewSection } from "../SectionsMenu/NewSection";

export const NotesApp: React.FC = () => {
  const [selectedSectionName, setSelectedSectionName] = useState<string>();
  const [isAddSectionOpened, setAddSectionOpened] = useState<boolean>(false);

  const { data: sections, isLoading } = useQuery(
    queryKeys.sections,
    sectionsService.getSections,
    {
      onSuccess: (loaded) => {
        if (loaded.length > 0 && selectedSectionName === undefined) {
          setSelectedSectionName(loaded[0].name);
        }
      },
    }
  );

  const { addSectionMutator, deleteSectionMutator } = useSectionsData();

  const selectedSection = sections?.find((s) => s.name === selectedSectionName);

  const onSectionSelected = (selected: string) =>
    setSelectedSectionName(selected);
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

    setSelectedSectionName(newSection.name);
    closeNewSectionModal();
  };

  const handleSectionDelete = async (sectionKey: string) => {
    const sectionToDelete = sections!.find(section => section.id === sectionKey);
    const existingSections = sections!.filter(section => section !== sectionToDelete);

    await deleteSectionMutator.mutateAsync(sectionToDelete!.id);

    if (existingSections.length > 0) {
      setSelectedSectionName(existingSections[0].name);
    }
  };

  if (isLoading) {
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
