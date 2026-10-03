// ===== App State =====
var CASES = ['nom', 'gen', 'dat', 'acc', 'abl'];
var CASE_LABELS = { nom: 'Nominative', gen: 'Genitive', dat: 'Dative', acc: 'Accusative', abl: 'Ablative' };
var GENDERS = ['m', 'f', 'n'];
var GENDER_LABELS = { m: 'Masc.', f: 'Fem.', n: 'Neut.' };

var state = {
  mode: 'noun', // 'noun' | 'adjective' | 'pair' | 'endings' | 'quiz'
  currentWord: null,
  currentQuiz: null,
  includeDative: false,
  includeNeuter: false,
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
    if (!state.includeNeuter && w.gender && w.gender.startsWith('n')) return false;
    if (!state.includeIStems && w.isIStem) return false;
    return true;
  });
  if (list.length > 0) return list;
  var nonNeuter = nounVocabulary.filter(function(w) { return !w.gender || !w.gender.startsWith('n'); });
  return nonNeuter.length > 0 ? nonNeuter : nounVocabulary;
}

function getActiveAdjectives() {
  var list = adjectiveVocabulary.filter(function(a) {
    if (!state.includeIStems && a.declensionClass === '3rd') return false;
    return true;
  });
  return list.length > 0 ? list : adjectiveVocabulary;
}

var decks = {
  quiz: [],
  noun: [],
  adjective: [],
  pairNoun: [],
  pairAdj: []
};
var lastDrawn = {
  quiz: null,
  noun: null,
  adjective: null,
  pairNoun: null,
  pairAdj: null
};

function resetDecks() {
  decks.quiz = [];
  decks.noun = [];
  decks.adjective = [];
  decks.pairNoun = [];
  decks.pairAdj = [];
}

