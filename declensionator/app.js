document.addEventListener('DOMContentLoaded', () => {
  // Check if nouns are loaded
  if (!window.nounSets) {
    console.error("Nouns data not loaded. Check nouns.js loading.");
    document.getElementById('noun-definition').textContent = "Error loading data.";
    return;
  }

  const QUOTES = window.quotes || [{ latin: "Carpe Diem", english: "Seize the day" }];
  const nounSets = window.nounSets;

  // --- AUDIO SYSTEM (Web Audio API) ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  const Sound = {
    // Helper adapted to match the Conjugatio style (adding startTime parameter)
    playTone: (freq, type, startTime, duration, volume = 0.1) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    },

    playCorrect: () => {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      
      // Conjugatio 'correct' sound: C5 followed quickly by C6
      Sound.playTone(523.25, 'sine', now, 0.3, 0.2); // C5
      Sound.playTone(1046.50, 'sine', now + 0.05, 0.4, 0.1); // C6
    },

    playWrong: () => {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;

      // Conjugatio 'incorrect' sound: Sawtooth dropping in pitch
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.3); 
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    },

    playCelebration: (intensity = 1) => {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      // Major arpeggio fanfare
      const baseTime = 0.1;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
      
      let count = intensity >= 2 ? 2 : 1; // Play twice for high intensity
      
      for(let j=0; j<count; j++) {
        notes.forEach((note, i) => {
          // Adjust to use the new playTone signature which includes startTime
          Sound.playTone(note, 'triangle', now + (i * baseTime) + (j * 0.4), 0.3, 0.1);
        });
      }
    }
  };

  // --- CONFETTI SYSTEM ---
  const Confetti = {
    canvas: document.getElementById('confetti-canvas'),
    ctx: document.getElementById('confetti-canvas').getContext('2d'),
    particles: [],
    animationId: null,

    resize: () => {
      Confetti.canvas.width = window.innerWidth;
      Confetti.canvas.height = window.innerHeight;
    },

    create: (amount = 50) => {
      const colors = ['#781c1c', '#c5a059', '#15803d', '#fcd34d', '#ffffff'];
      for (let i = 0; i < amount; i++) {
        Confetti.particles.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20 - 5, // Upward bias
          gravity: 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10
        });
      }
      if (!Confetti.animationId) Confetti.animate();
    },

    animate: () => {
      Confetti.ctx.clearRect(0, 0, Confetti.canvas.width, Confetti.canvas.height);
      
      Confetti.particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.vx *= 0.96; // Air resistance

        Confetti.ctx.save();
        Confetti.ctx.translate(p.x, p.y);
        Confetti.ctx.rotate((p.rotation * Math.PI) / 180);
        Confetti.ctx.fillStyle = p.color;
        Confetti.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        Confetti.ctx.restore();

        // Remove off-screen particles
        if (p.y > window.innerHeight) {
          Confetti.particles.splice(index, 1);
        }
      });

      if (Confetti.particles.length > 0) {
        Confetti.animationId = requestAnimationFrame(Confetti.animate);
      } else {
        Confetti.animationId = null;
      }
    }
  };

  // Initialize Confetti Canvas
  window.addEventListener('resize', Confetti.resize);
  Confetti.resize();


  // --- APP STATE & LOGIC ---
  let state = {
    currentNoun: null,
    score: 0,
    totalAttempts: 0,
    streak: 0,
    result: null, // 'correct' | 'incorrect' | null
    currentQuote: QUOTES[0],
    selectedDeclension: null,
    currentSetId: 'dickinson'
  };

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
    quoteEnglish: document.getElementById('quote-english'),
    gameCard: document.getElementById('game-card'),
    flashOverlay: document.getElementById('flash-overlay'),
    vocabSelect: document.getElementById('vocab-select')
  };

  // Noun Selection Logic
  const getRandomNoun = () => {
    const list = nounSets[state.currentSetId] || nounSets['dickinson'];
    if (!list || list.length === 0) return null;

    let nextNoun;
    // Attempt to find a noun that is different from the current one
    // Loop max 10 times to prevent infinite loops if list has 1 item
    let attempts = 0;
    do {
      nextNoun = list[Math.floor(Math.random() * list.length)];
      attempts++;
    } while (state.currentNoun && nextNoun.id === state.currentNoun.id && list.length > 1 && attempts < 10);
    
    return nextNoun;
  };

  const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

  function init() {
    // Read selector value
    state.currentSetId = els.vocabSelect.value;
    
    state.currentNoun = getRandomNoun();
    state.currentQuote = getRandomQuote();
    render();

    els.btn1.addEventListener('click', () => handleGuess(1));
    els.btn2.addEventListener('click', () => handleGuess(2));
    els.btn3.addEventListener('click', () => handleGuess(3));
    els.nextBtn.addEventListener('click', handleNext);
    
    els.vocabSelect.addEventListener('change', (e) => {
      state.currentSetId = e.target.value;
      handleNext(); // Skip to next word in new set
      // Optional: Reset score on set change? 
      // state.score = 0; state.totalAttempts = 0; state.streak = 0;
      // For now, we keep the score running.
    });
  }

  function handleGuess(declension) {
    if (state.result !== null) return;
    
    // Resume AudioContext on first interaction if needed
    if (audioCtx.state === 'suspended') audioCtx.resume();

    state.selectedDeclension = declension;
    state.totalAttempts++;

    if (declension === state.currentNoun.declension) {
      // CORRECT
      state.score++;
      state.streak++;
      state.result = 'correct';
      
      Sound.playCorrect();

      // Celebration Logic
      if (state.streak > 0 && state.streak % 5 === 0) {
        const intensity = Math.floor(state.streak / 5);
        Sound.playCelebration(intensity);
        Confetti.create(50 * intensity); // More confetti for higher streaks
      }
    } else {
      // INCORRECT
      state.streak = 0;
      state.result = 'incorrect';
      
      Sound.playWrong();
      triggerWrongEffects();
    }

    render();
  }

  function triggerWrongEffects() {
    // Shake Card
    els.gameCard.classList.remove('shake');
    void els.gameCard.offsetWidth; // Force reflow
    els.gameCard.classList.add('shake');

    // Red Flash
    els.flashOverlay.classList.add('active');
    setTimeout(() => {
      els.flashOverlay.classList.remove('active');
    }, 200);
  }

  function handleNext() {
    state.currentNoun = getRandomNoun();
    state.currentQuote = getRandomQuote();
    state.result = null;
    state.selectedDeclension = null;
    
    // Remove shake class if present so it can be re-triggered
    els.gameCard.classList.remove('shake');
    
    render();
  }

  function render() {
    if (!state.currentNoun) return;

    els.score.textContent = `${state.score} / ${state.totalAttempts}`;
    els.streak.textContent = state.streak;
    
    els.nounNominative.textContent = state.currentNoun.nominative + ',';
    els.nounGenitive.textContent = state.currentNoun.genitive + ',';
    els.nounGender.textContent = state.currentNoun.gender + '.';
    els.nounDefinition.textContent = `"${state.currentNoun.definition}"`;

    [1, 2, 3].forEach(d => {
      const btn = els[`btn${d}`];
      btn.className = "btn-base"; 

      if (state.result === null) {
        btn.disabled = false;
      } else {
        btn.disabled = true;
        if (d === state.currentNoun.declension) {
          btn.classList.add('btn-correct');
        } else if (d === state.selectedDeclension) {
          btn.classList.add('btn-wrong');
        } else {
          btn.classList.add('btn-dimmed');
        }
      }
    });

    if (state.result) {
      els.feedbackArea.classList.add('visible');
      els.feedbackText.classList.remove('feedback-correct', 'feedback-incorrect');

      if (state.result === 'correct') {
        els.feedbackText.classList.add('feedback-correct');
        // Dynamic praise based on streak
        if (state.streak % 5 === 0) {
            els.feedbackText.textContent = `Euge! ${state.streak} in a row!`;
        } else {
            els.feedbackText.textContent = "Optime! (Correct)";
        }
      } else {
        els.feedbackText.classList.add('feedback-incorrect');
        const correctDecl = state.currentNoun.declension;
        const ordinal = correctDecl === 1 ? '1st' : correctDecl === 2 ? '2nd' : '3rd';
        els.feedbackText.textContent = `Eheu! It was ${ordinal} Declension.`;
      }
    } else {
      els.feedbackArea.classList.remove('visible');
    }

    els.quoteLatin.textContent = `"${state.currentQuote.latin}"`;
    els.quoteEnglish.textContent = `(${state.currentQuote.english})`;
  }

  init();
});