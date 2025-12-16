// --- State Management ---
const state = {
    currentVerb: null,
    selected: null,
    isCorrect: null,
    stats: {
        correct: 0,
        total: 0,
        streak: 0
    },
    showMacrons: true,
    view: 'drill' // 'drill' or 'help'
};

// --- Audio Service (Web Audio API) ---
let audioCtx = null;

const getAudioCtx = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
};

const playTone = (ctx, freq, type, startTime, duration, vol = 0.1) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
};

const playSound = (type, intensity = 1) => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;

    if (type === 'correct') {
        playTone(ctx, 523.25, 'sine', now, 0.3, 0.2); // C5
        playTone(ctx, 1046.50, 'sine', now + 0.05, 0.4, 0.1); // C6
    } 
    else if (type === 'incorrect') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3); 
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    } 
    else if (type === 'streak') {
        const speed = 0.08;
        playTone(ctx, 523.25, 'triangle', now, 0.4, 0.2);
        playTone(ctx, 659.25, 'triangle', now + speed, 0.4, 0.2);
        playTone(ctx, 783.99, 'triangle', now + speed * 2, 0.4, 0.2);
        playTone(ctx, 1046.50, 'triangle', now + speed * 3, 0.8, 0.3);
    }
};

// --- UI Rendering ---

// Cache main containers once DOM is ready
let appContainer;
let templateDrill;
let templateHelp;
let feedbackOverlay;
let confettiContainer;

function renderDrill() {
    if (!appContainer || !templateDrill) return;
    
    appContainer.innerHTML = '';
    const clone = templateDrill.content.cloneNode(true);
    appContainer.appendChild(clone);
    updateDrillUI();
}

function renderHelp() {
    if (!appContainer || !templateHelp) return;

    appContainer.innerHTML = '';
    const clone = templateHelp.content.cloneNode(true);
    appContainer.appendChild(clone);
    
    document.getElementById('btn-back').addEventListener('click', () => {
        state.view = 'drill';
        renderDrill();
    });
}

