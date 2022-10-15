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
import { v4 } from "uuid";

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
    const newSection: Section = {
      id: v4(),
      name,
      pages: [{ id: v4(), name: "", content: { text: "" } }],
    };

    dispatch(addSection(newSection));

    setSelectedSectionName(newSection.name);
    closeNewSectionModal();
  };

  const handleSectionDelete = () => {
    const existingSections = sections.filter((s) => s !== selectedSection);
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

  // useInitEffect(() => {
  //   const request = indexedDB.open("SectionsDB", 2);
    
  //   request.onerror = (event) => {}; // Handle errors. };

  //   request.onsuccess = (event: any) => {
  //     const db = event.target!.result as IDBDatabase;
  //     const sectionsStore = db.transaction("sections", "readwrite").objectStore("sections");

  //     const countRequest = sectionsStore.count();

  //     countRequest.onsuccess = (ev: any) => console.log("count", countRequest.result);

  //     // sections.forEach((customer) => {
  //     //   customerObjectStore.add(customer);
  //     // });

  //     const ddd = sectionsStore.get("d113c0c1-cd14-4069-a5d3-3379111d1fc2");

  //     ddd.onsuccess = (event: any) => {
  //       console.log(ddd.result);
  //     };
  //   }

  //   request.onupgradeneeded = (event: any) => {
  //     const db = event.target!.result as IDBDatabase;
    
  //     // Create an objectStore to hold information about our customers. We're
  //     // going to use "ssn" as our key path because it's guaranteed to be
  //     // unique - or at least that's what I was told during the kickoff meeting.
  //     const objectStore = db.createObjectStore("sections", { keyPath: "id" });
    
  //     // Use transaction oncomplete to make sure the objectStore creation is
  //     // finished before adding data into it.
  //     objectStore.transaction.oncomplete = (event: any) => {
  //             // Store values in the newly created objectStore.
  //       const sectionsStore = db.transaction("sections", "readwrite").objectStore("sections");

  //       sections.forEach((customer) => {
  //         sectionsStore.add(customer);
  //       });

  //       sectionsStore.transaction.commit();
  //     };
  //   };
  // });

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
