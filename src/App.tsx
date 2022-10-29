import { Button } from "antd";
import { useEffect, useState } from "react";
import "./App.scss";
import { SectionContent } from "./components/SectionContent";
import { Sections } from "./components/Sections";
import { NewSection } from "./components/Sections/NewSection";
import { useInitEffect } from "./hooks/useInitEffect";
import { Section } from "./models";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { addSection, deleteSection, initSections } from "./store/sectionsReducer";
import { v4 } from "uuid";

function App() {
  const [selectedSectionName, setSelectedSectionName] = useState<string>();
  const [isAddSectionOpened, setAddSectionOpened] = useState<boolean>(false);

  const sections = useAppSelector((state) => state.sections.sections);
  const isLoading = useAppSelector((state) => state.sections.isSectionsLoading);
  const dispatch = useAppDispatch();
  const selectedSection = sections.find((s) => s.name === selectedSectionName);

  const onSectionSelected = (selected: string) =>
    setSelectedSectionName(selected);
  const openNewSectionModal = () => setAddSectionOpened(true);
  const closeNewSectionModal = () => setAddSectionOpened(false);

  const handleNewSectionAdded = async (name: string) => {
    const newSection: Section = {
      id: v4(),
      name,
      pages: [{ id: v4(), name: "", content: { text: "" }, index: 0 }],
    };

    await dispatch(addSection(newSection));

    setSelectedSectionName(newSection.name);
    closeNewSectionModal();
  };

  const handleSectionDelete = async () => {
    const existingSections = sections.filter((s) => s !== selectedSection);
    await dispatch(deleteSection(selectedSection!));

    if (existingSections.length > 0) {
      setSelectedSectionName(existingSections[0].name);
    }
  };

  useInitEffect(() => {
    (async () => {
      await dispatch(initSections());
    })();
  });

  useEffect(() => {
    if (sections.length > 0 && selectedSectionName === undefined) {
      setSelectedSectionName(sections[0].name);
    }
  }, [selectedSectionName, sections]);

  if (isLoading) {
    return (<div className="sencha-app">Initializing your app...</div>);
  }

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
              <SectionContent
                section={selectedSection}
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
    </>
  );
}

export default App;
