export type GameState = 'welcome' | 'playing' | 'summary';

export enum Tense {
  PerfectPassive = 'Perfect Passive',
  PluperfectPassive = 'Pluperfect Passive',
  FuturePerfectPassive = 'Future Perfect Passive'
}

export interface Verb {
  word: string;
  principalParts: [string, string, string, string]; // e.g., ["amo", "amare", "amavi", "amatus"]
  conjugation: number | string; // 1, 2, 3, 3io, 4
  definition: string;
}

export interface AnswerState {
  [key: string]: string; // key is position "1s", "2s", etc. value is user input
}

export interface ValidationState {
  [key: string]: boolean | null; // true = correct, false = incorrect, null = pristine
}

// Extend Window interface for canvas-confetti
declare global {
  interface Window {
    confetti: any;
  }
}