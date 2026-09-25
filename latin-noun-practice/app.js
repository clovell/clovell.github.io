// ===== App State =====
var CASES = ['nom', 'gen', 'dat', 'acc', 'abl'];
var CASE_LABELS = { nom: 'Nominative', gen: 'Genitive', dat: 'Dative', acc: 'Accusative', abl: 'Ablative' };
var GENDERS = ['m', 'f', 'n'];
var GENDER_LABELS = { m: 'Masc.', f: 'Fem.', n: 'Neut.' };

var state = {
  mode: 'noun', // 'noun' | 'adjective' | 'pair' | 'endings'
  currentWord: null,
  includeDative: false,
  includeIStems: false,
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
  showTutorial: false,
  endingsDeclension: 1, // 1 | 2 | 3
  endingsGender: 'f'    // 'm' | 'f' | 'n'
};

// ===== DOM References =====
var els = {};

// ===== Vocabulary Data =====
var nounVocabulary = [];
var adjectiveVocabulary = [];
var vocabulary = [];

async function loadVocabulary() {
  try {
    var response = await fetch('vocabulary.txt');
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    var text = await response.text();
    var parsed = LatinDeclension.parseVocabularyText(text);
    nounVocabulary = parsed.nouns;
    adjectiveVocabulary = parsed.adjectives;
    vocabulary = nounVocabulary;
  } catch (err) {
    console.warn('Could not load vocabulary.txt via fetch (possibly running via file://). Using default vocabulary.', err);
    var fallback = LatinDeclension.parseVocabularyText(LatinDeclension.DEFAULT_VOCAB_TEXT);
    nounVocabulary = fallback.nouns;
    adjectiveVocabulary = fallback.adjectives;
    vocabulary = nounVocabulary;
  }
}

// ===== Helpers =====
function getActiveNouns() {
  var list = nounVocabulary.filter(function(w) {
    if (!state.includeIStems && w.isIStem) return false;
    return true;
  });
  return list.length > 0 ? list : nounVocabulary;
}

function getActiveAdjectives() {
  var list = adjectiveVocabulary.filter(function(a) {
    if (!state.includeIStems && a.declensionClass === '3rd') return false;
    return true;
  });
  return list.length > 0 ? list : adjectiveVocabulary;
}

function getRandomItem(arr, currentId) {
  if (!arr || arr.length === 0) return null;
  if (arr.length === 1) return arr[0];
  var next = arr[Math.floor(Math.random() * arr.length)];
  while (currentId && next.id === currentId && arr.length > 1) {
    next = arr[Math.floor(Math.random() * arr.length)];
  }
  return next;
}

function normalizeLatin(text) {
  var normalized = (text || '').trim().toLowerCase();
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
  if (!correctForms || !Array.isArray(correctForms)) return false;
  var normInput = normalizeLatin(input);
  return correctForms.some(function(form) {
    return normalizeLatin(form) === normInput;
  });
}

function ordinalSuffix(n) {
  return n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
}

