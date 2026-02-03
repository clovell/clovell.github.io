/**
 * Normalizes Latin text by:
 * 1. Removing macrons (long marks).
 * 2. converting to lowercase.
 * 3. removing extra whitespace.
 */
export const normalizeLatin = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritics (macrons, breves)
    .trim();
};

/**
 * Normalizes punctuation for "full gender" checks.
 * e.g., "optimus, -a, -um" -> "optimus -a -um" -> "optimusaum" for loose comparison
 * However, to be helpful but strict enough, we usually just want to ignore spaces after commas.
 */
export const normalizeForComparison = (text: string): string => {
  // Remove all spaces and standard punctuation used in the format
  return normalizeLatin(text).replace(/[\s,]/g, "");
};

/**
 * Checks if the user answer matches the expected answer, ignoring macrons and loose punctuation spacing.
 */
export const checkAnswer = (userRaw: string, expectedRaw: string): boolean => {
  const user = normalizeForComparison(userRaw);
  const expected = normalizeForComparison(expectedRaw);
  
  return user === expected;
};

/**
 * Checks if a user's English definition matches any of the allowed definitions.
 * @param userRaw The user's input string.
 * @param allowedRaw A comma-separated string of allowed definitions (e.g., "great, large, big").
 */
export const checkDefinition = (userRaw: string, allowedRaw: string): boolean => {
  const user = userRaw.toLowerCase().trim();
  if (!user) return false;
  
  // Split allowed definitions by comma and normalize
  const allowed = allowedRaw.split(',').map(s => s.trim().toLowerCase());
  
  return allowed.includes(user);
};

export const formatLatinDisplay = (text: string): string => {
    // Simply returns the text, this is a placeholder if we wanted to auto-add macrons visually later
    return text;
};