import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { cloneDeep } from "lodash";
import { ReactNode } from "react";
import { Section } from "../models";
import { sectionsService } from "../services/sectionsService";
import { useNotesStore } from "./useNotesStore";

jest.mock("../services/sectionsService", () => ({
  sectionsService: {
    getSections: jest.fn(),
    getSection: jest.fn(),
    editSection: jest.fn(),
    addSection: jest.fn(),
    deleteSection: jest.fn(),
  },
}));

const svc = sectionsService as jest.Mocked<typeof sectionsService>;

// A v1 record exactly as older versions stored it: no updatedAt, pinned, color or isInbox.
const legacySections = (): Section[] => [
  {
    id: "s-work",
    name: "Work",
    createdAt: new Date(2023, 1, 1),
    displayOrder: 1,
    pages: [
      { id: "p-1", name: "Plan", content: { text: "<p>Ship it</p>" }, index: 0 },
      { id: "p-2", name: "", content: { text: "<p>untitled body</p>" }, index: 1 },
    ],
  },
  {
    id: "s-inbox-named",
    name: "inbox",
    createdAt: new Date(2023, 2, 1),
    pages: [{ id: "p-3", name: "Loose", content: { text: "" }, index: 0 }],
  },
];

let db: Section[];

const setup = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(() => useNotesStore(), { wrapper });
};

beforeEach(() => {
  localStorage.clear();
  db = legacySections();
  jest.clearAllMocks();
  svc.getSections.mockImplementation(async () => cloneDeep(db));
  svc.editSection.mockImplementation(async (s: Section) => {
    db = db.some((x) => x.id === s.id) ? db.map((x) => (x.id === s.id ? s : x)) : [...db, s];
    return [s.id, s];
  });
  svc.addSection.mockImplementation(async (s: Section) => {
    db = [...db, s];
    return [s.id, s];
  });
  svc.deleteSection.mockImplementation(async (id: string) => {
    db = db.filter((x) => x.id !== id);
    return id;
  });
});

it("loads v1 data without writing anything", async () => {
  const { result } = setup();
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.sections.map((s) => s.id)).toEqual(["s-work", "s-inbox-named"]);
  expect(result.current.current?.page.id).toBe("p-1");
  expect(svc.editSection).not.toHaveBeenCalled();
  expect(svc.addSection).not.toHaveBeenCalled();
  expect(svc.deleteSection).not.toHaveBeenCalled();
});

it("adopts an existing section named Inbox instead of creating a duplicate, keeping its notes", async () => {
  const { result } = setup();
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => {
    await result.current.createNote();
  });

  expect(svc.addSection).not.toHaveBeenCalled();
  const inbox = db.find((s) => s.id === "s-inbox-named")!;
  expect(inbox.isInbox).toBe(true);
  expect(inbox.name).toBe("inbox");
  expect(inbox.pages.map((p) => p.id)).toContain("p-3");
  expect(inbox.pages).toHaveLength(2);
  expect(db.find((s) => s.id === "s-work")).toEqual(legacySections()[0]);
});

it("restores a deleted note exactly, in its original position", async () => {
  const { result } = setup();
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  const original = cloneDeep(db[0].pages[0]);

  let deleted: Awaited<ReturnType<typeof result.current.deletePage>> = null;
  await act(async () => {
    deleted = await result.current.deletePage("s-work", "p-1");
  });
  expect(db[0].pages.map((p) => p.id)).toEqual(["p-2"]);

  await act(async () => {
    await result.current.restore(deleted!);
  });
  expect(db[0].pages.map((p) => p.id)).toEqual(["p-1", "p-2"]);
  expect({ ...db[0].pages[0], index: original.index }).toEqual(original);
});

it("restores a deleted section with all its notes", async () => {
  const { result } = setup();
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  const original = cloneDeep(db[0]);

  let deleted: Awaited<ReturnType<typeof result.current.deleteSection>> = null;
  await act(async () => {
    deleted = await result.current.deleteSection("s-work");
  });
  expect(db.some((s) => s.id === "s-work")).toBe(false);

  await act(async () => {
    await result.current.restore(deleted!);
  });
  expect(db.find((s) => s.id === "s-work")).toEqual(original);
});

it("moves a note between sections without losing its content", async () => {
  const { result } = setup();
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => {
    await result.current.movePage("p-1", "s-work", "s-inbox-named", null);
  });

  expect(db.find((s) => s.id === "s-work")!.pages.map((p) => p.id)).toEqual(["p-2"]);
  const moved = db.find((s) => s.id === "s-inbox-named")!.pages.find((p) => p.id === "p-1")!;
  expect(moved.content.text).toBe("<p>Ship it</p>");
  expect(moved.name).toBe("Plan");
});

it("never deletes the Inbox", async () => {
  db.push({ id: "s-inbox", name: "Inbox", isInbox: true, createdAt: new Date(), pages: [] });
  const { result } = setup();
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => {
    expect(await result.current.deleteSection("s-inbox")).toBeNull();
  });
  expect(svc.deleteSection).not.toHaveBeenCalled();
});
