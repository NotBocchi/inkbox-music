export interface LyricLine {
  id: string;
  /** LRC-facing time values are kept in seconds. */
  startTime: number;
  endTime: number;
  text: string;
}

export interface AmllWord {
  word: string;
  startTime: number;
  endTime: number;
}

export interface AmllLyricLine {
  words: AmllWord[];
  startTime: number;
  endTime: number;
  translatedLyric: string;
  romanLyric: string;
  isBG: boolean;
  isDuet: boolean;
}
