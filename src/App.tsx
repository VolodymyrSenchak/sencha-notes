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
  const sections = useAppSelector((state) => state.sections.sections);
  const [section, setSection] = useState<Section>();
  const [isAddSectionOpened, setAddSectionOpened] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onSectionSelected = (selected: Section) => setSection(selected);

  const openNewSectionModal = () => {
    setAddSectionOpened(true);
  };

  const handleNewSectionAdded = (name: string) => {
    const newSection: Section = { name, pages: [] };

    dispatch(addSection(newSection));

    setSection(newSection);
    setAddSectionOpened(false);
  };

  useInitEffect(() => {
    if (sections.length > 0) {
      setSection(sections[0]);
    }
  });

  return (
    <>
      <div className="sencha-app">
        {!!section ? (
          <>
            <header className="sections">
              <Sections
                onAddSection={openNewSectionModal}
                onSectionSelected={onSectionSelected}
                selectedSection={section}
              />
            </header>

            <SectionContent section={section} />
          </>
        ) : (
          <Button onClick={openNewSectionModal}>Add your first notes</Button>
        )}
      </div>

      <NewSection
        isModalOpened={isAddSectionOpened}
        cancel={() => setAddSectionOpened(false)}
        submit={handleNewSectionAdded}
      ></NewSection>
    </>
  );
}

export default App;
