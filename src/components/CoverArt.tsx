import { Disc3, Music2 } from "lucide-react";
import type { Song } from "../types/music";
import { defaultGradientFor, gradientCoverStyle } from "../utils/gradientCover";

interface CoverArtProps {
  song: Song;
  size?: "small" | "large";
}

export function getSongCoverUrl(song: Song): string | undefined {
  if (song.coverMode === "gradient") return undefined;
  return song.customCover ?? song.embeddedCover ?? song.coverUrl;
}

export function CoverArt({ song, size = "small" }: CoverArtProps) {
  const className = `cover-art cover-art--${size}`;
  const coverUrl = getSongCoverUrl(song);
  if (coverUrl) return <img className={className} src={coverUrl} alt={`${song.title} 封面`} />;

  const gradient = song.gradientCover ?? defaultGradientFor(song);
  return (
    <div
      className={`${className} cover-art--gradient`}
      style={gradientCoverStyle(gradient)}
      aria-label={`${song.title} 渐变封面`}
    >
      <span className="cover-art__glow" />
      {size === "large" ? <Disc3 /> : <Music2 />}
    </div>
  );
}
