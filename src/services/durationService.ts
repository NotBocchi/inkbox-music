import { convertFileSrc } from "@tauri-apps/api/core";
import type { Song } from "../types/music";
import { resolveBrowserAudioFile } from "./browserFileService";

const METADATA_TIMEOUT_MS = 15_000;

export async function readAudioDuration(song: Song): Promise<number> {
  let objectUrl: string | null = null;
  let src: string;

  if (song.sourceType === "tauri") {
    src = convertFileSrc(song.path);
  } else {
    const file = await resolveBrowserAudioFile(song.path);
    if (!file) return -1;
    objectUrl = URL.createObjectURL(file);
    src = objectUrl;
  }

  return new Promise((resolve) => {
    const audio = new Audio();
    let settled = false;

    const finish = (duration: number) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      audio.removeAttribute("src");
      audio.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(duration);
    };

    const readDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration >= 0) {
        finish(audio.duration);
      }
    };

    const timeout = window.setTimeout(() => finish(-1), METADATA_TIMEOUT_MS);
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", readDuration, { once: true });
    audio.addEventListener("durationchange", readDuration);
    audio.addEventListener("error", () => finish(-1), { once: true });
    audio.src = src;
    audio.load();
  });
}
