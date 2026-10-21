import type Quill from "quill";
import { useRef, useState } from "react";
import { useNotes } from "../NotesApp/NotesContext";
import { Icon, IconName } from "../ui/Icon";
import { anchorFromElement } from "../ui/Menu";
import { TEXT_COLORS } from "./quill-modules";

export type Formats = Record<string, unknown>;

interface ToolbarProps {
  getQuill: () => Quill | undefined;
  formats: Formats;
  onFormatsChange: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ getQuill, formats, onFormatsChange }) => {
  const app = useNotes();
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const savedRange = useRef<{ index: number; length: number } | null>(null);

  const apply = (name: string, value: unknown) => {
    const quill = getQuill();
    if (!quill) return;
    quill.focus();
    quill.format(name, value, "user");
    onFormatsChange();
  };

  const toggle = (name: string, on: unknown = true) =>
    apply(name, formats[name] === on || (on === true && formats[name]) ? false : on);

  const toggleList = (value: string) => {
    const current = formats.list;
    const same = value === "unchecked" ? current === "checked" || current === "unchecked" : current === value;
    apply("list", same ? false : value);
  };

  const openLink = () => {
    const quill = getQuill();
    if (!quill) return;
    if (formats.link) {
      apply("link", false);
      return;
    }
    savedRange.current = quill.getSelection(true);
    setUrl("");
    setLinkOpen(true);
  };

  const submitLink = () => {
    const quill = getQuill();
    const range = savedRange.current;
    setLinkOpen(false);
    if (!quill || !range || !url.trim()) return;
    const href = /^[a-z][a-z0-9+.-]*:/i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    if (range.length === 0) {
      quill.insertText(range.index, href, "link", href, "user");
      quill.setSelection(range.index + href.length, 0, "user");
    } else {
      quill.setSelection(range.index, range.length, "user");
      quill.format("link", href, "user");
    }
    onFormatsChange();
  };

  const clear = () => {
    const quill = getQuill();
    const range = quill?.getSelection(true);
    if (!quill || !range) return;
    if (range.length) {
      quill.removeFormat(range.index, range.length, "user");
    } else {
      // No selection: clear the whole current line.
      const [line, offset] = quill.getLine(range.index);
      if (line) quill.removeFormat(range.index - offset, line.length(), "user");
    }
    onFormatsChange();
  };

  const openColors = (el: HTMLElement) => {
    app.openMenu({
      anchor: anchorFromElement(el, "start"),
      label: "Text colour",
      items: [
        {
          custom: (
            <div className="vn-colors" role="group" aria-label="Text colour">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  aria-label={c.label}
                  title={c.label}
                  aria-pressed={(formats.color ?? false) === c.value}
                  className={c.value ? undefined : "is-default"}
                  style={c.value ? { background: c.value } : undefined}
                  onClick={() => {
                    app.closeMenu();
                    apply("color", c.value);
                  }}
                />
              ))}
            </div>
          ),
        },
      ],
    });
  };

  const btn = (label: string, pressed: boolean, onClick: () => void, content: React.ReactNode, className = "") => (
    <button
      type="button"
      className={`vn-ib ${className}`}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onMouseDown={(e) => e.preventDefault()} // keep the editor selection
      onClick={onClick}
    >
      {content}
    </button>
  );
  const icon = (name: IconName) => <Icon name={name} />;

  return (
    <div className="vn-toolbar" role="toolbar" aria-label="Formatting">
      {btn("Bold (Ctrl B)", !!formats.bold, () => toggle("bold"), "B", "tb-b")}
      {btn("Italic (Ctrl I)", !!formats.italic, () => toggle("italic"), "I", "tb-i")}
      {btn("Underline (Ctrl U)", !!formats.underline, () => toggle("underline"), "U", "tb-u")}
      {btn("Strikethrough", !!formats.strike, () => toggle("strike"), "S", "tb-s")}
      <span className="vn-toolbar-sep" aria-hidden="true" />
      {btn("Heading", !!formats.header, () => apply("header", formats.header ? false : 2), "H", "tb-h")}
      {btn("Bulleted list", formats.list === "bullet", () => toggleList("bullet"), icon("list"))}
      {btn("Numbered list", formats.list === "ordered", () => toggleList("ordered"), icon("numbered"))}
      {btn(
        "Checklist",
        formats.list === "checked" || formats.list === "unchecked",
        () => toggleList("unchecked"),
        icon("checklist"),
      )}
      <span className="vn-toolbar-sep" aria-hidden="true" />
      {btn("Code block", !!formats["code-block"], () => toggle("code-block"), icon("code"))}
      {btn("Quote", !!formats.blockquote, () => toggle("blockquote"), icon("quote"))}
      {btn(formats.link ? "Remove link" : "Link", !!formats.link, openLink, icon("link"))}
      <button
        type="button"
        className="vn-ib"
        aria-label="Text colour"
        title="Text colour"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => openColors(e.currentTarget)}
      >
        <span className="tb-color" style={{ borderColor: (formats.color as string) || "currentColor" }}>
          A
        </span>
      </button>
      {btn("Clear formatting", false, clear, icon("clear"))}

      {linkOpen && (
        <form
          className="vn-link-pop"
          onSubmit={(e) => {
            e.preventDefault();
            submitLink();
          }}
        >
          <label htmlFor="vn-link-url" className="vn-sr">
            Link address
          </label>
          <input
            id="vn-link-url"
            autoFocus
            type="text"
            inputMode="url"
            placeholder="Paste a link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                setLinkOpen(false);
                getQuill()?.focus();
              }
            }}
            onBlur={() => setLinkOpen(false)}
          />
          <button type="submit" className="vn-btn is-primary" onMouseDown={(e) => e.preventDefault()}>
            Add
          </button>
        </form>
      )}
    </div>
  );
};
