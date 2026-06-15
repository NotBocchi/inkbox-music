import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song } from "../types/music";

interface LibraryState {
  songs: Song[];
  isImporting: boolean;
  error: string | null;
  addSongs: (songs: Song[]) => void;
  updateSong: (id: string, changes: Partial<Song>) => void;
  removeSong: (id: string) => void;
  setImporting: (value: boolean) => void;
  setError: (message: string | null) => void;
}

export const useLibraryStore = create<LibraryState>()(persist((set) => ({
  songs: [],
  isImporting: false,
  error: null,
  addSongs: (incoming) =>
    set((state) => {
      const known = new Set(state.songs.map((song) => song.path));
      return { songs: [...state.songs, ...incoming.filter((song) => !known.has(song.path))] };
    }),
  updateSong: (id, changes) =>
    set((state) => ({
      songs: state.songs.map((song) => (song.id === id ? { ...song, ...changes } : song)),
    })),
  removeSong: (id) =>
    set((state) => ({ songs: state.songs.filter((song) => song.id !== id) })),
  setImporting: (isImporting) => set({ isImporting }),
  setError: (error) => set({ error }),
}), {
  name: "inkbox-library",
  version: 2,
  migrate: (persisted) => {
    const state = persisted as Partial<LibraryState>;
    return {
      ...state,
      songs: (state.songs ?? []).filter(
        (song) => song.sourceType === "tauri" || song.path.startsWith("browser-audio://"),
      ),
    } as LibraryState;
  },
  partialize: (state) => ({ songs: state.songs }),
}));
