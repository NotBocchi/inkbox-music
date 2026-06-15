import { invoke, isTauri } from "@tauri-apps/api/core";

export async function revealSong(path: string): Promise<boolean> {
  if (!isTauri()) return false;
  await invoke("reveal_in_file_manager", { path });
  return true;
}

export async function openExternal(url: string): Promise<void> {
  if (isTauri()) {
    await invoke("open_external", { url });
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
