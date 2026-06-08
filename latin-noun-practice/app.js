// ===== App State =====
var CASES = ['nom', 'gen', 'dat', 'acc', 'abl'];
var CASE_LABELS = { nom: 'Nominative', gen: 'Genitive', dat: 'Dative', acc: 'Accusative', abl: 'Ablative' };

var state = {
  currentWord: vocabulary[0],
  includeDative: false,
  ignoreMacrons: true,
  soundEnabled: true,
  streak: 0,
  totalAttempts: 0,
  correctAttempts: 0,
  hasErrorsOnCurrentWord: false,
  isCompleted: false,
  declensionIdentified: false,
  wrongDeclensions: [],
  consecutiveDeclensionMistakes: 0,
  showTutorial: false
};

// ===== DOM References =====
var els = {};

// ===== Helpers =====
function getExpectedDeclension(noun) {
  var ending = noun.genSgEnding.toLowerCase();
  if (ending.endsWith('ae')) return 1;
  if (ending.endsWith('ī') || ending.endsWith('i')) return 2;
  if (ending.endsWith('is')) return 3;
  if (ending.endsWith('ūs') || ending.endsWith('us')) return 4;
  if (ending.endsWith('eī') || ending.endsWith('ei')) return 5;
  return 3;
}

function normalizeLatin(text) {
  var normalized = text.trim().toLowerCase();
  if (state.ignoreMacrons) {
    normalized = normalized
      .replace(/[āáà]/g, 'a')
      .replace(/[ēéè]/g, 'e')
      .replace(/[īíì]/g, 'i')
      .replace(/[ōóò]/g, 'o')
      .replace(/[ūúù]/g, 'u')
      .replace(/[ȳýỳ]/g, 'y');
  }
  return normalized;
}

function isCorrectForm(input, correctForms) {
  var normInput = normalizeLatin(input);
  return correctForms.some(function(form) {
    return normalizeLatin(form) === normInput;
  });
}

function getInput(num, cas) {
  return document.querySelector('.grid-input[data-num="' + num + '"][data-case="' + cas + '"]');
}

function ordinalSuffix(n) {
  return n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
}

// ===== Build the Input Grid =====
function buildGrid() {
  var grid = els.inputGrid;
  grid.innerHTML = '';

  // Header row
  var emptyHeader = document.createElement('div');
  grid.appendChild(emptyHeader);

  var sgHeader = document.createElement('div');
  sgHeader.className = 'grid-header';
  sgHeader.textContent = 'Singular';
  grid.appendChild(sgHeader);

  var plHeader = document.createElement('div');
  plHeader.className = 'grid-header';
  plHeader.textContent = 'Plural';
  grid.appendChild(plHeader);

  // Input rows
  CASES.forEach(function(cas) {
    var isDative = cas === 'dat';

    var label = document.createElement('div');
    label.className = 'case-label' + (isDative ? ' optional dative-row' : '');
    label.textContent = CASE_LABELS[cas] + (isDative ? '*' : '');
    grid.appendChild(label);

    ['sg', 'pl'].forEach(function(num) {
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'grid-input latin-text' + (isDative ? ' dative-row' : '');
      input.dataset.num = num;
      input.dataset.case = cas;
      input.autocapitalize = 'off';
      input.autocomplete = 'off';
      input.autocorrect = 'off';
      input.spellcheck = false;
      input.addEventListener('input', function() { onInputChange(num, cas); });
      grid.appendChild(input);
    });
  });
}

// ===== Build Declension Buttons =====
function buildDeclensionButtons() {
  var container = els.selectorButtons;
  container.innerHTML = '';
  [1, 2, 3].forEach(function(decl) {
    var btn = document.createElement('button');
    btn.className = 'decl-btn';
    btn.textContent = decl + ordinalSuffix(decl);
    btn.dataset.decl = decl;
    btn.addEventListener('click', function() { handleDeclensionSelect(decl); });
    container.appendChild(btn);
  });
}

// ===== Event Handlers =====
function onInputChange(num, cas) {
  var input = getInput(num, cas);
  if (!input) return;
  // Clear result styling if present
  input.classList.remove('correct', 'incorrect', 'completed');
}