function formatText(text) {
    if (state.showMacrons) return text;
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function updateDrillUI() {
    if (state.view !== 'drill') return;

    const verb = state.currentVerb;
    if (!verb) return;

    // Ensure elements exist in DOM before trying to update them
    const verbPartsEl = document.getElementById('verb-parts');
    if (!verbPartsEl) return; // UI not rendered yet

    // Update Text
    verbPartsEl.textContent = verb.principalParts.map(formatText).join(', ');
    document.getElementById('verb-definition').textContent = verb.definition;

    // Etymology logic
    const etymologyContainer = document.getElementById('etymology-container');
    const etymologyContent = document.getElementById('etymology-content');
    const toggleEtymologyBtn = document.getElementById('btn-toggle-etymology');
    
    if (verb.etymology) {
        etymologyContainer.classList.remove('hidden');
        toggleEtymologyBtn.textContent = 'Show Etymology';
        etymologyContent.classList.add('hidden');
        etymologyContent.textContent = verb.etymology;
        
        // Remove old listener to prevent duplicates if re-rendering
        const newBtn = toggleEtymologyBtn.cloneNode(true);
        toggleEtymologyBtn.parentNode.replaceChild(newBtn, toggleEtymologyBtn);
        
        newBtn.addEventListener('click', () => {
            const isHidden = etymologyContent.classList.contains('hidden');
            if (isHidden) {
                etymologyContent.classList.remove('hidden');
                newBtn.textContent = 'Hide Etymology';
            } else {
                etymologyContent.classList.add('hidden');
                newBtn.textContent = 'Show Etymology';
            }
        });
    } else {
        etymologyContainer.classList.add('hidden');
    }

    // Feedback
    const feedbackEl = document.getElementById('feedback-message');
    feedbackEl.className = 'feedback-box hidden'; // reset
    if (state.selected !== null) {
        feedbackEl.classList.remove('hidden');
        if (state.isCorrect) {
            feedbackEl.classList.add('feedback-correct');
            feedbackEl.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Optime! (Correct)`;
        } else {
            feedbackEl.classList.add('feedback-incorrect');
            feedbackEl.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Eheu! It is ${verb.conjugation} conjugation.`;
        }
    }

    // Buttons
    const optionsGrid = document.getElementById('options-grid');
    optionsGrid.innerHTML = '';
    
    // Access globals safely
    const conjugations = window.CONJUGATIONS_LIST || [];
    
    conjugations.forEach((conj, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span class="shortcut-hint">${index + 1}</span>
            ${conj}
        `;
        
        if (state.selected !== null) {
            btn.disabled = true;
            if (conj === verb.conjugation) {
                btn.classList.add('selected-correct');
            } else if (state.selected === conj && !state.isCorrect) {
                btn.classList.add('selected-incorrect');
            } else {
                btn.classList.add('dimmed');
            }
        }
        
        btn.addEventListener('click', () => handleSelection(conj));
        optionsGrid.appendChild(btn);
    });

    // Action Area (Next button)
    const actionArea = document.getElementById('action-area');
    if (state.selected !== null) {
        actionArea.classList.remove('hidden');
        document.getElementById('btn-next').onclick = nextVerb;
        
        // AI Logic
        const aiResult = document.getElementById('ai-result');
        aiResult.innerHTML = '';
        aiResult.classList.add('hidden');
        
        document.getElementById('btn-ai-insight').onclick = async () => {
            const btn = document.getElementById('btn-ai-insight');
            btn.disabled = true;
            btn.innerHTML = 'Consulting the Oracle...';
            
            const insight = await getAIInsight(verb);
            
            aiResult.textContent = insight;
            aiResult.classList.remove('hidden');
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c0-5.523 4.477-10 10-10z"/></svg> Ask AI for a mnemonic`;
            btn.disabled = false;
        };
    } else {
        actionArea.classList.add('hidden');
    }
}

// --- Logic ---

function nextVerb() {
    // Clear effects
    feedbackOverlay.classList.add('hidden');
    feedbackOverlay.innerHTML = '';
    confettiContainer.innerHTML = '';
    document.body.classList.remove('animate-shake');

    const allVerbs = window.VERBS || [];
    if (allVerbs.length === 0) {
        console.error("No verbs found!");
        return;
    }

    let next;
    do {
        next = allVerbs[Math.floor(Math.random() * allVerbs.length)];
    } while (allVerbs.length > 1 && next === state.currentVerb);

    state.currentVerb = next;
    state.selected = null;
    state.isCorrect = null;
    
    updateDrillUI();
}

function initGame() {
    const allVerbs = window.VERBS || [];
    if (allVerbs.length === 0) return;

    // Pick first verb silently to setup state
    const next = allVerbs[Math.floor(Math.random() * allVerbs.length)];
    state.currentVerb = next;
    state.selected = null;
    state.isCorrect = null;

    // Render drill view which will read state and update UI safely
    renderDrill();
}

function handleSelection(conjugation) {
    if (state.selected !== null) return;
    
    state.selected = conjugation;
    const isCorrect = conjugation === state.currentVerb.conjugation;
    state.isCorrect = isCorrect;
    
    // Stats update
    state.stats.total++;
    if (isCorrect) {
        state.stats.correct++;
        state.stats.streak++;
        
        // Streak Effect
        if (state.stats.streak > 0 && state.stats.streak % 5 === 0) {
            playSound('streak', state.stats.streak / 5);
            triggerConfetti(state.stats.streak);
        } else {
            playSound('correct');
        }
    } else {
        state.stats.streak = 0;
        playSound('incorrect');
        triggerShake();
    }
    
    updateHeaderStats();
    updateDrillUI();
}

function updateHeaderStats() {
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.textContent = state.stats.streak;
}

function triggerShake() {
    document.body.classList.add('animate-shake');
    // Flash red
    feedbackOverlay.classList.remove('hidden');
    setTimeout(() => {
        document.body.classList.remove('animate-shake');
        feedbackOverlay.classList.add('hidden');
    }, 500);
}

function triggerConfetti(streak) {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    confettiContainer.appendChild(canvas);
    
    const overlayText = document.createElement('div');
    overlayText.className = 'streak-overlay-text';
    overlayText.innerHTML = `
        <div class="streak-big-num">${streak}</div>
        <div class="streak-msg">in a Row!</div>
    `;
    confettiContainer.appendChild(overlayText);
    
    // Canvas setup
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#C5A059', '#8B0000', '#F5F5F0', '#FFD700', '#FFFFFF'];
    const count = 50 + (streak * 2);

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 5;
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            life: 1,
            decay: Math.random() * 0.02 + 0.005,
            rotation: Math.random() * 360
        });
    }

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = 0;
        
        particles.forEach(p => {
            if (p.life > 0) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5;
                p.vx *= 0.96;
                p.life -= p.decay;
                p.rotation += 10;
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                ctx.restore();
                
                active++;
            }
        });
        
        if (active > 0) {
            requestAnimationFrame(animate);
        } else {
            confettiContainer.innerHTML = ''; // Cleanup
        }
    }
    
    animate();
}