function getNextFromDeck(deckKey, getItemsFn) {
  var pool = getItemsFn();
  if (!pool || pool.length === 0) return null;
  if (pool.length === 1) return pool[0];

  // Filter existing deck to only include items currently in the active pool
  var poolMap = {};
  pool.forEach(function(item) {
    poolMap[item.id] = true;
  });

  var deck = (decks[deckKey] || []).filter(function(item) {
    return poolMap[item.id] === true;
  });

  if (deck.length === 0) {
    deck = pool.slice();
    // Fisher-Yates shuffle
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    // Prevent the first item of the new deck from being the exact same as the last item drawn
    if (lastDrawn[deckKey] && deck.length > 1 && deck[0].id === lastDrawn[deckKey].id) {
      var swapIdx = 1 + Math.floor(Math.random() * (deck.length - 1));
      var swapTemp = deck[0];
      deck[0] = deck[swapIdx];
      deck[swapIdx] = swapTemp;
    }
  }

  var chosen = deck.shift();
  decks[deckKey] = deck;
  lastDrawn[deckKey] = chosen;
  return chosen;
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
  var directMatch = correctForms.some(function(form) {
    return normalizeLatin(form) === normInput;
  });
  if (directMatch) return true;

  // Handle multi-token ending combinations (e.g. "us, r", "-us, -r", "us, r, er", "us er r", "us / r", etc.)
  if (normInput) {
    var rawTokens = normInput.split(/[,/;\s]+|\b(?:or|and)\b/).filter(Boolean);
    if (rawTokens.length > 1) {
      var tokens = rawTokens.map(function(t) {
        return t.replace(/^-+|-+$/g, '').trim();
      }).filter(Boolean);

      if (tokens.length > 1) {
        var validCleanEndings = [];
        correctForms.forEach(function(f) {
          var clean = normalizeLatin(f).replace(/^-+|-+$/g, '').trim();
          if (clean && clean !== '—' && clean !== 'var' && clean !== 'varies' && clean !== 'none') {
            var parts = clean.split(/[,/;\s]+|\b(?:or|and)\b/).filter(Boolean);
            parts.forEach(function(p) {
              var cleanP = p.replace(/^-+|-+$/g, '').trim();
              if (cleanP && !validCleanEndings.includes(cleanP)) {
                validCleanEndings.push(cleanP);
              }
            });
          }
        });

        if (validCleanEndings.length > 1) {
          var allValid = tokens.every(function(t) {
            return validCleanEndings.includes(t);
          });
          if (allValid) return true;
        }
      }
    }
  }

  return false;
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
    container.className = 'decl-container mode-noun' + (!state.includeDative ? ' hide-dative' : '');

    var numCases = CASES.length;
    ['sg', 'pl'].forEach(function(num, numIdx) {
      var card = document.createElement('div');
      card.className = 'decl-card';

      var title = document.createElement('h3');
      title.className = 'decl-card-title';
      title.textContent = num === 'sg' ? 'Singular' : 'Plural';
      card.appendChild(title);

      var subgrid = document.createElement('div');
      subgrid.className = 'decl-subgrid';

      CASES.forEach(function(cas, caseIdx) {
        var isDative = cas === 'dat';
        var label = document.createElement('div');
        label.className = 'case-label' + (isDative ? ' optional dative-row' : '');
        label.textContent = CASE_LABELS[cas] + (isDative ? '*' : '');
        subgrid.appendChild(label);

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
        subgrid.appendChild(input);
      });

      card.appendChild(subgrid);
      container.appendChild(card);
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
        header.className = 'grid-header' + (!state.includeNeuter && gen === 'n' ? ' col-neuter-disabled' : '');
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
          var isNeuterDisabled = (!state.includeNeuter && gen === 'n');
          input.className = 'grid-input latin-text' + (isDative ? ' dative-row' : '') + (isNeuterDisabled ? ' neuter-disabled' : '');
          input.dataset.num = num;
          input.dataset.case = cas;
          input.dataset.gen = gen;
          if (isNeuterDisabled) {
            input.tabIndex = -1;
            input.disabled = true;
            input.placeholder = '—';
          } else {
            input.tabIndex = tabCounter++;
            input.disabled = !state.declensionIdentified;
          }
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
    container.className = 'decl-container mode-pair' + (!state.includeDative ? ' hide-dative' : '');

    ['sg', 'pl'].forEach(function(num) {
      var card = document.createElement('div');
      card.className = 'decl-card pair-card';

      var title = document.createElement('h3');
      title.className = 'decl-card-title';
      title.textContent = num === 'sg' ? 'Singular' : 'Plural';
      card.appendChild(title);

      var subgrid = document.createElement('div');
      subgrid.className = 'pair-subgrid';

      // Header row
      var emptyHeader = document.createElement('div');
      subgrid.appendChild(emptyHeader);

      ['Noun', 'Adjective'].forEach(function(sub) {
        var header = document.createElement('div');
        header.className = 'grid-header';
        header.textContent = sub;
        subgrid.appendChild(header);
      });

      CASES.forEach(function(cas, caseIdx) {
        var isDative = cas === 'dat';
        var label = document.createElement('div');
        label.className = 'case-label' + (isDative ? ' optional dative-row' : '');
        label.textContent = CASE_LABELS[cas] + (isDative ? '*' : '');
        subgrid.appendChild(label);

        ['noun', 'adj'].forEach(function(role, roleIdx) {
          var input = document.createElement('input');
          input.type = 'text';
          input.className = 'grid-input latin-text' + (isDative ? ' dative-row' : '');
          input.dataset.num = num;
          input.dataset.case = cas;
          input.dataset.role = role;
          input.placeholder = role;
          var baseOffset = num === 'sg' ? 0 : 10;
          input.tabIndex = baseOffset + caseIdx * 2 + roleIdx + 1;
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
  } else if (state.mode === 'quiz') {
    container.className = 'quiz-container' + (!state.includeDative ? ' hide-dative' : '');

    var card = document.createElement('div');
    card.className = 'quiz-matrix-card';

    var header = document.createElement('div');
    header.className = 'quiz-matrix-header';
    var caseColHeader = document.createElement('span');
    caseColHeader.className = 'quiz-header-cell case-col-header';
    caseColHeader.textContent = 'Case';
    header.appendChild(caseColHeader);

    var sgHeader = document.createElement('span');
    sgHeader.className = 'quiz-header-cell';
    sgHeader.textContent = 'Singular';
    header.appendChild(sgHeader);

    var plHeader = document.createElement('span');
    plHeader.className = 'quiz-header-cell';
    plHeader.textContent = 'Plural';
    header.appendChild(plHeader);

    card.appendChild(header);

    var body = document.createElement('div');
    body.className = 'quiz-matrix-body';

    CASES.forEach(function(cas) {
      var isDative = cas === 'dat';
      var row = document.createElement('div');
      row.className = 'quiz-row' + (isDative ? ' dative-row' : '');

      var label = document.createElement('span');
      label.className = 'quiz-case-label' + (isDative ? ' optional' : '');
      label.textContent = CASE_LABELS[cas] + (isDative ? '*' : '');
      row.appendChild(label);

      ['sg', 'pl'].forEach(function(num) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-choice-btn';
        btn.dataset.cas = cas;
        btn.dataset.num = num;
        btn.id = 'quiz-' + cas + '-' + num;

        var checkIcon = document.createElement('span');
        checkIcon.className = 'choice-check';
        checkIcon.textContent = '✓';
        btn.appendChild(checkIcon);

        var textSpan = document.createElement('span');
        textSpan.className = 'choice-label';
        textSpan.textContent = num === 'sg' ? 'Singular' : 'Plural';
        btn.appendChild(textSpan);

        var feedbackSpan = document.createElement('span');
        feedbackSpan.className = 'choice-feedback';
        btn.appendChild(feedbackSpan);

        btn.addEventListener('click', function() {
          if (state.isCompleted) return;
          this.classList.toggle('selected');
          updateQuizCheckButtonState();
        });

        row.appendChild(btn);
      });

      body.appendChild(row);
    });

    card.appendChild(body);
    container.appendChild(card);
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
      } else if (state.endingsDeclension === 2 && g === 'f') {
        btn.disabled = true;
        btn.title = '2nd declension has no regular feminine nouns';
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
  } else if (decl === 2 && state.endingsGender === 'f') {
    state.endingsGender = 'm';
  }
  resetEndingsPractice();
}

function handleEndingsGenderSelect(gen) {
  if (state.endingsDeclension === 1 && gen === 'n') return;
  if (state.endingsDeclension === 2 && gen === 'f') return;
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

function updateQuizCheckButtonState() {
  if (state.mode !== 'quiz' || state.isCompleted) return;
  var anySelected = document.querySelectorAll('.quiz-choice-btn.selected').length > 0;
  if (els.checkBtn) els.checkBtn.disabled = !anySelected;
}

function nextQuizQuestion() {
  var nouns = getActiveNouns();
  if (!nouns || nouns.length === 0) return;

  var noun = getNextFromDeck('quiz', getActiveNouns);
  var cases = ['nom', 'gen', 'acc', 'abl'];
  if (state.includeDative) cases.push('dat');
  var numbers = ['sg', 'pl'];

  var getCanon = (typeof LatinDeclension !== 'undefined' && LatinDeclension.getCanonicalForms)
    ? LatinDeclension.getCanonicalForms
    : function(arr) { return arr && arr.length > 0 ? [arr[0]] : []; };

  // Gather unique canonical surface forms of this noun across active cases and numbers
  var distinctForms = [];
  numbers.forEach(function(n) {
    cases.forEach(function(c) {
      var canons = getCanon(noun.forms[n][c]);
      canons.forEach(function(f) {
        if (!distinctForms.includes(f)) {
          distinctForms.push(f);
        }
      });
    });
  });

  var targetForm = distinctForms[Math.floor(Math.random() * distinctForms.length)];

  // In Quiz mode, a case/number slot matches if and only if targetForm is one of the valid canonical forms for that slot.
  // Macrons are strictly respected so that, e.g., ablative -ā is not conflated with nominative -a.
  var matches = [];
  numbers.forEach(function(n) {
    cases.forEach(function(c) {
      var canons = getCanon(noun.forms[n][c]);
      if (canons.includes(targetForm)) {
        matches.push({ cas: c, num: n });
      }
    });
  });

  state.currentQuiz = {
    noun: noun,
    form: targetForm,
    matches: matches
  };
  state.currentWord = noun;
  state.declensionIdentified = true;
  state.isCompleted = false;
  state.hasErrorsOnCurrentWord = false;

  buildGrid();
  render();
}

function handleCheck() {
  if (state.mode === 'quiz') {
    if (state.isCompleted) return;
    var quizButtons = document.querySelectorAll('.quiz-choice-btn');
    var matches = (state.currentQuiz && state.currentQuiz.matches) ? state.currentQuiz.matches : [];

    var selectedCount = 0;
    quizButtons.forEach(function(btn) {
      if (btn.classList.contains('selected')) selectedCount++;
    });
    if (selectedCount === 0) return;

    var anyMistake = false;
    quizButtons.forEach(function(btn) {
      var cas = btn.dataset.cas;
      var num = btn.dataset.num;
      if (!state.includeDative && cas === 'dat') return;

      var isSelected = btn.classList.contains('selected');
      var isMatch = matches.some(function(m) {
        return m.cas === cas && m.num === num;
      });

      btn.classList.remove('correct', 'incorrect', 'missed');
      var fb = btn.querySelector('.choice-feedback');
      if (fb) fb.textContent = '';

      if (isSelected && isMatch) {
        btn.classList.add('correct');
        if (fb) fb.textContent = '✓ Correct';
      } else if (isSelected && !isMatch) {
        btn.classList.add('incorrect');
        if (fb) fb.textContent = '✗ Wrong';
        anyMistake = true;
      } else if (!isSelected && isMatch) {
        btn.classList.add('missed');
        if (fb) fb.textContent = '! Missed';
        anyMistake = true;
      }
    });

    if (!state.isCompleted) {
      state.totalAttempts++;
      if (!anyMistake) {
        state.correctAttempts++;
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
        playErrorSound(state.soundEnabled);
      }
    }

    state.isCompleted = true;
    render();
    return;
  }

  if (!state.declensionIdentified) return;
  var allCorrect = true;
  var anyMistake = false;

  var inputs = document.querySelectorAll('.grid-input');
  inputs.forEach(function(input) {
    var cas = input.dataset.case;
    if (!state.includeDative && cas === 'dat') return;
    if (state.mode === 'adjective' && !state.includeNeuter && input.dataset.gen === 'n') return;

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
      if (state.mode === 'adjective' && !state.includeNeuter && input.dataset.gen === 'n') return;
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
  if (state.mode === 'quiz') {
    nextQuizQuestion();
    return;
  }

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
    next = getNextFromDeck('noun', getActiveNouns);
  } else if (state.mode === 'adjective') {
    next = getNextFromDeck('adjective', getActiveAdjectives);
  } else if (state.mode === 'pair') {
    var n = getNextFromDeck('pairNoun', getActiveNouns);
    var a = getNextFromDeck('pairAdj', getActiveAdjectives);
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
      if (state.mode === 'adjective' && !state.includeNeuter && input.dataset.gen === 'n') {
        input.disabled = true;
        input.tabIndex = -1;
      } else {
        input.disabled = !state.declensionIdentified;
      }
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
  var neuterToggle = document.getElementById('neuter-toggle');
  var istemToggle = document.getElementById('istem-toggle');
  var soundToggle = document.getElementById('sound-toggle');

  var optionsBtn = document.getElementById('options-toggle-btn');
  var togglesWrapper = document.getElementById('toggles-wrapper');
  if (optionsBtn && togglesWrapper) {
    optionsBtn.addEventListener('click', function() {
      var isOpen = togglesWrapper.classList.toggle('open');
      optionsBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      optionsBtn.classList.toggle('active', isOpen);
    });
  }

  macronToggle.addEventListener('change', function() {
    state.ignoreMacrons = this.checked;
    document.getElementById('macron-track').classList.toggle('checked', this.checked);
  });

  dativeToggle.addEventListener('change', function() {
    state.includeDative = this.checked;
    document.getElementById('dative-track').classList.toggle('checked', this.checked);
    document.querySelectorAll('.input-grid, .adj-container, .decl-container, .quiz-container').forEach(function(grid) {
      grid.classList.toggle('hide-dative', !state.includeDative);
    });
    if (state.mode === 'quiz') {
      nextQuizQuestion();
    }
  });

  neuterToggle.addEventListener('change', function() {
    state.includeNeuter = this.checked;
    resetDecks();
    document.getElementById('neuter-track').classList.toggle('checked', this.checked);
    if (state.mode === 'adjective') {
      buildGrid();
      render();
    } else if (state.mode === 'quiz') {
      if (!state.includeNeuter && state.currentQuiz && state.currentQuiz.noun && state.currentQuiz.noun.gender && state.currentQuiz.noun.gender.startsWith('n')) {
        nextQuizQuestion();
      }
    } else if (!state.includeNeuter) {
      if (state.mode === 'noun' && state.currentWord && state.currentWord.gender && state.currentWord.gender.startsWith('n')) {
        nextWord();
      } else if (state.mode === 'pair' && state.currentWord && state.currentWord.noun && state.currentWord.noun.gender && state.currentWord.noun.gender.startsWith('n')) {
        nextWord();
      }
    }
  });

  istemToggle.addEventListener('change', function() {
    state.includeIStems = this.checked;
    resetDecks();
    document.getElementById('istem-track').classList.toggle('checked', this.checked);
    if (state.mode === 'endings') {
      render();
    } else if (state.mode === 'quiz') {
      if (!state.includeIStems && state.currentQuiz && state.currentQuiz.noun && state.currentQuiz.noun.isIStem) {
        nextQuizQuestion();
      }
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
  document.getElementById('neuter-track').classList.toggle('checked', state.includeNeuter);
  document.getElementById('istem-track').classList.toggle('checked', state.includeIStems);
  document.getElementById('sound-track').classList.toggle('checked', state.soundEnabled);
  document.querySelectorAll('.input-grid, .adj-container, .decl-container, .quiz-container').forEach(function(grid) {
    grid.classList.toggle('hide-dative', !state.includeDative);
  });
}

// ===== Render =====
function render() {
  if (state.mode === 'quiz') {
    if (els.endingsSelectors) els.endingsSelectors.classList.add('hidden');
    if (els.declSelector) els.declSelector.classList.add('hidden');
    if (els.tutorial) els.tutorial.classList.remove('visible');

    els.wordDisplay.innerHTML = '';
    if (state.currentQuiz) {
      var promptWrap = document.createElement('div');
      promptWrap.className = 'quiz-prompt-container';

      var promptWord = document.createElement('div');
      promptWord.className = 'quiz-prompt-word word-latin';
      promptWord.textContent = state.currentQuiz.form;
      promptWrap.appendChild(promptWord);

      var lemmaDisplay = document.createElement('div');
      lemmaDisplay.className = 'quiz-lemma-display';
      var fromSpan = document.createElement('span');
      fromSpan.className = 'quiz-from-label';
      fromSpan.textContent = 'from';
      lemmaDisplay.appendChild(fromSpan);

      var lemmaWord = document.createElement('span');
      lemmaWord.className = 'word-latin';
      lemmaWord.textContent = state.currentQuiz.noun.displayEntry || state.currentQuiz.noun.entry;
      lemmaDisplay.appendChild(lemmaWord);

      if (state.currentQuiz.noun.translation) {
        var divider = document.createElement('span');
        divider.className = 'word-divider';
        divider.textContent = '—';
        lemmaDisplay.appendChild(divider);

        var trans = document.createElement('span');
        trans.className = 'word-translation';
        trans.textContent = state.currentQuiz.noun.translation;
        lemmaDisplay.appendChild(trans);
      }
      promptWrap.appendChild(lemmaDisplay);

      var instruction = document.createElement('p');
      instruction.className = 'quiz-instructions';
      instruction.textContent = 'Select all possible case and number combinations:';
      promptWrap.appendChild(instruction);

      els.wordDisplay.appendChild(promptWrap);
    }
  } else if (state.mode === 'endings') {
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
    if (state.mode === 'adjective' && !state.includeNeuter && input.dataset.gen === 'n') {
      input.disabled = true;
      input.tabIndex = -1;
      return;
    }
    input.disabled = !state.declensionIdentified || state.isCompleted;
  });

  // Container disabled state
  els.inputGrid.classList.toggle('disabled', !state.declensionIdentified);

  // Action Buttons
  if (state.isCompleted) {
    els.checkBtn.style.display = 'none';
    els.skipBtn.style.display = 'none';
    els.nextBtn.style.display = 'flex';
    if (els.enterHint) els.enterHint.innerHTML = 'Press <kbd>Enter</kbd> for next';
  } else {
    els.checkBtn.style.display = 'flex';
    if (state.mode === 'quiz') {
      var anySelected = document.querySelectorAll('.quiz-choice-btn.selected').length > 0;
      els.checkBtn.disabled = !anySelected;
    } else {
      els.checkBtn.disabled = !state.declensionIdentified;
    }
    els.skipBtn.style.display = 'flex';
    els.nextBtn.style.display = 'none';
    if (els.enterHint) els.enterHint.innerHTML = 'Press <kbd>Enter</kbd>';
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
  els.enterHint = document.getElementById('enter-hint');
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