function handleDeclensionSelect(decl) {
  if (state.declensionIdentified || state.isCompleted) return;
  var expected = getExpectedDeclension(state.currentWord);

  if (decl === expected) {
    state.declensionIdentified = true;
    playCorrectSound(state.soundEnabled);
    state.consecutiveDeclensionMistakes = 0;
    state.showTutorial = false;
    render();
    setTimeout(function() {
      var first = getInput('sg', 'nom');
      if (first) first.focus();
    }, 50);
  } else {
    playErrorSound(state.soundEnabled);
    state.wrongDeclensions.push(decl);
    state.consecutiveDeclensionMistakes++;
    if (state.consecutiveDeclensionMistakes >= 3) {
      state.showTutorial = true;
    }
    render();
  }
}

function handleCheck() {
  if (!state.declensionIdentified) return;
  var allCorrect = true;
  var anyMistake = false;

  ['sg', 'pl'].forEach(function(num) {
    CASES.forEach(function(cas) {
      if (!state.includeDative && cas === 'dat') return;
      var input = getInput(num, cas);
      if (!input) return;
      var userInput = input.value;
      var correctForms = state.currentWord.forms[num][cas];
      var correct = isCorrectForm(userInput, correctForms);

      input.classList.remove('correct', 'incorrect', 'completed');
      if (correct) {
        input.classList.add('correct');
      } else {
        input.classList.add('incorrect');
        allCorrect = false;
        anyMistake = true;
      }
    });
  });

  if (allCorrect) {
    if (!state.isCompleted) {
      state.totalAttempts++;
      if (!state.hasErrorsOnCurrentWord && !anyMistake) {
        state.correctAttempts++;
      }
    }
    state.isCompleted = true;

    // Mark all as completed
    document.querySelectorAll('.grid-input').forEach(function(input) {
      if (!input.classList.contains('incorrect')) input.classList.add('completed');
      input.disabled = true;
    });

    if (!state.hasErrorsOnCurrentWord && !anyMistake) {
      state.streak++;
      if (state.streak % 5 === 0 && state.streak > 0) {
        playStreakSound(state.soundEnabled, state.streak);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#10b981', '#f59e0b'] });
      } else {
        playCorrectSound(state.soundEnabled);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      }
    } else {
      state.streak = 0;
      playCorrectSound(state.soundEnabled);
    }
    render();
  } else {
    if (anyMistake) {
      state.hasErrorsOnCurrentWord = true;
      playErrorSound(state.soundEnabled);
    }
  }
}

function nextWord() {
  var next = vocabulary[Math.floor(Math.random() * vocabulary.length)];
  while (next.id === state.currentWord.id && vocabulary.length > 1) {
    next = vocabulary[Math.floor(Math.random() * vocabulary.length)];
  }

  state.currentWord = next;
  state.isCompleted = false;
  state.hasErrorsOnCurrentWord = false;
  state.wrongDeclensions = [];
  state.consecutiveDeclensionMistakes = 0;
  state.showTutorial = false;

  var expected = getExpectedDeclension(next);
  state.declensionIdentified = expected > 3;

  // Clear all inputs
  document.querySelectorAll('.grid-input').forEach(function(input) {
    input.value = '';
    input.disabled = false;
    input.classList.remove('correct', 'incorrect', 'completed');
  });

  render();
  setTimeout(function() {
    var first = getInput('sg', 'nom');
    if (first) first.focus();
  }, 50);
}

// ===== Toggle Handlers =====
function setupToggles() {
  var macronToggle = document.getElementById('macron-toggle');
  var dativeToggle = document.getElementById('dative-toggle');
  var soundToggle = document.getElementById('sound-toggle');

  macronToggle.addEventListener('change', function() {
    state.ignoreMacrons = this.checked;
    document.getElementById('macron-track').classList.toggle('checked', this.checked);
  });

  dativeToggle.addEventListener('change', function() {
    state.includeDative = this.checked;
    document.getElementById('dative-track').classList.toggle('checked', this.checked);
    els.inputGrid.classList.toggle('hide-dative', !this.checked);
  });

  soundToggle.addEventListener('change', function() {
    state.soundEnabled = this.checked;
    document.getElementById('sound-track').classList.toggle('checked', this.checked);
    document.getElementById('sound-icon').textContent = this.checked ? '🔊' : '🔇';
  });

  // Set initial states
  document.getElementById('macron-track').classList.toggle('checked', state.ignoreMacrons);
  document.getElementById('sound-track').classList.toggle('checked', state.soundEnabled);
  els.inputGrid.classList.toggle('hide-dative', !state.includeDative);
}

