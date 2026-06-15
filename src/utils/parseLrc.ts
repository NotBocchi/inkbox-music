import type { AmllLyricLine, LyricLine } from "../types/lyric";

const TIMESTAMP = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;

function fractionToMilliseconds(value = "0"): number {
  return Number(value.padEnd(3, "0").slice(0, 3));
}

export function parseLrc(source: string): LyricLine[] {
  const lines: LyricLine[] = [];

  for (const rawLine of source.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const matches = [...rawLine.matchAll(TIMESTAMP)];
    if (matches.length === 0) continue;
    const text = rawLine.replace(TIMESTAMP, "").trim();
    if (!text) continue;

    for (const match of matches) {
      const startTimeMs =
        Number(match[1]) * 60_000 +
        Number(match[2]) * 1_000 +
        fractionToMilliseconds(match[3]);
      const startTime = startTimeMs / 1000;
      lines.push({
        id: `${startTimeMs}-${lines.length}`,
        startTime,
        endTime: startTime + 5,
        text,
      });
    }
  }

  lines.sort((a, b) => a.startTime - b.startTime);
  return lines.map((line, index) => ({
    ...line,
    endTime: lines[index + 1]?.startTime ?? line.startTime + 8,
  }));
}

// LRC has line timing only. AMLL still accepts a single timed word per line,
// which keeps the parser replaceable when TTML/YRC word timing is added later.
export function toAmllLines(lines: LyricLine[]): AmllLyricLine[] {
  return lines.map((line) => ({
    words: [
      {
        word: line.text,
        startTime: Math.round(line.startTime * 1000),
        endTime: Math.round(line.endTime * 1000),
      },
    ],
    startTime: Math.round(line.startTime * 1000),
    endTime: Math.round(line.endTime * 1000),
    translatedLyric: "",
    romanLyric: "",
    isBG: false,
    isDuet: false,
  }));
}
