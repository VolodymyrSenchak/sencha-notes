import { Section, SectionPage } from "../../models";
import {
  htmlToText,
  isSectionNameTaken,
  makeSnippet,
  orderSections,
  relativeTime,
  searchNotes,
  sectionColor,
  wordCount,
} from "./notes";

const page = (id: string, name: string, text: string, extra: Partial<SectionPage> = {}): SectionPage => ({
  id,
  name,
  content: { text },
  index: 0,
  ...extra,
});

const section = (id: string, name: string, pages: SectionPage[], extra: Partial<Section> = {}): Section => ({
  id,
  name,
  pages,
  createdAt: new Date(2024, 0, 1),
  ...extra,
});

describe("orderSections", () => {
  it("keeps the v1 order (displayOrder, then createdAt) and puts the Inbox first", () => {
    const sections = [
      section("c", "Created late", [], { createdAt: new Date(2024, 5, 1) }),
      section("b", "Ordered 2", [], { displayOrder: 2 }),
      section("inbox", "Inbox", [], { isInbox: true, displayOrder: 99 }),
      section("a", "Ordered 1", [], { displayOrder: 1 }),
      section("d", "Created early", [], { createdAt: "2023-01-01T00:00:00.000Z" as unknown as Date }),
    ];
    expect(orderSections(sections).map((s) => s.id)).toEqual(["inbox", "a", "b", "d", "c"]);
  });
});

describe("htmlToText", () => {
  it("strips markup, separates blocks, and never executes content", () => {
    const html = "<h1>Title</h1><p>One <b>two</b></p><img src=x onerror=\"window.__pwned=1\"><ol><li>three</li></ol>";
    expect(htmlToText(html)).toBe("Title One two three");
    expect((window as any).__pwned).toBeUndefined();
  });
});

describe("searchNotes", () => {
  const sections = [
    section("work", "Work", [
      page("p1", "Kyoto trip plan", "<p>flights</p>", { updatedAt: 1 }),
      page("p2", "Packing", "<p>Bring a Kyoto guidebook and shoes</p>", { updatedAt: 3 }),
      page("p3", "Unrelated", "<p>nothing here</p>", { updatedAt: 5 }),
    ]),
  ];

  it("ranks title matches above body matches and builds a snippet for body matches", () => {
    const hits = searchNotes(sections, "kyoto");
    expect(hits.map((h) => h.page.id)).toEqual(["p1", "p2"]);
    expect(hits[0].inTitle).toBe(true);
    expect(hits[1].snippet).toEqual({ before: "Bring a ", match: "Kyoto", after: " guidebook and shoes" });
  });

  it("returns recent notes first when the query is empty", () => {
    expect(searchNotes(sections, " ").map((h) => h.page.id)).toEqual(["p3", "p2", "p1"]);
  });
});

describe("makeSnippet", () => {
  it("starts at a word boundary with an ellipsis", () => {
    const s = makeSnippet("Fushimi Inari at 7am, before the crowds, then Kyoto buses", "kyoto");
    expect(s?.before.startsWith("…")).toBe(true);
    expect(s?.before).toBe("…before the crowds, then ");
  });
});

describe("relativeTime", () => {
  const now = new Date(2026, 9, 21, 12, 0).getTime();
  it.each([
    [now - 10_000, "just now"],
    [now - 5 * 60_000, "5 min ago"],
    [now - 3 * 3_600_000, "3 hours ago"],
    [now - 30 * 3_600_000, "yesterday"],
    [new Date(2026, 8, 30).getTime(), "Sep 30"],
    [new Date(2025, 0, 2).getTime(), "Jan 2, 2025"],
  ])("formats %p as %p", (ts, expected) => expect(relativeTime(ts, now)).toBe(expected));

  it("returns null for v1 notes without a timestamp", () => expect(relativeTime(undefined)).toBeNull());
});

describe("isSectionNameTaken", () => {
  it("ignores case and surrounding spaces", () => {
    const sections = [section("a", "Work ", [])];
    expect(isSectionNameTaken(sections, " work")).toBe(true);
    expect(isSectionNameTaken(sections, "work", "a")).toBe(false);
  });
});

describe("wordCount", () => {
  it("counts the title and the body", () => expect(wordCount(page("x", "Two words", "<p>and three more</p>"))).toBe(5));
});

describe("sectionColor", () => {
  it("keeps a chosen colour, uses gray for the Inbox and a stable colour for v1 sections", () => {
    expect(sectionColor({ id: "x", color: "red" })).toBe("red");
    expect(sectionColor({ id: "x", isInbox: true })).toBe("gray");
    const a = sectionColor({ id: "4f9c-legacy" });
    expect(sectionColor({ id: "4f9c-legacy" })).toBe(a);
    expect(a).not.toBe("gray");
  });
});
