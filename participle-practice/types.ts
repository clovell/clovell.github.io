export interface Verb {
  id: string;
  principalParts: [string, string, string, string]; // e.g., ["amo", "amare", "amavi", "amatus"]
  conjugation: '1' | '2' | '3' | '3io' | '4';
  definition: string; // e.g., "to love"
}

export enum ParticipleType {
  PresentActive = 'Present Active',
  PerfectPassive = 'Perfect Passive',
  FutureActive = 'Future Active',
}

export interface Question {
  verb: Verb;
  targetType: ParticipleType;
  latinForm: string; // The generated participle (e.g., "amans")
  translationBase: string; // The generated translation (e.g., "loving")
}

export type GameMode = 'home' | 'identify' | 'form';
