import { Button } from "antd";
import { useState } from "react";
import "./App.scss";
import { SectionContent } from "./components/SectionContent";
import { Sections } from "./components/Sections";
import { NewSection } from "./components/Sections/NewSection";
import { Section } from "./models";
import { v4 } from "uuid";
import { useQuery } from "react-query";
import { queryKeys } from "./services/queryKeys";
import { sectionsService } from "./services/sectionsService";
import { useSectionsData } from "./hooks/useSectionsData";

function App() {
  const [selectedSectionName, setSelectedSectionName] = useState<string>();
  const [isAddSectionOpened, setAddSectionOpened] = useState<boolean>(false);

  const {
    data: sections,
    isLoading
  } = useQuery(queryKeys.sections, sectionsService.getSections, {
    onSuccess: (loaded) => {
      console.log("on successsssss");
      if (loaded.length > 0 && selectedSectionName === undefined) {
        setSelectedSectionName(loaded[0].name);
      }
    }
  });

  const { addSectionMutator, deleteSectionMutator } = useSectionsData();

  const selectedSection = sections?.find((s) => s.name === selectedSectionName);

  const onSectionSelected = (selected: string) => setSelectedSectionName(selected);
  const openNewSectionModal = () => setAddSectionOpened(true);
  const closeNewSectionModal = () => setAddSectionOpened(false);

  const handleNewSectionAdded = async (name: string) => {
    const newSection: Section = {
      id: v4(),
      name,
      pages: [{ id: v4(), name: "", content: { text: "" }, index: sections!.length }],
    };

    await addSectionMutator.mutateAsync(newSection);

    setSelectedSectionName(newSection.name);
    closeNewSectionModal();
  };

  const handleSectionDelete = async () => {
    const existingSections = sections!.filter((s) => s !== selectedSection);
    await deleteSectionMutator.mutateAsync(selectedSection?.id!);

    if (existingSections.length > 0) {
      setSelectedSectionName(existingSections[0].name);
    }
  };

  if (isLoading) {
    return (<div className="sencha-app">Initializing your app...</div>);
  }

  return (
    <div>
<div className="sencha-app">
        {!!selectedSection ? (
          <>
            <header className="sencha-app-header">
              <Sections
                onAddSection={openNewSectionModal}
                onSectionSelected={onSectionSelected}
                selectedSection={selectedSection}
              />
            </header>

            <main className="sencha-app-content">
              <SectionContent
                sectionId={selectedSection?.id}
                onDeleteSection={handleSectionDelete}
              />
            </main>
          </>
        ) : (
          <Button onClick={openNewSectionModal}>Add your first notes</Button>
        )}
      </div>

      <NewSection
        isModalOpened={isAddSectionOpened}
        cancel={closeNewSectionModal}
        submit={handleNewSectionAdded}
      ></NewSection>
    </div>
  );
}

export default App;
