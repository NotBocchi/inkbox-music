import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir } from "@tauri-apps/plugin-fs";
import type { Song } from "../types/music";
import {
  isSupportedAudio,
  joinLocalPath,
  stemOf,
} from "../utils/file";
import {
  chooseBrowserFiles,
  registerBrowserTextFile,
} from "./browserFileService";
import {
  createSongFromBrowserFile,
  createSongFromPath,
} from "./metadataService";

const AUDIO_FILTER = {
  name: "音频文件",
  extensions: ["mp3", "flac", "wav", "m4a"],
};

export type SongReadyHandler = (song: Song) => void;

async function createSongs(
  tasks: Array<Promise<Song>>,
  onSongReady?: SongReadyHandler,
): Promise<Song[]> {
  return Promise.all(
    tasks.map(async (task) => {
      const song = await task;
      onSongReady?.(song);
      return song;
    }),
  );
}

async function scanDirectory(path: string): Promise<string[]> {
  const result: string[] = [];
  const entries = await readDir(path);

  for (const entry of entries) {
    const childPath = joinLocalPath(path, entry.name);
    if (entry.isDirectory) {
      result.push(...(await scanDirectory(childPath)));
    } else if (entry.isFile && isSupportedAudio(childPath)) {
      result.push(childPath);
    }
  }
  return result;
}

export async function chooseAudioFiles(
  onSongReady?: SongReadyHandler,
): Promise<Song[]> {
  if (!isTauri()) {
    const files = await chooseBrowserFiles({
      accept: ".mp3,.flac,.wav,.m4a,audio/*",
      multiple: true,
    });
    return createSongs(
      files.filter((file) => isSupportedAudio(file.name)).map((file) =>
        createSongFromBrowserFile(file),
      ),
      onSongReady,
    );
  }

  const result = await open({
    multiple: true,
    directory: false,
    filters: [AUDIO_FILTER],
  });
  if (!result) return [];
  const paths = Array.isArray(result) ? result : [result];
  return createSongs(
    paths.filter(isSupportedAudio).map((path) => createSongFromPath(path)),
    onSongReady,
  );
}

export async function chooseMusicFolder(
  onSongReady?: SongReadyHandler,
): Promise<Song[]> {
  if (!isTauri()) {
    const files = await chooseBrowserFiles({
      accept: ".mp3,.flac,.wav,.m4a,.lrc,audio/*",
      directory: true,
    });
    const lyricsByStem = new Map(
      files
        .filter((file) => file.name.toLowerCase().endsWith(".lrc"))
        .map((file) => [stemOf(file.name).toLowerCase(), file]),
    );

    return createSongs(
      files
        .filter((file) => isSupportedAudio(file.name))
        .map(async (file) => {
        const lyricFile = lyricsByStem.get(stemOf(file.name).toLowerCase());
        const lyricPath = lyricFile
          ? await registerBrowserTextFile(lyricFile)
          : undefined;
        return createSongFromBrowserFile(file, lyricPath);
        }),
      onSongReady,
    );
  }

  const result = await open({ multiple: false, directory: true });
  if (typeof result !== "string") return [];
  const paths = await scanDirectory(result);
  return createSongs(
    paths.map((path) => createSongFromPath(path)),
    onSongReady,
  );
}