// ===== Grid Building =====
function buildGrid() {
  var container = els.inputGrid;
  container.innerHTML = '';
  var numCases = CASES.length;

  if (state.mode === 'noun' || state.mode === 'endings') {
    container.className = 'input-grid' + (!state.includeDative ? ' hide-dative' : '');

    // Header row
    var emptyHeader = document.createElement('div');
    container.appendChild(emptyHeader);

    ['Singular', 'Plural'].forEach(function(title) {
      var header = document.createElement('div');
      header.className = 'grid-header';
      header.textContent = title;
      container.appendChild(header);
    });

    CASES.forEach(function(cas, caseIdx) {
      var isDative = cas === 'dat';
      var label = document.createElement('div');
      label.className = 'case-label' + (isDative ? ' optional dative-row' : '');
      label.textContent = CASE_LABELS[cas] + (isDative ? '*' : '');
      container.appendChild(label);

      ['sg', 'pl'].forEach(function(num, numIdx) {
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'grid-input latin-text' + (isDative ? ' dative-row' : '');
        input.dataset.num = num;
        input.dataset.case = cas;
        input.tabIndex = numIdx * numCases + caseIdx + 1;
        input.disabled = !state.declensionIdentified;
        input.autocapitalize = 'off';
        input.autocomplete = 'off';
        input.autocorrect = 'off';
        input.spellcheck = false;
        if (state.mode === 'endings' && state.endingsDeclension === 3) {
          if (num === 'sg' && (cas === 'nom' || (state.endingsGender === 'n' && cas === 'acc'))) {
            input.placeholder = '—';
          }
        }
        input.addEventListener('input', function() { input.classList.remove('correct', 'incorrect', 'completed'); });
        container.appendChild(input);
      });
    });
  } else if (state.mode === 'adjective') {
    container.className = 'adj-container' + (!state.includeDative ? ' hide-dative' : '');

    var tabCounter = 1;
    ['sg', 'pl'].forEach(function(num) {
      var card = document.createElement('div');
      card.className = 'adj-card';

      var title = document.createElement('h3');
      title.className = 'adj-card-title';
      title.textContent = num === 'sg' ? 'Singular' : 'Plural';
      card.appendChild(title);

      var subgrid = document.createElement('div');
      subgrid.className = 'adj-subgrid';

      // Header row
      var emptyHeader = document.createElement('div');
      subgrid.appendChild(emptyHeader);

      GENDERS.forEach(function(gen) {
        var header = document.createElement('div');
        header.className = 'grid-header';
        header.textContent = GENDER_LABELS[gen];
        subgrid.appendChild(header);
      });

      CASES.forEach(function(cas) {
        var isDative = cas === 'dat';
        var label = document.createElement('div');
        label.className = 'case-label' + (isDative ? ' optional dative-row' : '');
        label.textContent = CASE_LABELS[cas] + (isDative ? '*' : '');
        subgrid.appendChild(label);

        GENDERS.forEach(function(gen) {
          var input = document.createElement('input');
          input.type = 'text';
          input.className = 'grid-input latin-text' + (isDative ? ' dative-row' : '');
          input.dataset.num = num;
          input.dataset.case = cas;
          input.dataset.gen = gen;
          input.tabIndex = tabCounter++;
          input.disabled = !state.declensionIdentified;
          input.autocapitalize = 'off';
          input.autocomplete = 'off';
          input.autocorrect = 'off';
          input.spellcheck = false;
          input.addEventListener('input', function() { input.classList.remove('correct', 'incorrect', 'completed'); });
          subgrid.appendChild(input);
        });
      });

      card.appendChild(subgrid);
      container.appendChild(card);
    });
  } else if (state.mode === 'pair') {
    container.className = 'input-grid mode-pair' + (!state.includeDative ? ' hide-dative' : '');

    // Row 1: Superheaders
    var emptyHeader1 = document.createElement('div');
    container.appendChild(emptyHeader1);

    var sgSuper = document.createElement('div');
    sgSuper.className = 'grid-superheader span-2';
    sgSuper.textContent = 'Singular';
    container.appendChild(sgSuper);

    var plSuper = document.createElement('div');
    plSuper.className = 'grid-superheader span-2';
    plSuper.textContent = 'Plural';
    container.appendChild(plSuper);

    // Row 2: Subheaders (Noun / Adj)
    var emptyHeader2 = document.createElement('div');
    container.appendChild(emptyHeader2);

    ['Noun', 'Adjective', 'Noun', 'Adjective'].forEach(function(sub) {
      var header = document.createElement('div');
      header.className = 'grid-subheader';
      header.textContent = sub;
      container.appendChild(header);
    });

    var tabIdx = 1;
    CASES.forEach(function(cas) {
      var isDative = cas === 'dat';
      var label = document.createElement('div');
      label.className = 'case-label' + (isDative ? ' optional dative-row' : '');
      label.textContent = CASE_LABELS[cas] + (isDative ? '*' : '');
      container.appendChild(label);

      // Sg Noun, Sg Adj, Pl Noun, Pl Adj
      var cols = [
        { num: 'sg', role: 'noun' },
        { num: 'sg', role: 'adj' },
        { num: 'pl', role: 'noun' },
        { num: 'pl', role: 'adj' }
      ];

      cols.forEach(function(col) {
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'grid-input latin-text' + (isDative ? ' dative-row' : '');
        input.dataset.num = col.num;
        input.dataset.case = cas;
        input.dataset.role = col.role;
        input.placeholder = col.role === 'noun' ? 'noun' : 'adj';
        input.tabIndex = tabIdx++;
        input.disabled = !state.declensionIdentified;
        input.autocapitalize = 'off';
        input.autocomplete = 'off';
        input.autocorrect = 'off';
        input.spellcheck = false;
        input.addEventListener('input', function() { input.classList.remove('correct', 'incorrect', 'completed'); });
        container.appendChild(input);
      });
    });
  }
}