// ===== Render =====
function render() {
  var word = state.currentWord;
  var expected = getExpectedDeclension(word);

  // Word display
  els.wordDisplay.innerHTML = '';
  var latin = document.createElement('span');
  latin.className = 'word-latin';
  latin.textContent = word.nomSg + ', ' + word.genSgEnding + ', ' + word.gender;
  els.wordDisplay.appendChild(latin);

  var divider = document.createElement('span');
  divider.className = 'word-divider';
  divider.textContent = '—';
  els.wordDisplay.appendChild(divider);

  var translation = document.createElement('span');
  translation.className = 'word-translation';
  translation.textContent = word.translation;
  els.wordDisplay.appendChild(translation);

  // Declension selector
  if (expected <= 3) {
    els.declSelector.classList.remove('hidden');
    var buttons = els.selectorButtons.querySelectorAll('.decl-btn');
    buttons.forEach(function(btn) {
      var decl = parseInt(btn.dataset.decl, 10);
      btn.classList.remove('correct', 'wrong');
      btn.disabled = false;
      if (state.declensionIdentified && decl === expected) {
        btn.classList.add('correct');
      } else if (state.wrongDeclensions.indexOf(decl) !== -1) {
        btn.classList.add('wrong');
        btn.disabled = true;
      }
      if (state.declensionIdentified) btn.disabled = true;
    });
  } else {
    els.declSelector.classList.add('hidden');
  }

  // Tutorial
  els.tutorial.classList.toggle('visible', state.showTutorial && expected <= 3);

  // Grid disabled state
  els.inputGrid.classList.toggle('disabled', !state.declensionIdentified);

  // Disable inputs when completed
  if (state.isCompleted) {
    document.querySelectorAll('.grid-input').forEach(function(input) {
      input.disabled = true;
    });
  }

  // Buttons
  if (state.isCompleted) {
    els.checkBtn.style.display = 'none';
    els.skipBtn.style.display = 'none';
    els.nextBtn.style.display = 'flex';
  } else {
    els.checkBtn.style.display = 'flex';
    els.checkBtn.disabled = !state.declensionIdentified;
    els.skipBtn.style.display = 'flex';
    els.nextBtn.style.display = 'none';
  }

  // Stats
  var accuracy = state.totalAttempts === 0 ? 100 : Math.round((state.correctAttempts / state.totalAttempts) * 100);
  els.accuracyValue.textContent = accuracy + '%';
  els.streakValue.textContent = state.streak;
}

// ===== Keyboard Handler =====
function handleKeyDown(e) {
  if (e.key === 'Enter') {
    if (state.isCompleted) {
      nextWord();
    } else if (state.declensionIdentified) {
      handleCheck();
    }
  }
}

// ===== Init =====
function init() {
  els.wordDisplay = document.getElementById('word-display');
  els.declSelector = document.getElementById('declension-selector');
  els.selectorButtons = document.getElementById('selector-buttons');
  els.tutorial = document.getElementById('tutorial');
  els.inputGrid = document.getElementById('input-grid');
  els.checkBtn = document.getElementById('check-btn');
  els.nextBtn = document.getElementById('next-btn');
  els.skipBtn = document.getElementById('skip-btn');
  els.accuracyValue = document.getElementById('accuracy-value');
  els.streakValue = document.getElementById('streak-value');

  buildGrid();
  buildDeclensionButtons();
  setupToggles();

  els.checkBtn.addEventListener('click', handleCheck);
  els.nextBtn.addEventListener('click', nextWord);
  els.skipBtn.addEventListener('click', nextWord);
  document.addEventListener('keydown', handleKeyDown);

  // Set initial declension state
  var expected = getExpectedDeclension(state.currentWord);
  state.declensionIdentified = expected > 3;

  render();

  setTimeout(function() {
    var first = getInput('sg', 'nom');
    if (first) first.focus();
  }, 100);
}

document.addEventListener('DOMContentLoaded', init);
