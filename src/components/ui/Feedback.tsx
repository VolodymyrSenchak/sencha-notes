import { useEffect, useRef, useState } from "react";
import "./ui.scss";

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
}

const TOAST_MS = 8000;

export const Toast: React.FC<ToastProps> = ({ message, actionLabel, onAction, onDismiss }) => {
  const [paused, setPaused] = useState(false);

  // The timer pauses while the pointer or keyboard focus is on the toast, so Undo can't vanish mid-reach.
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(onDismiss, TOAST_MS);
    return () => clearTimeout(t);
  }, [message, onDismiss, paused]);

  return (
    <div
      className="vn-toast"
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span>{message}</span>
      {actionLabel && (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

interface ConfirmProps {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmProps> = ({ title, body, confirmLabel, onConfirm, onCancel }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => cancelRef.current?.focus(), []);

  return (
    <>
      <div className="vn-scrim" onMouseDown={onCancel} />
      <div
        className="vn-confirm"
        role="alertdialog"
        aria-labelledby="vn-confirm-title"
        aria-describedby="vn-confirm-body"
        onKeyDown={(e) => e.key === "Escape" && onCancel()}
      >
        <h2 id="vn-confirm-title">{title}</h2>
        <p id="vn-confirm-body">{body}</p>
        <div className="vn-confirm-actions">
          <button ref={cancelRef} type="button" className="vn-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="vn-btn is-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
};
