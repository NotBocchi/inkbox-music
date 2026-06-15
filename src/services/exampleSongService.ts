import { invoke, isTauri } from "@tauri-apps/api/core";
import { useLibraryStore } from "../stores/libraryStore";
import { createSongFromPath } from "./metadataService";

const EXAMPLE_SONG_INSTALLED_KEY = "inkbox-example-song-installed-v1";

interface ExampleSongPaths {
  audioPath: string;
  lyricPath: string;
}

export async function installBundledExampleSong(): Promise<void> {
  if (!isTauri() || localStorage.getItem(EXAMPLE_SONG_INSTALLED_KEY)) return;

  const paths = await invoke<ExampleSongPaths>("get_example_song_paths");
  const library = useLibraryStore.getState();
  if (!library.songs.some((song) => song.path === paths.audioPath)) {
    const song = await createSongFromPath(paths.audioPath, paths.lyricPath);
    useLibraryStore.getState().addSongs([song]);
  }
  localStorage.setItem(EXAMPLE_SONG_INSTALLED_KEY, "true");
}
