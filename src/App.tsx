import { Button, ConfigProvider } from "antd";
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

const appThemes = {
  lightBlue: { class: "light-blue", primaryColor: "#6096B4" },
  lightGreen: { class: "light-green", primaryColor: "#609966" }
};

function App() {
  const [selectedSectionName, setSelectedSectionName] = useState<string>();
  const [isAddSectionOpened, setAddSectionOpened] = useState<boolean>(false);
  const [currentTheme] = useState(appThemes.lightBlue);

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
    return <div className="sencha-app">Initializing your app...</div>;
  }

  return (
    <ConfigProvider theme={{ token: {
      colorPrimary: currentTheme.primaryColor,
    }, }}>
      <div className={`sencha-app ${currentTheme.class}`}>
        {!!selectedSection ? (
          <>
            <header className="sencha-app-header">
              <Sections
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
      </div>

      <NewSection
        isModalOpened={isAddSectionOpened}
        cancel={closeNewSectionModal}
        submit={handleNewSectionAdded}
      ></NewSection>
    </ConfigProvider>
  );
}

export default App;
