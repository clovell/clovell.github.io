// Data Generator for 1st/2nd Declension "unus nauta" words
function generateUnusNauta(base, nomM, nomF, nomN, gen, dat) {
    return [
        { case: 'Nominative', number: 'Singular', gender: 'Masculine', answers: nomM },
        { case: 'Genitive', number: 'Singular', gender: 'Masculine', answers: gen },
        { case: 'Dative', number: 'Singular', gender: 'Masculine', answers: dat },
        { case: 'Accusative', number: 'Singular', gender: 'Masculine', answers: [`${base}um`] },
        { case: 'Ablative', number: 'Singular', gender: 'Masculine', answers: [`${base}o`, `${base}ō`] },
        
        { case: 'Nominative', number: 'Singular', gender: 'Feminine', answers: nomF },
        { case: 'Genitive', number: 'Singular', gender: 'Feminine', answers: gen },
        { case: 'Dative', number: 'Singular', gender: 'Feminine', answers: dat },
        { case: 'Accusative', number: 'Singular', gender: 'Feminine', answers: [`${base}am`] },
        { case: 'Ablative', number: 'Singular', gender: 'Feminine', answers: [`${base}a`, `${base}ā`] },
        
        { case: 'Nominative', number: 'Singular', gender: 'Neuter', answers: nomN },
        { case: 'Genitive', number: 'Singular', gender: 'Neuter', answers: gen },
        { case: 'Dative', number: 'Singular', gender: 'Neuter', answers: dat },
        { case: 'Accusative', number: 'Singular', gender: 'Neuter', answers: nomN },
        { case: 'Ablative', number: 'Singular', gender: 'Neuter', answers: [`${base}o`, `${base}ō`] },
        
        // Plurals
        { case: 'Nominative', number: 'Plural', gender: 'Masculine', answers: [`${base}i`, `${base}ī`] },
        { case: 'Genitive', number: 'Plural', gender: 'Masculine', answers: [`${base}orum`, `${base}ōrum`] },
        { case: 'Dative', number: 'Plural', gender: 'Masculine', answers: [`${base}is`, `${base}īs`] },
        { case: 'Accusative', number: 'Plural', gender: 'Masculine', answers: [`${base}os`, `${base}ōs`] },
        { case: 'Ablative', number: 'Plural', gender: 'Masculine', answers: [`${base}is`, `${base}īs`] },
        
        { case: 'Nominative', number: 'Plural', gender: 'Feminine', answers: [`${base}ae`] },
        { case: 'Genitive', number: 'Plural', gender: 'Feminine', answers: [`${base}arum`, `${base}ārum`] },
        { case: 'Dative', number: 'Plural', gender: 'Feminine', answers: [`${base}is`, `${base}īs`] },
        { case: 'Accusative', number: 'Plural', gender: 'Feminine', answers: [`${base}as`, `${base}ās`] },
        { case: 'Ablative', number: 'Plural', gender: 'Feminine', answers: [`${base}is`, `${base}īs`] },
        
        { case: 'Nominative', number: 'Plural', gender: 'Neuter', answers: [`${base}a`] },
        { case: 'Genitive', number: 'Plural', gender: 'Neuter', answers: [`${base}orum`, `${base}ōrum`] },
        { case: 'Dative', number: 'Plural', gender: 'Neuter', answers: [`${base}is`, `${base}īs`] },
        { case: 'Accusative', number: 'Plural', gender: 'Neuter', answers: [`${base}a`] },
        { case: 'Ablative', number: 'Plural', gender: 'Neuter', answers: [`${base}is`, `${base}īs`] }
    ];
}

