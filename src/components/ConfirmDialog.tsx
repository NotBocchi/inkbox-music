import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, open]);

  if (!open) return null;

  return createPortal(
    <div className="confirm-backdrop" onMouseDown={onCancel}>
      <section
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="confirm-dialog__header">
          <span className="confirm-dialog__icon"><AlertTriangle /></span>
          <button className="icon-button" title="关闭" onClick={onCancel}><X /></button>
        </header>
        <div className="confirm-dialog__body">
          <h2 id="confirm-title">{title}</h2>
          <p id="confirm-description">{description}</p>
        </div>
        <footer className="confirm-dialog__actions">
          <button ref={cancelRef} className="secondary-button" onClick={onCancel}>取消</button>
          <button className="danger-button" onClick={onConfirm}>{confirmLabel}</button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
