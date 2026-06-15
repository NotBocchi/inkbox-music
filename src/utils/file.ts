const AUDIO_EXTENSIONS = new Set(["mp3", "flac", "wav", "m4a"]);

export function extensionOf(path: string): string {
  return path.split(".").pop()?.toLowerCase() ?? "";
}

export function isSupportedAudio(path: string): boolean {
  return AUDIO_EXTENSIONS.has(extensionOf(path));
}

export function fileNameOf(path: string): string {
  return path.split(/[\\/]/).pop() ?? path;
}

export function stemOf(path: string): string {
  return fileNameOf(path).replace(/\.[^.]+$/, "");
}

export function replaceExtension(path: string, extension: string): string {
  return `${path.replace(/\.[^.\\/]+$/, "")}.${extension.replace(/^\./, "")}`;
}

export function joinLocalPath(parent: string, child: string): string {
  const separator = parent.includes("\\") ? "\\" : "/";
  return `${parent.replace(/[\\/]$/, "")}${separator}${child}`;
}

export function stableSongId(path: string): string {
  let hash = 2166136261;
  for (let index = 0; index < path.length; index += 1) {
    hash ^= path.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `song-${(hash >>> 0).toString(36)}`;
}
