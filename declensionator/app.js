document.addEventListener('DOMContentLoaded', () => {
  // Check if nouns are loaded via global window object
  if (!window.nouns) {
    console.error("Nouns data not loaded. Check nouns.js loading.");
    document.getElementById('noun-definition').textContent = "Error loading data. Please ensure nouns.js is in the same directory and loads before app.js.";
    return;
  }

  // Check if quotes are loaded
  const QUOTES = window.quotes || [
    { latin: "Carpe Diem", english: "Seize the day (Default)" }
  ];

  const nouns = window.nouns;

  // State
  let state = {
    currentNoun: null,
    score: 0,
    totalAttempts: 0,
    streak: 0,
    result: null, // 'correct' | 'incorrect' | null
    currentQuote: QUOTES[0],
    selectedDeclension: null // 1 | 2 | 3 | null
  };

  // DOM Elements
  const els = {
    score: document.getElementById('score-val'),
    streak: document.getElementById('streak-val'),
    
    nounNominative: document.getElementById('noun-nominative'),
    nounGenitive: document.getElementById('noun-genitive'),
    nounGender: document.getElementById('noun-gender'),
    nounDefinition: document.getElementById('noun-definition'),
    
    btn1: document.getElementById('btn-1'),
    btn2: document.getElementById('btn-2'),
    btn3: document.getElementById('btn-3'),
    
    feedbackArea: document.getElementById('feedback-area'),
    feedbackText: document.getElementById('feedback-text'),
    nextBtn: document.getElementById('next-btn'),
    
    quoteLatin: document.getElementById('quote-latin'),
    quoteEnglish: document.getElementById('quote-english')
  };

  // Helpers
  const getRandomNoun = () => nouns[Math.floor(Math.random() * nouns.length)];
  const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

  // Core Logic
  function init() {
    state.currentNoun = getRandomNoun();
    state.currentQuote = getRandomQuote();
    render();

    // Attach listeners
    els.btn1.addEventListener('click', () => handleGuess(1));
    els.btn2.addEventListener('click', () => handleGuess(2));
    els.btn3.addEventListener('click', () => handleGuess(3));
    els.nextBtn.addEventListener('click', handleNext);
  }

  function handleGuess(declension) {
    if (state.result !== null) return; // Prevent multiple guesses per word

    state.selectedDeclension = declension;
    state.totalAttempts++;

    if (declension === state.currentNoun.declension) {
      state.score++;
      state.streak++;
      state.result = 'correct';
    } else {
      state.streak = 0;
      state.result = 'incorrect';
    }

    render();
  }

  function handleNext() {
    state.currentNoun = getRandomNoun();
    state.currentQuote = getRandomQuote();
    state.result = null;
    state.selectedDeclension = null;
    render();
  }

  // Rendering
  function render() {
    // Stats
    els.score.textContent = `${state.score} / ${state.totalAttempts}`;
    els.streak.textContent = state.streak;
    
    // Noun Data
    els.nounNominative.textContent = state.currentNoun.nominative + ',';
    els.nounGenitive.textContent = state.currentNoun.genitive + ',';
    els.nounGender.textContent = state.currentNoun.gender + '.';
    els.nounDefinition.textContent = `"${state.currentNoun.definition}"`;

    // Buttons Styling
    [1, 2, 3].forEach(d => {
      const btn = els[`btn${d}`];
      
      // Reset special classes (keep base class from HTML)
      btn.className = "btn-base"; 

      if (state.result === null) {
        // Normal state - styles handled by default CSS
        btn.disabled = false;
      } else {
        // Result state
        btn.disabled = true;
        
        if (d === state.currentNoun.declension) {
          // This is the correct answer
          btn.classList.add('btn-correct');
        } else if (d === state.selectedDeclension) {
          // User picked this and it was wrong
          btn.classList.add('btn-wrong');
        } else {
          // Irrelevant button
          btn.classList.add('btn-dimmed');
        }
      }
    });

    // Feedback & Next Button
    if (state.result) {
      els.feedbackArea.classList.add('visible');
      
      // Reset feedback text color classes
      els.feedbackText.classList.remove('feedback-correct', 'feedback-incorrect');

      if (state.result === 'correct') {
        els.feedbackText.classList.add('feedback-correct');
        els.feedbackText.textContent = "Optime! (Correct)";
      } else {
        els.feedbackText.classList.add('feedback-incorrect');
        const correctDecl = state.currentNoun.declension;
        const ordinal = correctDecl === 1 ? '1st' : correctDecl === 2 ? '2nd' : '3rd';
        els.feedbackText.textContent = `Eheu! It was ${ordinal} Declension.`;
      }
    } else {
      els.feedbackArea.classList.remove('visible');
    }

    // Quote
    els.quoteLatin.textContent = `"${state.currentQuote.latin}"`;
    els.quoteEnglish.textContent = `(${state.currentQuote.english})`;
  }

  // Start
  init();
});