import { Button } from "antd";
import { SectionContent } from "../SectionContent/SectionContent";
import { SectionsMenu } from "../SectionsMenu/SectionsMenu";
import { NewSection } from "../SectionsMenu/NewSection";
import { useNotesApp } from "./useNotesApp";
import newNoteImage from "../../assets/new-note.png";
import "./NotesApp.scss";
import { InitialLoader } from "../InitialLoader/InitialLoader";

export const NotesApp: React.FC = () => {
  const useNotesAppData = useNotesApp();

  if (useNotesAppData.isSectionsLoading) {
    return <InitialLoader />;
  }

  return (
    <>
      {useNotesAppData.activeSection && useNotesAppData.isAnySectionExist ? (
        <>
          <header className="sencha-app-header">
            <SectionsMenu
              onAddSection={useNotesAppData.openNewSectionModal}
              onSectionDeleteCalled={useNotesAppData.handleSectionDelete}
            />
          </header>

          <main className="sencha-app-content">
            <SectionContent />
          </main>
        </>
      ) : (
        <div className="add-new-note-content">
          <img alt="New Note" src={newNoteImage}></img>

          <Button type="primary" onClick={useNotesAppData.openNewSectionModal}>
            Add your first notes
          </Button>
        </div>
      )}

      <NewSection
        isModalOpened={useNotesAppData.isAddSectionOpened}
        cancel={useNotesAppData.closeNewSectionModal}
        submit={useNotesAppData.handleNewSectionAdded}
      ></NewSection>
    </>
  );
};
