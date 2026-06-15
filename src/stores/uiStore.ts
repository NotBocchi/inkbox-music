import { create } from "zustand";

export type ToastKind = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  kind: ToastKind;
}

interface UiState {
  selectedSongId: string | null;
  toasts: ToastMessage[];
  setSelectedSongId: (id: string | null) => void;
  showToast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  selectedSongId: null,
  toasts: [],
  setSelectedSongId: (selectedSongId) => set({ selectedSongId }),
  showToast: (message, kind = "info") => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts.slice(-3), { id, message, kind }],
    }));
    window.setTimeout(() => get().dismissToast(id), 3200);
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
