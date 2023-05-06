import highlight from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";

export const QUILL_TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike", "blockquote", "code-block"], // toggled buttons
  [{ list: "ordered" }, { list: "bullet" }, { header: [1, 2, 3, false] }],
  [{ color: [] }, "clean"],
];

export const QUILL_MODULES = {
  toolbar: QUILL_TOOLBAR_OPTIONS,
  syntax: {
    highlight: (text: any) => highlight.highlightAuto(text).value
  }, 
  clipboard: {
    matchVisual: false,
  }
};