// ===== Build Declension Buttons =====
function buildDeclensionButtons() {
  var container = els.selectorButtons;
  container.innerHTML = '';

  if (state.mode === 'noun' || state.mode === 'pair') {
    els.selectorLabel.textContent = state.mode === 'pair' ? 'Identify Noun Declension:' : 'Identify Declension:';
    [1, 2, 3].forEach(function(decl) {
      var btn = document.createElement('button');
      btn.className = 'decl-btn';
      btn.textContent = decl + ordinalSuffix(decl);
      btn.dataset.decl = decl;
      btn.addEventListener('click', function() { handleDeclensionSelect(decl); });
      container.appendChild(btn);
    });
  } else if (state.mode === 'adjective') {
    els.selectorLabel.textContent = 'Identify Adjective Class:';
    var options = [
      { id: '2-1-2', label: '1st & 2nd (2-1-2)' },
      { id: '3rd', label: '3rd Declension' }
    ];
    options.forEach(function(opt) {
      var btn = document.createElement('button');
      btn.className = 'decl-btn';
      btn.textContent = opt.label;
      btn.dataset.decl = opt.id;
      btn.addEventListener('click', function() { handleDeclensionSelect(opt.id); });
      container.appendChild(btn);
    });
  }
}

// ===== Tutorial Content =====
function updateTutorial() {
  if (state.mode === 'noun' || state.mode === 'pair') {
    els.tutorialTitle.textContent = 'Identifying Noun Declension';
    els.tutorialSubtitle.textContent = 'Look at the genitive singular ending:';
    els.tutorialList.innerHTML =
      '<li><span class="ending-chip">-ae</span> 1st</li>' +
      '<li><span class="ending-chip">-ī</span> 2nd</li>' +
      '<li><span class="ending-chip">-is</span> 3rd</li>';
  } else if (state.mode === 'adjective') {
    els.tutorialTitle.textContent = 'Identifying Adjective Class';
    els.tutorialSubtitle.textContent = 'Look at the nominative endings:';
    els.tutorialList.innerHTML =
      '<li><span class="ending-chip">2-1-2</span> -us / -er, -a, -um</li>' +
      '<li><span class="ending-chip">3rd</span> -er, -is, -e | -is, -e | -ns, -x</li>';
  }
}

// ===== Just the Endings Mode Helpers =====
function getEndingsTitle() {
  var declStr = state.endingsDeclension + ordinalSuffix(state.endingsDeclension) + ' Declension';
  var genStr = state.endingsGender === 'm' ? 'Masculine' : state.endingsGender === 'f' ? 'Feminine' : 'Neuter';
  var stemStr = (state.endingsDeclension === 3 && state.includeIStems) ? ' (i-Stem)' : '';
  return declStr + ' ' + genStr + stemStr + ' Endings';
}

function renderEndingsSelectors() {
  if (state.mode !== 'endings') return;

  if (els.endingsDeclButtons) {
    els.endingsDeclButtons.querySelectorAll('.decl-btn').forEach(function(btn) {
      var d = parseInt(btn.dataset.decl, 10);
      btn.classList.toggle('active', d === state.endingsDeclension);
    });
  }

  if (els.endingsGenderButtons) {
    els.endingsGenderButtons.querySelectorAll('.decl-btn').forEach(function(btn) {
      var g = btn.dataset.gen;
      btn.classList.toggle('active', g === state.endingsGender);
      if (state.endingsDeclension === 1 && g === 'n') {
        btn.disabled = true;
        btn.title = '1st declension has no neuter nouns';
      } else {
        btn.disabled = false;
        btn.removeAttribute('title');
      }
    });
  }
}

