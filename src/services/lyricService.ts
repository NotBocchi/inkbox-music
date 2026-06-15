import { invoke, isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import type { AmllLyricLine, LyricLine } from "../types/lyric";
import { parseLrc, toAmllLines } from "../utils/parseLrc";
import {
  chooseBrowserFiles,
  readBrowserTextFile,
  registerBrowserTextFile,
} from "./browserFileService";

export interface ParsedLyrics {
  lines: LyricLine[];
  amllLines: AmllLyricLine[];
}

export async function readLyrics(path: string): Promise<ParsedLyrics> {
  let source: string;
  if (path.startsWith("browser-file://")) {
    source = await readBrowserTextFile(path);
  } else if (isTauri()) {
    try {
      source = await readTextFile(path);
    } catch {
      source = await invoke<string>("read_text_file", { path });
    }
  } else {
    source = await readTextFile(path);
  }
  const lines = parseLrc(source);
  return { lines, amllLines: toAmllLines(lines) };
}

export async function chooseLyricFile(): Promise<string | null> {
  if (!isTauri()) {
    const [file] = await chooseBrowserFiles({
      accept: ".lrc,text/plain",
    });
    return file ? await registerBrowserTextFile(file) : null;
  }

  const result = await open({
    multiple: false,
    directory: false,
    filters: [{ name: "LRC 歌词", extensions: ["lrc"] }],
  });
  return typeof result === "string" ? result : null;
}