// Full Dictionary
const paradigms = {
    hic: [
        { case: 'Nominative', number: 'Singular', gender: 'Masculine', answers: ['hic'] }, { case: 'Genitive', number: 'Singular', gender: 'Masculine', answers: ['huius', 'hūius'] }, { case: 'Dative', number: 'Singular', gender: 'Masculine', answers: ['huic'] }, { case: 'Accusative', number: 'Singular', gender: 'Masculine', answers: ['hunc'] }, { case: 'Ablative', number: 'Singular', gender: 'Masculine', answers: ['hoc', 'hōc'] },
        { case: 'Nominative', number: 'Singular', gender: 'Feminine', answers: ['haec'] }, { case: 'Genitive', number: 'Singular', gender: 'Feminine', answers: ['huius', 'hūius'] }, { case: 'Dative', number: 'Singular', gender: 'Feminine', answers: ['huic'] }, { case: 'Accusative', number: 'Singular', gender: 'Feminine', answers: ['hanc'] }, { case: 'Ablative', number: 'Singular', gender: 'Feminine', answers: ['hac', 'hāc'] },
        { case: 'Nominative', number: 'Singular', gender: 'Neuter', answers: ['hoc'] }, { case: 'Genitive', number: 'Singular', gender: 'Neuter', answers: ['huius', 'hūius'] }, { case: 'Dative', number: 'Singular', gender: 'Neuter', answers: ['huic'] }, { case: 'Accusative', number: 'Singular', gender: 'Neuter', answers: ['hoc'] }, { case: 'Ablative', number: 'Singular', gender: 'Neuter', answers: ['hoc', 'hōc'] },
        { case: 'Nominative', number: 'Plural', gender: 'Masculine', answers: ['hi', 'hī'] }, { case: 'Genitive', number: 'Plural', gender: 'Masculine', answers: ['horum', 'hōrum'] }, { case: 'Dative', number: 'Plural', gender: 'Masculine', answers: ['his', 'hīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Masculine', answers: ['hos', 'hōs'] }, { case: 'Ablative', number: 'Plural', gender: 'Masculine', answers: ['his', 'hīs'] },
        { case: 'Nominative', number: 'Plural', gender: 'Feminine', answers: ['hae'] }, { case: 'Genitive', number: 'Plural', gender: 'Feminine', answers: ['harum', 'hārum'] }, { case: 'Dative', number: 'Plural', gender: 'Feminine', answers: ['his', 'hīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Feminine', answers: ['has', 'hās'] }, { case: 'Ablative', number: 'Plural', gender: 'Feminine', answers: ['his', 'hīs'] },
        { case: 'Nominative', number: 'Plural', gender: 'Neuter', answers: ['haec'] }, { case: 'Genitive', number: 'Plural', gender: 'Neuter', answers: ['horum', 'hōrum'] }, { case: 'Dative', number: 'Plural', gender: 'Neuter', answers: ['his', 'hīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Neuter', answers: ['haec'] }, { case: 'Ablative', number: 'Plural', gender: 'Neuter', answers: ['his', 'hīs'] }
    ],
    ille: [
        { case: 'Nominative', number: 'Singular', gender: 'Masculine', answers: ['ille'] }, { case: 'Genitive', number: 'Singular', gender: 'Masculine', answers: ['illius', 'illīus'] }, { case: 'Dative', number: 'Singular', gender: 'Masculine', answers: ['illi', 'illī'] }, { case: 'Accusative', number: 'Singular', gender: 'Masculine', answers: ['illum'] }, { case: 'Ablative', number: 'Singular', gender: 'Masculine', answers: ['illo', 'illō'] },
        { case: 'Nominative', number: 'Singular', gender: 'Feminine', answers: ['illa'] }, { case: 'Genitive', number: 'Singular', gender: 'Feminine', answers: ['illius', 'illīus'] }, { case: 'Dative', number: 'Singular', gender: 'Feminine', answers: ['illi', 'illī'] }, { case: 'Accusative', number: 'Singular', gender: 'Feminine', answers: ['illam'] }, { case: 'Ablative', number: 'Singular', gender: 'Feminine', answers: ['illa', 'illā'] },
        { case: 'Nominative', number: 'Singular', gender: 'Neuter', answers: ['illud'] }, { case: 'Genitive', number: 'Singular', gender: 'Neuter', answers: ['illius', 'illīus'] }, { case: 'Dative', number: 'Singular', gender: 'Neuter', answers: ['illi', 'illī'] }, { case: 'Accusative', number: 'Singular', gender: 'Neuter', answers: ['illud'] }, { case: 'Ablative', number: 'Singular', gender: 'Neuter', answers: ['illo', 'illō'] },
        { case: 'Nominative', number: 'Plural', gender: 'Masculine', answers: ['illi', 'illī'] }, { case: 'Genitive', number: 'Plural', gender: 'Masculine', answers: ['illorum', 'illōrum'] }, { case: 'Dative', number: 'Plural', gender: 'Masculine', answers: ['illis', 'illīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Masculine', answers: ['illos', 'illōs'] }, { case: 'Ablative', number: 'Plural', gender: 'Masculine', answers: ['illis', 'illīs'] },
        { case: 'Nominative', number: 'Plural', gender: 'Feminine', answers: ['illae'] }, { case: 'Genitive', number: 'Plural', gender: 'Feminine', answers: ['illarum', 'illārum'] }, { case: 'Dative', number: 'Plural', gender: 'Feminine', answers: ['illis', 'illīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Feminine', answers: ['illas', 'illās'] }, { case: 'Ablative', number: 'Plural', gender: 'Feminine', answers: ['illis', 'illīs'] },
        { case: 'Nominative', number: 'Plural', gender: 'Neuter', answers: ['illa'] }, { case: 'Genitive', number: 'Plural', gender: 'Neuter', answers: ['illorum', 'illōrum'] }, { case: 'Dative', number: 'Plural', gender: 'Neuter', answers: ['illis', 'illīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Neuter', answers: ['illa'] }, { case: 'Ablative', number: 'Plural', gender: 'Neuter', answers: ['illis', 'illīs'] }
    ],
    iste: [
        { case: 'Nominative', number: 'Singular', gender: 'Masculine', answers: ['iste'] }, { case: 'Genitive', number: 'Singular', gender: 'Masculine', answers: ['istius', 'istīus'] }, { case: 'Dative', number: 'Singular', gender: 'Masculine', answers: ['isti', 'istī'] }, { case: 'Accusative', number: 'Singular', gender: 'Masculine', answers: ['istum'] }, { case: 'Ablative', number: 'Singular', gender: 'Masculine', answers: ['isto', 'istō'] },
        { case: 'Nominative', number: 'Singular', gender: 'Feminine', answers: ['ista'] }, { case: 'Genitive', number: 'Singular', gender: 'Feminine', answers: ['istius', 'istīus'] }, { case: 'Dative', number: 'Singular', gender: 'Feminine', answers: ['isti', 'istī'] }, { case: 'Accusative', number: 'Singular', gender: 'Feminine', answers: ['istam'] }, { case: 'Ablative', number: 'Singular', gender: 'Feminine', answers: ['ista', 'istā'] },
        { case: 'Nominative', number: 'Singular', gender: 'Neuter', answers: ['istud'] }, { case: 'Genitive', number: 'Singular', gender: 'Neuter', answers: ['istius', 'istīus'] }, { case: 'Dative', number: 'Singular', gender: 'Neuter', answers: ['isti', 'istī'] }, { case: 'Accusative', number: 'Singular', gender: 'Neuter', answers: ['istud'] }, { case: 'Ablative', number: 'Singular', gender: 'Neuter', answers: ['isto', 'istō'] },
        { case: 'Nominative', number: 'Plural', gender: 'Masculine', answers: ['isti', 'istī'] }, { case: 'Genitive', number: 'Plural', gender: 'Masculine', answers: ['istorum', 'istōrum'] }, { case: 'Dative', number: 'Plural', gender: 'Masculine', answers: ['istis', 'istīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Masculine', answers: ['istos', 'istōs'] }, { case: 'Ablative', number: 'Plural', gender: 'Masculine', answers: ['istis', 'istīs'] },
        { case: 'Nominative', number: 'Plural', gender: 'Feminine', answers: ['istae'] }, { case: 'Genitive', number: 'Plural', gender: 'Feminine', answers: ['istarum', 'istārum'] }, { case: 'Dative', number: 'Plural', gender: 'Feminine', answers: ['istis', 'istīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Feminine', answers: ['istas', 'istās'] }, { case: 'Ablative', number: 'Plural', gender: 'Feminine', answers: ['istis', 'istīs'] },
        { case: 'Nominative', number: 'Plural', gender: 'Neuter', answers: ['ista'] }, { case: 'Genitive', number: 'Plural', gender: 'Neuter', answers: ['istorum', 'istōrum'] }, { case: 'Dative', number: 'Plural', gender: 'Neuter', answers: ['istis', 'istīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Neuter', answers: ['ista'] }, { case: 'Ablative', number: 'Plural', gender: 'Neuter', answers: ['istis', 'istīs'] }
    ],
    is: [
        { case: 'Nominative', number: 'Singular', gender: 'Masculine', answers: ['is'] }, { case: 'Genitive', number: 'Singular', gender: 'Masculine', answers: ['eius', 'ēius'] }, { case: 'Dative', number: 'Singular', gender: 'Masculine', answers: ['ei', 'eī'] }, { case: 'Accusative', number: 'Singular', gender: 'Masculine', answers: ['eum'] }, { case: 'Ablative', number: 'Singular', gender: 'Masculine', answers: ['eo', 'eō'] },
        { case: 'Nominative', number: 'Singular', gender: 'Feminine', answers: ['ea'] }, { case: 'Genitive', number: 'Singular', gender: 'Feminine', answers: ['eius', 'ēius'] }, { case: 'Dative', number: 'Singular', gender: 'Feminine', answers: ['ei', 'eī'] }, { case: 'Accusative', number: 'Singular', gender: 'Feminine', answers: ['eam'] }, { case: 'Ablative', number: 'Singular', gender: 'Feminine', answers: ['ea', 'eā'] },
        { case: 'Nominative', number: 'Singular', gender: 'Neuter', answers: ['id'] }, { case: 'Genitive', number: 'Singular', gender: 'Neuter', answers: ['eius', 'ēius'] }, { case: 'Dative', number: 'Singular', gender: 'Neuter', answers: ['ei', 'eī'] }, { case: 'Accusative', number: 'Singular', gender: 'Neuter', answers: ['id'] }, { case: 'Ablative', number: 'Singular', gender: 'Neuter', answers: ['eo', 'eō'] },
        { case: 'Nominative', number: 'Plural', gender: 'Masculine', answers: ['ei', 'eī', 'ii', 'iī'] }, { case: 'Genitive', number: 'Plural', gender: 'Masculine', answers: ['eorum', 'eōrum'] }, { case: 'Dative', number: 'Plural', gender: 'Masculine', answers: ['eis', 'eīs', 'iis', 'iīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Masculine', answers: ['eos', 'eōs'] }, { case: 'Ablative', number: 'Plural', gender: 'Masculine', answers: ['eis', 'eīs', 'iis', 'iīs'] },
        { case: 'Nominative', number: 'Plural', gender: 'Feminine', answers: ['eae'] }, { case: 'Genitive', number: 'Plural', gender: 'Feminine', answers: ['earum', 'eārum'] }, { case: 'Dative', number: 'Plural', gender: 'Feminine', answers: ['eis', 'eīs', 'iis', 'iīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Feminine', answers: ['eas', 'eās'] }, { case: 'Ablative', number: 'Plural', gender: 'Feminine', answers: ['eis', 'eīs', 'iis', 'iīs'] },
        { case: 'Nominative', number: 'Plural', gender: 'Neuter', answers: ['ea'] }, { case: 'Genitive', number: 'Plural', gender: 'Neuter', answers: ['eorum', 'eōrum'] }, { case: 'Dative', number: 'Plural', gender: 'Neuter', answers: ['eis', 'eīs', 'iis', 'iīs'] }, { case: 'Accusative', number: 'Plural', gender: 'Neuter', answers: ['ea'] }, { case: 'Ablative', number: 'Plural', gender: 'Neuter', answers: ['eis', 'eīs', 'iis', 'iīs'] }
    ],
    unus: generateUnusNauta('un', ['unus', 'ūnus'], ['una', 'ūna'], ['unum', 'ūnum'], ['unius', 'unīus'], ['uni', 'unī']),
    nullus: generateUnusNauta('null', ['nullus'], ['nulla'], ['nullum'], ['nullius', 'nullīus'], ['nulli', 'nullī']),
    ullus: generateUnusNauta('ull', ['ullus'], ['ulla'], ['ullum'], ['ullius', 'ullīus'], ['ulli', 'ullī']),
    solus: generateUnusNauta('sol', ['solus', 'sōlus'], ['sola', 'sōla'], ['solum', 'sōlum'], ['solius', 'solīus'], ['soli', 'solī']),
    neuter: generateUnusNauta('neutr', ['neuter'], ['neutra'], ['neutrum'], ['neutrius', 'neutrīus'], ['neutri', 'neutrī']),
    alius: generateUnusNauta('ali', ['alius'], ['alia'], ['aliud'], ['alius', 'alīus', 'alterius', 'alterīus'], ['alii', 'aliī']),
    uter: generateUnusNauta('utr', ['uter'], ['utra'], ['utrum'], ['utrius', 'utrīus'], ['utri', 'utrī']),
    totus: generateUnusNauta('tot', ['totus', 'tōtus'], ['tota', 'tōta'], ['totum', 'tōtum'], ['totius', 'tōtīus'], ['toti', 'tōtī']),
    alter: generateUnusNauta('alter', ['alter'], ['altera'], ['alterum'], ['alterius', 'alterīus'], ['alteri', 'alterī'])
};

// State Variables
let currentWord = 'hic';
let activeParadigm = paradigms[currentWord];
let currentQuestion = null;

// DOM Elements
const chartInputs = document.querySelectorAll('#chart-mode input');
const wordTitle = document.getElementById('current-word-title');
const wordSelectBtns = document.querySelectorAll('.word-select');

// Map Data Answers to HTML Chart
function mapParadigmToChart() {
    chartInputs.forEach(input => {
        const c = input.dataset.case;
        const n = input.dataset.number;
        const g = input.dataset.gender;
        
        const matchedForm = activeParadigm.find(item => 
            item.case === c && item.number === n && item.gender === g
        );
        
        if (matchedForm) {
            input.dataset.answers = matchedForm.answers.join(',');
        }
        
        input.value = '';
        input.classList.remove('correct', 'incorrect');
    });
}

// Word Selection Logic (BUG FIX APPLIED HERE)
wordSelectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Because of the spans, we must reference 'btn' (the button the listener is attached to) 
        // rather than 'e.target' (which might be the inner span text).
        
        wordSelectBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active'); 
        
        currentWord = btn.dataset.word;
        activeParadigm = paradigms[currentWord];
        
        // Use innerHTML instead of textContent so the bold/italic spans transfer directly to the title
        wordTitle.innerHTML = btn.innerHTML; 
        
        mapParadigmToChart();
        loadQuizQuestion();
    });
});

// Mode Switching Logic
const modeChartBtn = document.getElementById('mode-chart-btn');
const modeQuizBtn = document.getElementById('mode-quiz-btn');
const chartView = document.getElementById('chart-mode');
const quizView = document.getElementById('quiz-mode');

modeChartBtn.addEventListener('click', () => {
    chartView.classList.remove('hidden');
    quizView.classList.add('hidden');
    modeChartBtn.classList.add('active');
    modeQuizBtn.classList.remove('active');
});

modeQuizBtn.addEventListener('click', () => {
    quizView.classList.remove('hidden');
    chartView.classList.add('hidden');
    modeQuizBtn.classList.add('active');
    modeChartBtn.classList.remove('active');
    loadQuizQuestion();
});

// Chart Checking Logic
const checkChartBtn = document.getElementById('check-chart-btn');
const clearChartBtn = document.getElementById('clear-chart-btn');

checkChartBtn.addEventListener('click', () => {
    chartInputs.forEach(input => {
        const userAnswer = input.value.trim().toLowerCase();
        const validAnswers = input.dataset.answers.split(',');
        
        input.classList.remove('correct', 'incorrect');
        
        if (userAnswer === '') return; 
        
        if (validAnswers.includes(userAnswer)) {
            input.classList.add('correct');
        } else {
            input.classList.add('incorrect');
        }
    });
});

clearChartBtn.addEventListener('click', () => {
    chartInputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
    });
    chartInputs[0].focus();
});

chartInputs.forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('correct', 'incorrect');
    });
});

// Quiz Mode Logic
const quizEls = {
    questionText: document.getElementById('question-text'),
    inputField: document.getElementById('quiz-input'),
    submitBtn: document.getElementById('quiz-submit-btn'),
    feedbackMessage: document.getElementById('quiz-feedback'),
    nextBtn: document.getElementById('quiz-next-btn')
};

function loadQuizQuestion() {
    currentQuestion = activeParadigm[Math.floor(Math.random() * activeParadigm.length)];
    quizEls.questionText.textContent = `${currentQuestion.gender} ${currentQuestion.case} ${currentQuestion.number}`;
    quizEls.inputField.value = '';
    quizEls.inputField.focus();
    quizEls.feedbackMessage.textContent = '';
    quizEls.feedbackMessage.className = '';
    
    quizEls.submitBtn.classList.remove('hidden');
    quizEls.nextBtn.classList.add('hidden');
}

function checkQuizAnswer() {
    const userAnswer = quizEls.inputField.value.trim().toLowerCase();
    
    if (currentQuestion.answers.includes(userAnswer)) {
        quizEls.feedbackMessage.textContent = "Optime! Correct.";
        quizEls.feedbackMessage.className = "text-correct";
    } else {
        const primaryAnswer = currentQuestion.answers[currentQuestion.answers.length - 1];
        quizEls.feedbackMessage.textContent = `Incorrect. The correct form is: ${primaryAnswer}`;
        quizEls.feedbackMessage.className = "text-incorrect";
    }

    quizEls.submitBtn.classList.add('hidden');
    quizEls.nextBtn.classList.remove('hidden');
    quizEls.nextBtn.focus();
}

quizEls.submitBtn.addEventListener('click', checkQuizAnswer);
quizEls.nextBtn.addEventListener('click', loadQuizQuestion);
quizEls.inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkQuizAnswer();
});

// Initialize first run
mapParadigmToChart();
loadQuizQuestion();