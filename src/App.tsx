import { Button } from "antd";
import { useState } from "react";
import "./App.scss";
import { SectionContent } from "./components/SectionContent";
import { Sections } from "./components/Sections";
import { NewSection } from "./components/Sections/NewSection";
import { useInitEffect } from "./hooks/useInitEffect";
import { Section } from "./models";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { addSection } from "./store/sectionsReducer";

function App() {
  const [selectedSectionName, setSelectedSectionName] = useState<string>();
  const [isAddSectionOpened, setAddSectionOpened] = useState<boolean>(false);

  const sections = useAppSelector((state) => state.sections.sections);
  const dispatch = useAppDispatch();
  const selectedSection = sections.find(s => s.name === selectedSectionName);

  const onSectionSelected = (selected: string) => setSelectedSectionName(selected);
  const openNewSectionModal = () => setAddSectionOpened(true);
  const closeNewSectionModal = () => setAddSectionOpened(false);

  const handleNewSectionAdded = (name: string) => {
    const newSection: Section = { name, pages: [] };

    dispatch(addSection(newSection));

    setSelectedSectionName(newSection.name);
    closeNewSectionModal();
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
            <header className="sections">
              <Sections
                onAddSection={openNewSectionModal}
                onSectionSelected={onSectionSelected}
                selectedSection={selectedSection}
              />
            </header>

            <SectionContent section={selectedSection} />
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
