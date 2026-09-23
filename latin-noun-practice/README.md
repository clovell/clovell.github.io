# Latin Noun Declension Practice

Interactive quiz app for practicing Latin noun declensions (2nd & 3rd declension neuters, plus selected masculine/feminine nouns).

## Features

- Declension identification step before filling in forms
- All five cases (nominative, genitive, dative, accusative, ablative)
- Singular and plural paradigms
- Macron-tolerant input (togglable)
- Streak tracking with confetti and sound effects
- Fully static — just open `index.html` in a browser

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and CDN imports |
| `style.css` | All styling (responsive, no frameworks) |
| `vocabulary.js` | Latin noun data with all declension forms |
| `audio.js` | Web Audio API sound effects |
| `app.js` | Application logic and DOM manipulation |

## Deployment

No build step required. Serve the files from any static host (GitHub Pages, S3, etc.) or open `index.html` directly in a browser.
