import { convertFileSrc } from "@tauri-apps/api/core";
import { exists } from "@tauri-apps/plugin-fs";
import type { Song } from "../types/music";
import { resolveBrowserAudioFile } from "./browserFileService";

let activeObjectUrl: string | null = null;

export async function resolveSongSrc(song: Song): Promise<string | null> {
  if (song.sourceType === "tauri") {
    if (!(await exists(song.path))) return null;
    return convertFileSrc(song.path);
  }

  const file = await resolveBrowserAudioFile(song.path);
  if (!file) return null;
  if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
  activeObjectUrl = URL.createObjectURL(file);
  return activeObjectUrl;
}
