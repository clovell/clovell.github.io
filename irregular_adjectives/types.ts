export enum QuizMode {
  STANDARD = 'STANDARD',
  FULL_GENDER = 'FULL_GENDER',
  DEFINITION = 'DEFINITION'
}

export interface AdjectiveEntry {
  positive: string;
  comparative: string;
  comparativeFull: string;
  superlative: string;
  superlativeFull: string;
  definition: string;
  definitionComparative: string;
  definitionSuperlative: string;
}

export interface QuestionResult {
  positive: string;
  userAnswer1: string;
  userAnswer2?: string;
  userAnswer3?: string;
  correctAnswer1: string;
  correctAnswer2?: string;
  correctAnswer3?: string;
  isCorrect: boolean;
  isCorrect1: boolean;
  isCorrect2?: boolean;
  isCorrect3?: boolean;
}