// --- AI Service ---
async function getAIInsight(verb) {
    let apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        apiKey = prompt("To use the AI tutor, please enter a valid Google Gemini API Key (it will be saved locally):");
        if (apiKey) localStorage.setItem('gemini_api_key', apiKey);
        else return "API Key required for AI features.";
    }

    try {
        const promptText = `Provide a very brief (max 2 sentences) interesting etymological fact or a mnemonic device to help a student remember the conjugation or meaning of the Latin verb: ${verb.principalParts.join(', ')} (${verb.definition}).`;
        
        // Direct REST call to avoid SDK issues in pure static environment without modules
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            console.error(data.error);
            if (data.error.code === 400 || data.error.code === 403) {
                 localStorage.removeItem('gemini_api_key'); // Invalid key
                 return "Invalid API Key. Please try again.";
            }
            return "Error contacting the Oracle.";
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No insight returned.";

    } catch (e) {
        console.error(e);
        return "The Oracle is silent (Network Error).";
    }
}

// --- Initialization ---

window.addEventListener('DOMContentLoaded', () => {
    // Select elements after DOM is ready
    appContainer = document.getElementById('app-container');
    templateDrill = document.getElementById('template-drill');
    templateHelp = document.getElementById('template-help');
    feedbackOverlay = document.getElementById('feedback-overlay');
    confettiContainer = document.getElementById('confetti-container');

    // Button Listeners
    const btnHelp = document.getElementById('btn-help');
    if (btnHelp) {
        btnHelp.addEventListener('click', () => {
            state.view = 'help';
            renderHelp();
        });
    }

    const btnMacrons = document.getElementById('btn-macrons');
    if (btnMacrons) {
        btnMacrons.addEventListener('click', () => {
            state.showMacrons = !state.showMacrons;
            const statusEl = document.getElementById('macron-status');
            if (statusEl) {
                statusEl.textContent = state.showMacrons ? 'ON' : 'OFF';
                statusEl.className = state.showMacrons ? 'status-on' : 'status-off';
            }
            updateDrillUI(); // Re-render text
        });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        if (state.view !== 'drill') return;
        const key = e.key.toLowerCase();
        
        if (state.selected === null) {
            switch(key) {
                case '1': handleSelection('1st'); break;
                case '2': handleSelection('2nd'); break;
                case '3': handleSelection('3rd'); break;
                case '4': handleSelection('3rd -io'); break;
                case '5': handleSelection('4th'); break;
            }
        } else {
            if (key === 'n' || key === 'enter') {
                nextVerb();
            }
        }
    });

    // Start
    initGame();
});