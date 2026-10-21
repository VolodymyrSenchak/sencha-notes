// The "common" build (~35 languages) covers every language in Quill's code-block picker.
import highlight from "highlight.js/lib/common";

// Quill's syntax module reads window.hljs; it must be set before the editor mounts.
(window as any).hljs = highlight;

// The toolbar is our own component (Toolbar.tsx); Quill keeps its keyboard shortcuts and
// markdown-style list autofill ("[ ] ", "- ", "1. ").
export const QUILL_MODULES = {
  toolbar: false,
  syntax: { hljs: highlight },
};

export const TEXT_COLORS: { label: string; value: string | false }[] = [
  { label: "Default", value: false },
  { label: "Red", value: "#B5443A" },
  { label: "Orange", value: "#B5652F" },
  { label: "Olive", value: "#8A7A2E" },
  { label: "Green", value: "#2F7A55" },
  { label: "Teal", value: "#276678" },
  { label: "Blue", value: "#3D6FB0" },
  { label: "Plum", value: "#74509F" },
];
