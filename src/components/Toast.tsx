import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useUiStore, type ToastKind } from "../stores/uiStore";

const icons: Record<ToastKind, typeof Info> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function ToastViewport() {
  const toasts = useUiStore((state) => state.toasts);
  const dismissToast = useUiStore((state) => state.dismissToast);

  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = icons[toast.kind];
        return (
          <div className={`toast toast--${toast.kind}`} key={toast.id}>
            <Icon />
            <span>{toast.message}</span>
            <button
              className="toast__close"
              title="关闭"
              onClick={() => dismissToast(toast.id)}
            >
              <X />
            </button>
          </div>
        );
      })}
    </div>
  );
}
