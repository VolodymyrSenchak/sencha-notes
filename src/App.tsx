import { Button } from "antd";
import { useState } from "react";
import "./App.scss";
import { SectionContent } from "./components/SectionContent";
import { Sections } from "./components/Sections";
import { useInitEffect } from "./hooks/useInitEffect";
import { Section } from "./models";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { addSection } from "./store/sectionsReducer";

function App() {
  const sections = useAppSelector((state) => state.sections.sections);
  const [section, setSection] = useState<Section>();
  const dispatch = useAppDispatch();

  const onSectionSelected = (selected: Section) => setSection(selected);

  const addNewSectionAndSelect = () => {
    const newSection: Section = { name: "First sec", pages: [] };

    dispatch(addSection(newSection));
    setSection(newSection);
  };

  useInitEffect(() => {
    if (sections.length > 0) {
      setSection(sections[0]);
    }
  });

  return (
    <div className="sencha-app">
      {!!section ? (
        <>
          <header className="sections">
            <Sections onSectionSelected={onSectionSelected} selectedSection={section} />
          </header>

          <SectionContent section={section} />
        </>
      ) : (
        <Button onClick={addNewSectionAndSelect}>Add your first notes</Button>
      )}
    </div>
  );
}

export default App;
