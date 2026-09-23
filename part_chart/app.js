let currentVerbIndex = -1;
let streak = 0;
let audioCtx;
let hintsEnabled = true;
let verbCompleted = false;

document.addEventListener('DOMContentLoaded', () => {
    loadRandomVerb();
    document.getElementById('next-verb-btn').addEventListener('click', loadRandomVerb);
    document.getElementById('check-answers-btn').addEventListener('click', checkAnswers);
});

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(isCorrect) {
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (isCorrect) {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    } else {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime); 
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.4);
    }
}

function loadRandomVerb() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * latinVocab.length);
    } while (newIndex === currentVerbIndex && latinVocab.length > 1);
    
    currentVerbIndex = newIndex;
    verbCompleted = false;
    const verb = latinVocab[currentVerbIndex];
    
    document.getElementById('principal-parts').textContent = verb.principalParts;
    document.getElementById('verb-meaning').textContent = verb.meaning;
    
    document.getElementById('next-verb-btn').classList.add('hidden');
    
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
        input.disabled = false;
        
        if (hintsEnabled) {
            input.placeholder = input.getAttribute('data-hint');
        } else {
            input.placeholder = '';
        }
    });
}

function stripMacrons(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function cleanString(str) {
    return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

function validateInput(userVal, expectedAnswers) {
    const hasMacrons = /[āēīōū]/i.test(userVal);
    for (let expected of expectedAnswers) {
        if (expected === "") continue;
        let target = cleanString(expected);
        
        if (!hasMacrons) {
            target = stripMacrons(target);
        }
        
        if (userVal === target) {
            return true;
        }
    }
    return false;
}

function checkAnswers() {
    if (verbCompleted) return; 

    document.getElementById('next-verb-btn').classList.remove('hidden');

    const inputs = document.querySelectorAll('input[type="text"]');
    let allCorrect = true;
    let anyIncorrect = false;

    inputs.forEach(inputField => {
        let userVal = cleanString(inputField.value);
        const formType = inputField.getAttribute('data-form');
        const verb = latinVocab[currentVerbIndex];
        const expectedAnswers = verb[formType];
        
        if (formType === 'futPassInf' && userVal === "") {
            inputField.classList.remove('incorrect', 'correct');
            return; 
        }

        if (userVal === "") {
            inputField.classList.add('incorrect');
            allCorrect = false;
            anyIncorrect = true;
            return;
        }

        let isCorrect = validateInput(userVal, expectedAnswers);
        markInput(inputField, isCorrect);
        
        if (!isCorrect) {
            allCorrect = false;
            anyIncorrect = true;
        }
    });

    if (allCorrect) {
        playTone(true);
        updateStreak(true);
        verbCompleted = true;
        hintsEnabled = false; 
        inputs.forEach(input => input.disabled = true);
    } else if (anyIncorrect) {
        playTone(false);
        updateStreak(false);
    }
}

function markInput(inputField, isCorrect) {
    if (isCorrect) {
        inputField.classList.remove('incorrect');
        inputField.classList.add('correct');
    } else {
        inputField.classList.remove('correct');
        inputField.classList.add('incorrect');
    }
}

function updateStreak(isCorrect) {
    if (isCorrect) {
        streak++;
    } else {
        streak = 0;
    }
    document.getElementById('streak-counter').textContent = streak;
}