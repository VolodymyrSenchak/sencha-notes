import { useEffect, useRef } from "react";
import { isPageBlank, orderPages } from "../../common/utils/notes";
import { useAppSettingsData } from "../../hooks/useAppSettingsData";
import { Editor } from "../Editor/Editor";
import { SearchPalette } from "../SearchPalette/SearchPalette";
import { SettingsSheet } from "../Settings/SettingsSheet";
import { Sidebar } from "../Sidebar/Sidebar";
import { ConfirmDialog, Toast } from "../ui/Feedback";
import { Menu } from "../ui/Menu";
import { NotesProvider, useNotes } from "./NotesContext";
import "./NotesApp.scss";

export const NotesApp: React.FC = () => (
  <NotesProvider>
    <NotesLayout />
  </NotesProvider>
);

const NotesLayout: React.FC = () => {
  const app = useNotes();
  const { store } = app;
  const { appSettings } = useAppSettingsData();
  const booted = useRef(false);

  // First run creates an Inbox with one empty note; "open on new note" reuses a blank Inbox note.
  useEffect(() => {
    if (store.isLoading || store.isError || booted.current) return;
    booted.current = true;

    if (store.sections.length === 0) {
      app.newNote();
      return;
    }
    if (appSettings.openOn === "new") {
      const inbox = store.sections.find((s) => s.isInbox);
      const [newest] = inbox ? orderPages(inbox.pages) : [];
      if (inbox && newest && isPageBlank(newest)) app.openNote(inbox, newest);
      else app.newNote();
    }
  }, [store.isLoading, store.isError, store.sections, appSettings.openOn, app]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        app.closeMenu();
        app.setOverlay(app.overlay === "search" ? null : "search");
      } else if (e.altKey && !mod && !e.shiftKey && e.code === "KeyN") {
        // Ctrl+N is reserved by Chrome, so new note is Alt+N.
        e.preventDefault();
        app.newNote();
      } else if (e.key === "Escape" && app.overlay && !app.confirm) {
        app.setOverlay(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [app]);

  if (store.isLoading) {
    return <div className="vn-loading">Loading…</div>;
  }

  if (store.isError) {
    return (
      <div className="vn-loading" role="alert">
        Couldn’t open your notes. Close and reopen SenNotes — nothing has been changed.
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <Editor />

      {app.overlay === "search" && <SearchPalette />}
      {app.overlay === "settings" && <SettingsSheet />}
      {app.menu && <Menu {...app.menu} onClose={app.closeMenu} />}
      {app.confirm && <ConfirmDialog {...app.confirm} onCancel={() => app.setConfirm(null)} />}
      {app.toast && (
        <Toast
          key={app.toast.id}
          message={app.toast.message}
          actionLabel={app.toast.undo ? "Undo" : undefined}
          onAction={() => {
            app.toast?.undo?.();
            app.dismissToast();
          }}
          onDismiss={app.dismissToast}
        />
      )}
    </>
  );
};
