# Latin Declension Practice

Interactive quiz app for practicing Latin noun and adjective declensions, plus noun-adjective agreement across all five cases.

## Features

- **Four Practice Modes**:
  - **Nouns**: Practice declining 1st, 2nd, and 3rd declension nouns in singular and plural.
  - **Adjectives**: Practice declining full paradigms across all three genders (Masculine, Feminine, Neuter) for 2-1-2 and 3rd declension adjectives.
  - **Noun-Adjective Pairs**: Practice declining a noun and agreeing adjective together (reinforcing gender agreement across different declensions).
  - **Just the Endings**: Practice pure noun endings by selecting declension (1st, 2nd, 3rd) and gender (Masc, Fem, Neut). Restricts options by declension (no neuter in 1st declension; no feminine in 2nd declension) and respects the i-stem toggle.
- **Simplified Tab-Delimited Vocabulary**: Vocabulary entries are simple lines formatted as `dictionary_entry<TAB>definition`, making them easy to edit or copy from spreadsheets. Supports flexible dictionary formats:
  - **Nouns**: `puella, -ae, f.` or `mare, maris, -ium, n.`
  - **2-1-2 Adjectives**: `bonus, -a, -um` or `pulcher, pulchra, pulchrum`
  - **3rd Declension Adjectives**:
    - 3 terminations: `ācer, ācris, ācre`
    - 3 parts listed: `fortis, fortis, forte`
    - 2 terminations: `fortis, forte` or `fortis, -e`
    - 1 termination (4 parts): `ingēns, ingēns, ingēns, gen. ingentis`
    - 1 termination (2 parts): `ingēns, ingentis` (or `ingēns, gen. ingentis` / `ingēns, -entis`)
- **Dynamic Paradigm Generation**: `declension.js` generates all singular and plural forms on the fly for any standard Latin dictionary entry.
- **Declension Classification Step**: Interactive prompt to identify declension or adjective class before filling in tables.
- **Configurable Toggles**:
  - **Macrons Optional**: Toggle macron sensitivity.
  - **Include Dative**: Toggle inclusion of the dative case.
  - **Include Neuter Nouns**: Off by default; excludes neuter nouns from Nouns and Noun + Adjective modes, and greys out neuter columns in Adjectives mode.
  - **Include i-stems**: Toggle whether 3rd declension i-stem nouns and adjectives are included in the practice pool.
  - **Sound Effects**: Audio feedback with streak milestones and confetti.
- **Fully Static**: Just open `index.html` in a web browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure, mode navigation, and CDN imports |
| `style.css` | Classical styling and responsive layouts |
| `declension.js` | Latin grammar and paradigm generation engine |
| `vocabulary.txt` | Plain text tab-delimited noun and adjective vocabulary list |
| `audio.js` | Web Audio API sound effects |
| `app.js` | Application logic, mode handling, and DOM manipulation |

## Deployment

No build step required. Serve the files from any static host (GitHub Pages, S3, etc.) or open `index.html` directly in a browser.
