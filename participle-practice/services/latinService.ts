import { ParticipleType, Verb } from '../types';

/**
 * Removes macrons and normalizes text for comparison.
 */
export const normalizeLatin = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[,;]/g, '') // Remove punctuation often used in lists like "amans, amantis"
    .trim();
};

/**
 * Helper to form English present participle (loving, coming, etc.)
 */
const getEnglishPresentParticiple = (baseVerb: string): string => {
  // Handle cases like "make/do" -> use "make"
  const v = baseVerb.split('/')[0].trim();
  
  // Basic rule: drop 'e' before 'ing' unless 'ee' or 'be' (e.g. seeing, being)
  // This covers: come -> coming, love -> loving, make -> making
  if (v.endsWith('e') && v !== 'see' && v !== 'be') {
    return v.slice(0, -1) + 'ing';
  }
  return v + 'ing';
};

/**
 * Helper to form English past participle (loved, carried, taken, etc.)
 */
const getEnglishPastParticiple = (baseVerb: string): string => {
  const v = baseVerb.toLowerCase().trim();
  const map: Record<string, string> = {
    'make/do': 'made', 
    'make': 'made', 
    'do': 'done',
    'hear': 'heard',
    'take': 'taken',
    'come': 'come',
    'see': 'seen',
    'teach': 'taught',
    'lead': 'led',
    // 'carry' is handled by rule below
  };

  if (map[v]) return map[v];

  // Consonant + y -> ied (e.g. carry -> carried)
  if (v.endsWith('y') && !/[aeiou]y$/.test(v)) {
    return v.slice(0, -1) + 'ied';
  }

  // Ends in e -> d (e.g. love -> loved)
  if (v.endsWith('e')) {
    return v + 'd';
  }

  // Default -> ed (e.g. warn -> warned)
  return v + 'ed';
};

/**
 * Generates the Latin form and English translation for a specific participle type.
 */
export const generateParticipleData = (
  verb: Verb,
  type: ParticipleType
): { latin: string; latinDisplay: string; translation: string } => {
  const [pp1, pp2, pp3, pp4] = verb.principalParts;
  
  // Clean stems (remove macrons for logic, keep for display if needed, though we usually just process raw)
  // We will assume the teacher enters macrons in the data file.
  
  const rootInf = pp2.replace(/[\u0300-\u036f]/g, '').slice(0, -2); // remove 're'
  
  let latin = '';
  let latinDisplay = ''; // The full dictionary entry style
  let translation = '';

  const cleanDefinition = verb.definition.replace(/^to\s+/, '');

  switch (type) {
    case ParticipleType.PresentActive:
      // Formation: Present stem + ns (nom), ntis (gen)
      // 1st (amare) -> ama -> amans
      // 2nd (monere) -> mone -> monens
      // 3rd (regere) -> rege -> regens
      // 3rd-io (capere) -> capie -> capiens
      // 4th (audire) -> audie -> audiens
      
      let base = '';
      if (verb.conjugation === '1') base = pp2.slice(0, -2);
      else if (verb.conjugation === '2') base = pp2.slice(0, -2);
      else if (verb.conjugation === '3') base = pp1.slice(0, -1) + 'e'; // rego -> reg -> rege
      else if (verb.conjugation === '3io') base = pp1.slice(0, -1) + 'e'; // capio -> capi -> capie
      else if (verb.conjugation === '4') base = pp1.slice(0, -1) + 'e'; // audio -> audi -> audie
      
      latinDisplay = `${base}ns, ${base}ntis`;
      latin = `${base}ns`; 
      translation = getEnglishPresentParticiple(cleanDefinition);
      break;

    case ParticipleType.PerfectPassive:
        // 4th Principal Part
        const pp4Clean = pp4.split(',')[0].trim(); // Take first word "amatus"
        latin = pp4Clean;
        latinDisplay = `${pp4Clean}, -a, -um`;
        
        const pastParticipleEnglish = getEnglishPastParticiple(cleanDefinition);
        translation = `having been ${pastParticipleEnglish}`; 
        break;

    case ParticipleType.FutureActive:
        // 4th PP stem + urus
        const pp4Stem = pp4.split(',')[0].trim().slice(0, -2); // amat
        latin = `${pp4Stem}ūrus`;
        latinDisplay = `${pp4Stem}ūrus, -a, -um`;
        translation = `about to ${cleanDefinition}`;
        break;
  }

  return { latin, latinDisplay, translation };
};

/**
 * Checks if the user's translation is acceptable.
 */
export const isTranslationCorrect = (user: string, definition: string, type: ParticipleType): boolean => {
    const normUser = user.toLowerCase().trim();
    const cleanDef = definition.replace(/^to\s+/, '').toLowerCase();
    
    const past = getEnglishPastParticiple(cleanDef);

    if (type === ParticipleType.PresentActive) {
        // expected: "loving", "coming"
        const expected = getEnglishPresentParticiple(cleanDef);
        return normUser.includes(expected);
    }

    if (type === ParticipleType.PerfectPassive) {
        // expected: "loved", "having been loved"
        // Also accept combinations like "loved, having been loved"
        const validForms = [past, `having been ${past}`];
        
        // Split by comma or slash to allow for lists of answers
        const parts = normUser.split(/[,/]+/).map(p => p.trim()).filter(p => p.length > 0);
        
        if (parts.length === 0) return false;

        // Check if every part provided is a valid form
        return parts.every(p => validForms.includes(p));
    }

    if (type === ParticipleType.FutureActive) {
        // expected: "about to love", "going to love"
        return normUser.includes(`about to ${cleanDef}`) || normUser.includes(`going to ${cleanDef}`);
    }

    return false;
};

/**
 * Check formation answer.
 * User might type "amans", "amans, amantis", "amatus", "amatus -a -um", etc.
 */
export const isFormationCorrect = (user: string, correctLatin: string, correctDisplay: string): boolean => {
    const normUser = normalizeLatin(user);
    const normCorrect = normalizeLatin(correctLatin);
    const normDisplay = normalizeLatin(correctDisplay);
    
    // Check main form
    if (normUser === normCorrect) return true;
    
    // Check full dictionary entry style
    if (normUser === normDisplay) return true;

    // Check partial entry (e.g., "amatus a um")
    const flexibleDisplay = normDisplay.replace(/-|\,/g, ' ').replace(/\s+/g, ' ').trim();
    const flexibleUser = normUser.replace(/-|\,/g, ' ').replace(/\s+/g, ' ').trim();
    if (flexibleUser === flexibleDisplay) return true;

    // Special case for Present Active: user might just type "amans" or "amans amantis"
    if (normDisplay.includes(normUser) && normUser.length > 3) return true; // Loose matching but risky?
    
    // Let's be strict but allow standard variations
    // If correct is "amans, amantis"
    // Allow: "amans", "amans amantis", "amans, amantis"
    const parts = normDisplay.split(' ');
    if (parts.length > 0 && normUser === parts[0].replace(',', '')) return true;

    return false;
}
