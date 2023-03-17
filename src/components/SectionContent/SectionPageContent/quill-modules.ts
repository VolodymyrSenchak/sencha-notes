export const QUILL_TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike", "blockquote", "code-block"], // toggled buttons
  [{ list: "ordered" }, { list: "bullet" }, ],
  [{ header: [1, 2, 3, false] }],
  [{ color: [] }, { align: [] }], // dropdown with defaults from theme
  ["clean"], // remove formatting button
];

export const QUILL_MODULES = {
  toolbar: QUILL_TOOLBAR_OPTIONS,
};
