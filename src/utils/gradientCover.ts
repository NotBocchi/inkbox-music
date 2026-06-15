import type { CSSProperties } from "react";
import type { GradientCover, Song } from "../types/music";

export const gradientPresets: Record<string, Omit<GradientCover, "preset">> = {
  "Midnight Aurora": { primary: "#111827", secondary: "#0f766e", accent: "#c084fc", direction: 140, glow: 72, noise: 12, vignette: 38 },
  "Sunset Velvet": { primary: "#3f172c", secondary: "#ef5b5b", accent: "#f7c873", direction: 125, glow: 66, noise: 10, vignette: 34 },
  "Ocean Glass": { primary: "#082f49", secondary: "#0891b2", accent: "#a5f3fc", direction: 150, glow: 60, noise: 8, vignette: 32 },
  "Grape Neon": { primary: "#24103d", secondary: "#7c3aed", accent: "#f0abfc", direction: 130, glow: 78, noise: 10, vignette: 40 },
  "Forest Mist": { primary: "#102a24", secondary: "#3f7652", accent: "#d4e8b7", direction: 155, glow: 48, noise: 14, vignette: 36 },
  "Mono Noir": { primary: "#09090b", secondary: "#3f3f46", accent: "#d4d4d8", direction: 135, glow: 35, noise: 18, vignette: 55 },
  "Candy Dream": { primary: "#4a1942", secondary: "#db4f8a", accent: "#7dd3fc", direction: 120, glow: 74, noise: 8, vignette: 28 },
  "Fire Bloom": { primary: "#3b120d", secondary: "#dc2626", accent: "#fbbf24", direction: 145, glow: 80, noise: 12, vignette: 42 },
};

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function defaultGradientFor(song: Pick<Song, "title" | "artist" | "album">): GradientCover {
  const names = Object.keys(gradientPresets);
  const preset = names[hash(`${song.title}|${song.artist}|${song.album}`) % names.length];
  return { preset, ...gradientPresets[preset] };
}

export function gradientCoverStyle(cover: GradientCover): CSSProperties {
  return {
    "--cover-primary": cover.primary,
    "--cover-secondary": cover.secondary,
    "--cover-accent": cover.accent,
    "--cover-direction": `${cover.direction}deg`,
    "--cover-glow": `${cover.glow}%`,
    "--cover-noise": cover.noise / 100,
    "--cover-vignette": cover.vignette / 100,
  } as CSSProperties;
}
