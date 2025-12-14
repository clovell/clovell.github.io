document.addEventListener('DOMContentLoaded', () => {
  // Check if nouns are loaded via global window object
  if (!window.nouns) {
    console.error("Nouns data not loaded. Check nouns.js loading.");
    document.getElementById('noun-definition').textContent = "Error loading data. Please ensure nouns.js is in the same directory and loads before app.js.";
    return;
  }

  const nouns = window.nouns;

  const QUOTES = [
    { latin: "Labor omnia vincit.", english: "Work conquers all." },
    { latin: "Repetitio est mater studiorum.", english: "Repetition is the mother of studies." },
    { latin: "Ad astra per aspera.", english: "To the stars through difficulties." },
    { latin: "Nulla dies sine linea.", english: "No day without a line." },
    { latin: "Fabricando fit faber.", english: "Practice makes perfect." },
    { latin: "Perfer et obdura; dolor hic tibi proderit olim.", english: "Endure and be tough; this pain will be of use to you someday." },
    { latin: "Radices litterarum amarae sunt, fructus dulces.", english: "The roots of scholarship are bitter, its fruits are sweet." },
    { latin: "Non scholae sed vitae discimus.", english: "We learn not for school but for life." }
  ];

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
      
      // Reset classes
      btn.className = "btn-base py-4 rounded-md font-bold text-lg border-2 font-serif-custom ";

      if (state.result === null) {
        // Normal state
        btn.className += "bg-white border-gray-300 text-gray-700 hover:border-roman-gold hover:text-roman-gold hover:-translate-y-1 shadow-sm";
        btn.disabled = false;
      } else {
        // Result state
        btn.disabled = true;
        
        if (d === state.currentNoun.declension) {
          // This is the correct answer -> Green
          btn.className += "bg-green-100 border-green-600 text-green-800 scale-105 shadow-md ring-2 ring-green-200 z-10";
        } else if (d === state.selectedDeclension) {
          // User picked this and it was wrong -> Red
          btn.className += "bg-red-100 border-red-500 text-red-800";
        } else {
          // Irrelevant button -> Dimmed
          btn.className += "bg-gray-50 border-gray-200 text-gray-300 opacity-40 cursor-not-allowed";
        }
      }
    });

    // Feedback & Next Button
    if (state.result) {
      els.feedbackArea.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      els.feedbackArea.classList.add('opacity-100', 'translate-y-0');
      
      if (state.result === 'correct') {
        els.feedbackText.className = "text-xl font-bold mb-4 mobile-landscape-mb-2 font-serif-custom text-green-600";
        els.feedbackText.textContent = "Optime! (Correct)";
      } else {
        els.feedbackText.className = "text-xl font-bold mb-4 mobile-landscape-mb-2 font-serif-custom text-roman-red";
        const correctDecl = state.currentNoun.declension;
        const ordinal = correctDecl === 1 ? '1st' : correctDecl === 2 ? '2nd' : '3rd';
        els.feedbackText.textContent = `Eheu! It was ${ordinal} Declension.`;
      }
    } else {
      els.feedbackArea.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      els.feedbackArea.classList.remove('opacity-100', 'translate-y-0');
    }

    // Quote
    els.quoteLatin.textContent = `"${state.currentQuote.latin}"`;
    els.quoteEnglish.textContent = `(${state.currentQuote.english})`;
  }

  // Start
  init();
});