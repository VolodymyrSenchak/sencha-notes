import { Button } from "antd";
import { useState } from "react";
import "./App.scss";
import { SectionContent } from "./components/SectionContent";
import { Sections } from "./components/Sections";
import { NewSection } from "./components/Sections/NewSection";
import { useInitEffect } from "./hooks/useInitEffect";
import { Section } from "./models";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { addSection, deleteSection } from "./store/sectionsReducer";

function App() {
  const [selectedSectionName, setSelectedSectionName] = useState<string>();
  const [isAddSectionOpened, setAddSectionOpened] = useState<boolean>(false);

  const sections = useAppSelector((state) => state.sections.sections);
  const dispatch = useAppDispatch();
  const selectedSection = sections.find((s) => s.name === selectedSectionName);

  const onSectionSelected = (selected: string) =>
    setSelectedSectionName(selected);
  const openNewSectionModal = () => setAddSectionOpened(true);
  const closeNewSectionModal = () => setAddSectionOpened(false);

  const handleNewSectionAdded = (name: string) => {
    const newSection: Section = { name, pages: [] };

    dispatch(addSection(newSection));

    setSelectedSectionName(newSection.name);
    closeNewSectionModal();
  };

  const handleSectionDelete = () => {
    const existingSections = sections.filter(s => s !== selectedSection);
    dispatch(deleteSection(selectedSection!));

    if (existingSections.length > 0) {
      setSelectedSectionName(existingSections[0].name);
    }
  };

  useInitEffect(() => {
    if (sections.length > 0) {
      setSelectedSectionName(sections[0].name);
    }
  });

  return (
    <>
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
              <SectionContent section={selectedSection} onDeleteSection={handleSectionDelete} />
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
    </>
  );
}

export default App;
