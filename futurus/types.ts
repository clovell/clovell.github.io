export type Person = '1st' | '2nd' | '3rd';
export type Number = 'Singular' | 'Plural';

export interface ConjugationForms {
  s1: string; // 1st Singular (Ego)
  s2: string; // 2nd Singular (Tu)
  s3: string; // 3rd Singular (Is/Ea/Id)
  p1: string; // 1st Plural (Nos)
  p2: string; // 2nd Plural (Vos)
  p3: string; // 3rd Plural (Ei/Eae/Ea)
}

export interface Verb {
  id: string;
  principalParts: string; // e.g., "amo, amare, amavi, amatus"
  infinitive: string;
  definition: string;
  conjugation: string; // e.g., "1st", "Irregular"
  futureActive: ConjugationForms;
}

export type InputState = {
  [key in keyof ConjugationForms]: string;
};

export type FeedbackState = {
  [key in keyof ConjugationForms]: 'correct' | 'incorrect' | 'neutral';
};