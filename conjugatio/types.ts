export enum Conjugation {
  First = '1st',
  Second = '2nd',
  Third = '3rd',
  ThirdIO = '3rd -io',
  Fourth = '4th',
}

export interface Verb {
  id: string;
  principalParts: [string, string, string, string]; // e.g., ["amo", "amare", "amavi", "amatus"]
  conjugation: Conjugation;
  definition: string;
  etymology?: string;
}

export type GameState = 'playing' | 'success' | 'error';

export interface Stats {
  correct: number;
  total: number;
  streak: number;
}