import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon, IconName } from "./Icon";
import "./ui.scss";

export type MenuItem =
  | {
      label: string;
      icon?: IconName;
      onSelect?: () => void;
      danger?: boolean;
      disabled?: boolean;
      checked?: boolean;
      children?: MenuItem[];
    }
  | { divider: true }
  | { custom: ReactNode };

export interface MenuAnchor {
  x: number;
  y: number;
}

interface MenuProps {
  anchor: MenuAnchor;
  items: MenuItem[];
  label: string;
  onClose: () => void;
  align?: "start" | "end";
}

export const Menu: React.FC<MenuProps> = ({ anchor, items, label, onClose, align = "start" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [stack, setStack] = useState<{ title: string; items: MenuItem[] }[]>([]);
  const [pos, setPos] = useState({ left: anchor.x, top: anchor.y });
  const level = stack[stack.length - 1];
  const visible = level?.items ?? items;

  // Keep the menu inside the popup window.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const left = align === "end" ? anchor.x - width : anchor.x;
    setPos({
      left: Math.max(8, Math.min(left, window.innerWidth - width - 8)),
      top: Math.max(8, Math.min(anchor.y, window.innerHeight - height - 8)),
    });
  }, [anchor, align, visible]);

  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>("[role^=menuitem]:not(:disabled)")?.focus();
  }, [visible]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, [onClose]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const buttons = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>("[role^=menuitem]:not(:disabled)") ?? [],
    );
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") buttons[(i + 1) % buttons.length]?.focus();
    else if (e.key === "ArrowUp") buttons[(i - 1 + buttons.length) % buttons.length]?.focus();
    else if (e.key === "Escape" || (e.key === "ArrowLeft" && stack.length)) {
      if (stack.length) setStack(stack.slice(0, -1));
      else onClose();
    } else return;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      ref={ref}
      className="vn-menu"
      role="menu"
      aria-label={level?.title ?? label}
      style={{ left: pos.left, top: pos.top }}
      onKeyDown={onKeyDown}
    >
      {level && (
        <button
          type="button"
          role="menuitem"
          className="vn-menu-item vn-menu-back"
          onClick={() => setStack(stack.slice(0, -1))}
        >
          <Icon name="chevron" size={14} className="vn-flip" />
          {level.title}
        </button>
      )}
      {visible.map((item, i) => {
        if ("divider" in item) return <hr key={i} />;
        if ("custom" in item) return <div key={i}>{item.custom}</div>;
        return (
          <button
            key={i}
            type="button"
            role={item.checked === undefined ? "menuitem" : "menuitemradio"}
            disabled={item.disabled}
            aria-checked={item.checked}
            className={`vn-menu-item${item.danger ? " is-danger" : ""}`}
            onClick={() => {
              if (item.children) {
                setStack([...stack, { title: item.label, items: item.children }]);
                return;
              }
              onClose();
              item.onSelect?.();
            }}
          >
            {item.icon ? <Icon name={item.icon} size={15} /> : <span className="vn-menu-spacer" />}
            <span className="vn-menu-label">{item.label}</span>
            {item.checked && <Icon name="check" size={14} stroke={2.2} />}
            {item.children && <Icon name="chevron" size={14} />}
          </button>
        );
      })}
    </div>
  );
};

export const anchorFromElement = (el: Element, align: "start" | "end" = "end"): MenuAnchor => {
  const r = el.getBoundingClientRect();
  return { x: align === "end" ? r.right : r.left, y: r.bottom + 4 };
};
