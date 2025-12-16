import { Verb, Tense } from '../types';
import { VERBS_LIST } from '../constants';

export const VERBS: Verb[] = VERBS_LIST;

export const getRandomVerb = (): Verb => {
  return VERBS[Math.floor(Math.random() * VERBS.length)];
};

export const getRandomTense = (): Tense => {
  const tenses = [Tense.PerfectPassive, Tense.PluperfectPassive, Tense.FuturePerfectPassive];
  return tenses[Math.floor(Math.random() * tenses.length)];
};

// Helper to get stem from 4th principal part
const getParticipialStem = (ppp: string): string => {
  // Remove 'us' from end
  if (ppp.endsWith('us')) {
    return ppp.slice(0, -2);
  }
  return ppp; // Fallback logic
};

export const getCorrectForms = (verb: Verb, tense: Tense): Record<string, string> => {
  const ppp = verb.principalParts[3];
  const stem = getParticipialStem(ppp);
  
  // Standard participial forms
  // Singular: stem + us, -a, -um (or full words)
  // Plural: stem + i, -ae, -a
  
  // Auxiliary verbs
  let auxSg: string[] = [];
  let auxPl: string[] = [];
  
  switch (tense) {
    case Tense.PerfectPassive:
      auxSg = ['sum', 'es', 'est'];
      auxPl = ['sumus', 'estis', 'sunt'];
      break;
    case Tense.PluperfectPassive:
      auxSg = ['eram', 'eras', 'erat'];
      auxPl = ['eramus', 'eratis', 'erant'];
      break;
    case Tense.FuturePerfectPassive:
      auxSg = ['ero', 'eris', 'erit'];
      auxPl = ['erimus', 'eritis', 'erunt'];
      break;
  }

  // Generate strict correct strings for internal reference if needed, 
  // but we will use a loose validator function instead of exact string matching.
  // Returning a representative correct answer for display/hint purposes.
  
  const sgEndings = `${stem}us, -a, -um`; // Display format
  const plEndings = `${stem}i, -ae, -a`; // Display format
  
  return {
    '1s': `${sgEndings} ${auxSg[0]}`,
    '2s': `${sgEndings} ${auxSg[1]}`,
    '3s': `${sgEndings} ${auxSg[2]}`,
    '1pl': `${plEndings} ${auxPl[0]}`,
    '2pl': `${plEndings} ${auxPl[1]}`,
    '3pl': `${plEndings} ${auxPl[2]}`,
  };
};

// Normalizes input for comparison
// "Laudatus, -a, -um sum" -> "laudatusaumsum"
const normalize = (str: string): string => {
  return str.toLowerCase()
    .replace(/[,.\-\s]/g, '') // Remove punctuation and spaces
    .replace(/ā/g, 'a').replace(/ē/g, 'e').replace(/ī/g, 'i').replace(/ō/g, 'o').replace(/ū/g, 'u'); // Flatten macrons
};

export const checkAnswer = (input: string, verb: Verb, tense: Tense, person: string): boolean => {
  const normInput = normalize(input);
  const ppp = verb.principalParts[3];
  const stem = getParticipialStem(ppp);
  
  let expectedStemPart = '';
  let expectedAux = '';

  const isSingular = person.endsWith('s');

  if (isSingular) {
    // Expect: stem + us + a + um
    // Valid variations user might type:
    // "laudatus, a, um"
    // "laudatus -a -um"
    // "laudatus a um"
    expectedStemPart = `${stem}us${stem}a${stem}um`; // Full words "laudatus laudata laudatum"
    // But wait, the user often types shorthand "laudatus, -a, -um".
    // Normalizing "laudatus, -a, -um" -> "laudatusaum".
    // Normalizing "laudatus, a, um" -> "laudatusaum".
    // Normalizing "laudatus a um" -> "laudatusaum".
    // But "laudatus laudata laudatum" -> "laudatuslaudatalaudatum".
    
    // We should check against the shorthand version primarily as per prompt instructions.
    // "laudatus, -a, -um" normalized is "laudatusaum".
    const normalizedShorthand = `${stem}usaum`;
    
    // Auxiliaries
    switch (tense) {
      case Tense.PerfectPassive:
         if (person === '1s') expectedAux = 'sum';
         if (person === '2s') expectedAux = 'es';
         if (person === '3s') expectedAux = 'est';
         break;
      case Tense.PluperfectPassive:
         if (person === '1s') expectedAux = 'eram';
         if (person === '2s') expectedAux = 'eras';
         if (person === '3s') expectedAux = 'erat';
         break;
      case Tense.FuturePerfectPassive:
         if (person === '1s') expectedAux = 'ero';
         if (person === '2s') expectedAux = 'eris';
         if (person === '3s') expectedAux = 'erit';
         break;
    }
    
    // User input MUST contain the aux.
    // User input MUST contain the participle gender markers.
    
    // Check for auxiliary presence
    if (!normInput.includes(expectedAux)) return false;
    
    // Remove aux from input to check stem
    const inputWithoutAux = normInput.replace(expectedAux, '');
    
    // Allow either full expansion or shorthand
    // Shorthand: "laudatusaum"
    // Full: "laudatuslaudatalaudatum" (unlikely user types this but possible)
    // Also "laudatuslaudataum" is weird.
    
    // Let's strictly check for the stem and the endings 'us', 'a', 'um'.
    return inputWithoutAux === normalizedShorthand || inputWithoutAux === `${stem}us${stem}a${stem}um`;
    
  } else {
    // Plural
    // Expect: stem + i + ae + a
    // Shorthand normalized: "laudatiaea"
    const normalizedShorthand = `${stem}iaea`;

     switch (tense) {
      case Tense.PerfectPassive:
         if (person === '1pl') expectedAux = 'sumus';
         if (person === '2pl') expectedAux = 'estis';
         if (person === '3pl') expectedAux = 'sunt';
         break;
      case Tense.PluperfectPassive:
         if (person === '1pl') expectedAux = 'eramus';
         if (person === '2pl') expectedAux = 'eratis';
         if (person === '3pl') expectedAux = 'erant';
         break;
      case Tense.FuturePerfectPassive:
         if (person === '1pl') expectedAux = 'erimus';
         if (person === '2pl') expectedAux = 'eritis';
         if (person === '3pl') expectedAux = 'erunt';
         break;
    }

    if (!normInput.includes(expectedAux)) return false;
    const inputWithoutAux = normInput.replace(expectedAux, '');
    
    return inputWithoutAux === normalizedShorthand || inputWithoutAux === `${stem}i${stem}ae${stem}a`;
  }
};