function handleEndingsDeclSelect(decl) {
  state.endingsDeclension = decl;
  if (decl === 1 && state.endingsGender === 'n') {
    state.endingsGender = 'f';
  }
  resetEndingsPractice();
}

function handleEndingsGenderSelect(gen) {
  if (state.endingsDeclension === 1 && gen === 'n') return;
  state.endingsGender = gen;
  resetEndingsPractice();
}

function resetEndingsPractice() {
  state.isCompleted = false;
  state.hasErrorsOnCurrentWord = false;
  state.declensionIdentified = true;
  buildGrid();
  render();
  setTimeout(function() {
    var first = document.querySelector('.grid-input:not(:disabled)');
    if (first) first.focus();
  }, 50);
}

// ===== Event Handlers =====
function handleDeclensionSelect(selected) {
  if (state.declensionIdentified || state.isCompleted) return;

  var expected = null;
  if (state.mode === 'noun') {
    expected = state.currentWord.declension;
  } else if (state.mode === 'adjective') {
    expected = state.currentWord.declensionClass;
  } else if (state.mode === 'pair') {
    expected = state.currentWord.noun.declension;
  }

  if (selected === expected) {
    state.declensionIdentified = true;
    playCorrectSound(state.soundEnabled);
    state.consecutiveDeclensionMistakes = 0;
    state.showTutorial = false;
    render();
    setTimeout(function() {
      var first = document.querySelector('.grid-input:not(:disabled)');
      if (first) first.focus();
    }, 50);
  } else {
    playErrorSound(state.soundEnabled);
    state.wrongDeclensions.push(selected);
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

  var inputs = document.querySelectorAll('.grid-input');
  inputs.forEach(function(input) {
    var cas = input.dataset.case;
    if (!state.includeDative && cas === 'dat') return;

    var num = input.dataset.num;
    var userInput = input.value;
    var correctForms = [];

    if (state.mode === 'noun') {
      correctForms = state.currentWord.forms[num][cas];
    } else if (state.mode === 'adjective') {
      var gen = input.dataset.gen;
      correctForms = state.currentWord.forms[gen][num][cas];
    } else if (state.mode === 'pair') {
      var role = input.dataset.role;
      if (role === 'noun') {
        correctForms = state.currentWord.forms.noun[num][cas];
      } else {
        correctForms = state.currentWord.forms.adj[num][cas];
      }
    } else if (state.mode === 'endings') {
      var endings = LatinDeclension.getNounEndings(state.endingsDeclension, state.endingsGender, state.includeIStems);
      correctForms = endings[num][cas];
    }

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

  if (allCorrect) {
    if (!state.isCompleted) {
      state.totalAttempts++;
      if (!state.hasErrorsOnCurrentWord && !anyMistake) {
        state.correctAttempts++;
      }
    }
    state.isCompleted = true;

    inputs.forEach(function(input) {
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

function nextWord(resetGrid) {
  if (state.mode === 'endings') {
    state.currentWord = { id: 'endings', declension: state.endingsDeclension };
    state.isCompleted = false;
    state.hasErrorsOnCurrentWord = false;
    state.wrongDeclensions = [];
    state.consecutiveDeclensionMistakes = 0;
    state.showTutorial = false;
    state.declensionIdentified = true;

    buildGrid();
    render();
    setTimeout(function() {
      var first = document.querySelector('.grid-input:not(:disabled)');
      if (first) first.focus();
    }, 50);
    return;
  }

  var next = null;
  if (state.mode === 'noun') {
    var nouns = getActiveNouns();
    next = getRandomItem(nouns, state.currentWord ? state.currentWord.id : null);
  } else if (state.mode === 'adjective') {
    var adjs = getActiveAdjectives();
    next = getRandomItem(adjs, state.currentWord ? state.currentWord.id : null);
  } else if (state.mode === 'pair') {
    var nouns = getActiveNouns();
    var adjs = getActiveAdjectives();
    var n = getRandomItem(nouns, null);
    var a = getRandomItem(adjs, null);
    next = LatinDeclension.createNounAdjectivePair(n, a);
  }

  state.currentWord = next;
  state.isCompleted = false;
  state.hasErrorsOnCurrentWord = false;
  state.wrongDeclensions = [];
  state.consecutiveDeclensionMistakes = 0;
  state.showTutorial = false;

  var expected = null;
  if (state.mode === 'noun') {
    expected = next.declension;
    state.declensionIdentified = expected > 3;
  } else if (state.mode === 'adjective') {
    state.declensionIdentified = false;
  } else if (state.mode === 'pair') {
    expected = next.noun.declension;
    state.declensionIdentified = expected > 3;
  }

  if (resetGrid) {
    buildGrid();
    buildDeclensionButtons();
    updateTutorial();
  } else {
    document.querySelectorAll('.grid-input').forEach(function(input) {
      input.value = '';
      input.disabled = !state.declensionIdentified;
      input.classList.remove('correct', 'incorrect', 'completed');
    });
  }

  render();
  setTimeout(function() {
    var first = document.querySelector('.grid-input:not(:disabled)');
    if (first) first.focus();
  }, 50);
}

function switchMode(newMode) {
  if (state.mode === newMode) return;
  state.mode = newMode;

  document.querySelectorAll('.mode-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.mode === newMode);
  });

  // Retain consistent app title across modes

  nextWord(true);
}

// ===== Toggle Handlers =====
function setupToggles() {
  var macronToggle = document.getElementById('macron-toggle');
  var dativeToggle = document.getElementById('dative-toggle');
  var istemToggle = document.getElementById('istem-toggle');
  var soundToggle = document.getElementById('sound-toggle');

  macronToggle.addEventListener('change', function() {
    state.ignoreMacrons = this.checked;
    document.getElementById('macron-track').classList.toggle('checked', this.checked);
  });

  dativeToggle.addEventListener('change', function() {
    state.includeDative = this.checked;
    document.getElementById('dative-track').classList.toggle('checked', this.checked);
    document.querySelectorAll('.input-grid, .adj-container').forEach(function(grid) {
      grid.classList.toggle('hide-dative', !state.includeDative);
    });
  });

  istemToggle.addEventListener('change', function() {
    state.includeIStems = this.checked;
    document.getElementById('istem-track').classList.toggle('checked', this.checked);
    if (state.mode === 'endings') {
      render();
    } else if (!state.includeIStems) {
      // If turned off and current item is an i-stem, advance to next non-i-stem word
      if (state.mode === 'noun' && state.currentWord && state.currentWord.isIStem) {
        nextWord();
      } else if (state.mode === 'adjective' && state.currentWord && state.currentWord.declensionClass === '3rd') {
        nextWord();
      } else if (state.mode === 'pair' && state.currentWord && state.currentWord.noun.isIStem) {
        nextWord();
      }
    }
  });

  soundToggle.addEventListener('change', function() {
    state.soundEnabled = this.checked;
    document.getElementById('sound-track').classList.toggle('checked', this.checked);
    document.getElementById('sound-icon').textContent = this.checked ? '🔊' : '🔇';
  });

  // Set initial states
  document.getElementById('macron-track').classList.toggle('checked', state.ignoreMacrons);
  document.getElementById('istem-track').classList.toggle('checked', state.includeIStems);
  document.getElementById('sound-track').classList.toggle('checked', state.soundEnabled);
  document.querySelectorAll('.input-grid, .adj-container').forEach(function(grid) {
    grid.classList.toggle('hide-dative', !state.includeDative);
  });
}

// ===== Render =====
function render() {
  if (state.mode === 'endings') {
    if (els.endingsSelectors) els.endingsSelectors.classList.remove('hidden');
    if (els.declSelector) els.declSelector.classList.add('hidden');
    if (els.tutorial) els.tutorial.classList.remove('visible');

    els.wordDisplay.innerHTML = '';
    var latin = document.createElement('span');
    latin.className = 'word-latin';
    latin.textContent = getEndingsTitle();
    els.wordDisplay.appendChild(latin);

    renderEndingsSelectors();
  } else {
    if (els.endingsSelectors) els.endingsSelectors.classList.add('hidden');
    if (els.declSelector) els.declSelector.classList.remove('hidden');

    var word = state.currentWord;
    if (!word) return;

    var expected = null;
    if (state.mode === 'noun') expected = word.declension;
    else if (state.mode === 'adjective') expected = word.declensionClass;
    else if (state.mode === 'pair') expected = word.noun.declension;

    // Word display
    els.wordDisplay.innerHTML = '';
    var latin = document.createElement('span');
    latin.className = 'word-latin';

    if (state.mode === 'noun' || state.mode === 'adjective') {
      latin.textContent = word.displayEntry || word.entry;
    } else if (state.mode === 'pair') {
      latin.textContent = word.noun.displayEntry + ' + ' + word.adjective.displayEntry;
    }
    els.wordDisplay.appendChild(latin);

    if (word.translation) {
      var divider = document.createElement('span');
      divider.className = 'word-divider';
      divider.textContent = '—';
      els.wordDisplay.appendChild(divider);

      var translation = document.createElement('span');
      translation.className = 'word-translation';
      translation.textContent = word.translation;
      els.wordDisplay.appendChild(translation);
    }

    // Declension selector buttons
    var buttons = els.selectorButtons.querySelectorAll('.decl-btn');
    buttons.forEach(function(btn) {
      var decl = state.mode === 'noun' || state.mode === 'pair' ? parseInt(btn.dataset.decl, 10) : btn.dataset.decl;
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

    // Tutorial
    els.tutorial.classList.toggle('visible', state.showTutorial);
  }

  // Disable / Enable inputs
  document.querySelectorAll('.grid-input').forEach(function(input) {
    input.disabled = !state.declensionIdentified || state.isCompleted;
  });

  // Container disabled state
  els.inputGrid.classList.toggle('disabled', !state.declensionIdentified);

  // Action Buttons
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
async function init() {
  els.wordDisplay = document.getElementById('word-display');
  els.declSelector = document.getElementById('declension-selector');
  els.selectorLabel = document.getElementById('selector-label');
  els.selectorButtons = document.getElementById('selector-buttons');
  els.tutorial = document.getElementById('tutorial');
  els.tutorialTitle = document.getElementById('tutorial-title');
  els.tutorialSubtitle = document.getElementById('tutorial-subtitle');
  els.tutorialList = document.getElementById('tutorial-list');
  els.inputGrid = document.getElementById('input-grid');
  els.checkBtn = document.getElementById('check-btn');
  els.nextBtn = document.getElementById('next-btn');
  els.skipBtn = document.getElementById('skip-btn');
  els.accuracyValue = document.getElementById('accuracy-value');
  els.streakValue = document.getElementById('streak-value');
  els.endingsSelectors = document.getElementById('endings-selectors');
  els.endingsDeclButtons = document.getElementById('endings-decl-buttons');
  els.endingsGenderButtons = document.getElementById('endings-gender-buttons');

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      switchMode(this.dataset.mode);
    });
  });

  if (els.endingsDeclButtons) {
    els.endingsDeclButtons.querySelectorAll('.decl-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        handleEndingsDeclSelect(parseInt(this.dataset.decl, 10));
      });
    });
  }

  if (els.endingsGenderButtons) {
    els.endingsGenderButtons.querySelectorAll('.decl-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        handleEndingsGenderSelect(this.dataset.gen);
      });
    });
  }

  setupToggles();
  els.checkBtn.addEventListener('click', handleCheck);
  els.nextBtn.addEventListener('click', function() { nextWord(); });
  els.skipBtn.addEventListener('click', function() { nextWord(); });
  document.addEventListener('keydown', handleKeyDown);

  // Load vocabulary plain text file
  await loadVocabulary();

  // Initialize with initial word and grid
  nextWord(true);
}

document.addEventListener('DOMContentLoaded', init);

