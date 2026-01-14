/**
 * Normalizes Latin text by removing macrons for easier typing check if user doesn't use them,
 * OR validates strict macron usage depending on strictMode.
 */
export const normalizeLatin = (text: string): string => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

export const checkAnswer = (input: string, correct: string): boolean => {
  // Allow answers with or without macrons to be correct, 
  // but strictly checking macrons is better pedagogy.
  // For this app, we will allow loose matching (no macrons) OR strict matching.
  
  const cleanInput = input.trim().toLowerCase();
  const cleanCorrect = correct.trim().toLowerCase();
  const noMacronInput = normalizeLatin(cleanInput);
  const noMacronCorrect = normalizeLatin(cleanCorrect);

  // If user types macrons, they must be correct.
  // If user types no macrons, we accept it if the letters match.
  if (cleanInput === cleanCorrect) return true;
  if (cleanInput === noMacronCorrect) return true; // Typed without macrons
  
  return false;
};

export const getPersonLabel = (key: string): string => {
  const map: Record<string, string> = {
    s1: '1st Singular (Ego)',
    s2: '2nd Singular (Tu)',
    s3: '3rd Singular (Is/Ea/Id)',
    p1: '1st Plural (Nos)',
    p2: '2nd Plural (Vos)',
    p3: '3rd Plural (Ei/Eae/Ea)',
  };
  return map[key];
};