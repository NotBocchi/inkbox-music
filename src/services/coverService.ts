import { convertFileSrc, isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { chooseBrowserFiles } from "./browserFileService";

export async function chooseCoverImage(): Promise<string | null> {
  if (isTauri()) {
    const path = await open({
      multiple: false,
      directory: false,
      filters: [{ name: "图片", extensions: ["jpg", "jpeg", "png", "webp"] }],
    });
    return typeof path === "string" ? convertFileSrc(path) : null;
  }

  const [file] = await chooseBrowserFiles({
    accept: "image/jpeg,image/png,image/webp",
  });
  if (!file) return null;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
