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

// Chart Mode Logic
const checkChartBtn = document.getElementById('check-chart-btn');
const clearChartBtn = document.getElementById('clear-chart-btn');
const chartInputs = document.querySelectorAll('#chart-mode input');

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
const paradigm = [
    { case: 'Nominative', number: 'Singular', gender: 'Masculine', answers: ['hic'] },
    { case: 'Genitive', number: 'Singular', gender: 'Masculine', answers: ['huius', 'hūius'] },
    { case: 'Dative', number: 'Singular', gender: 'Masculine', answers: ['huic'] },
    { case: 'Accusative', number: 'Singular', gender: 'Masculine', answers: ['hunc'] },
    { case: 'Ablative', number: 'Singular', gender: 'Masculine', answers: ['hoc', 'hōc'] },
    { case: 'Nominative', number: 'Singular', gender: 'Feminine', answers: ['haec'] },
    { case: 'Genitive', number: 'Singular', gender: 'Feminine', answers: ['huius', 'hūius'] },
    { case: 'Dative', number: 'Singular', gender: 'Feminine', answers: ['huic'] },
    { case: 'Accusative', number: 'Singular', gender: 'Feminine', answers: ['hanc'] },
    { case: 'Ablative', number: 'Singular', gender: 'Feminine', answers: ['hac', 'hāc'] },
    { case: 'Nominative', number: 'Singular', gender: 'Neuter', answers: ['hoc'] },
    { case: 'Genitive', number: 'Singular', gender: 'Neuter', answers: ['huius', 'hūius'] },
    { case: 'Dative', number: 'Singular', gender: 'Neuter', answers: ['huic'] },
    { case: 'Accusative', number: 'Singular', gender: 'Neuter', answers: ['hoc'] },
    { case: 'Ablative', number: 'Singular', gender: 'Neuter', answers: ['hoc', 'hōc'] },
    { case: 'Nominative', number: 'Plural', gender: 'Masculine', answers: ['hi', 'hī'] },
    { case: 'Genitive', number: 'Plural', gender: 'Masculine', answers: ['horum', 'hōrum'] },
    { case: 'Dative', number: 'Plural', gender: 'Masculine', answers: ['his', 'hīs'] },
    { case: 'Accusative', number: 'Plural', gender: 'Masculine', answers: ['hos', 'hōs'] },
    { case: 'Ablative', number: 'Plural', gender: 'Masculine', answers: ['his', 'hīs'] },
    { case: 'Nominative', number: 'Plural', gender: 'Feminine', answers: ['hae'] },
    { case: 'Genitive', number: 'Plural', gender: 'Feminine', answers: ['harum', 'hārum'] },
    { case: 'Dative', number: 'Plural', gender: 'Feminine', answers: ['his', 'hīs'] },
    { case: 'Accusative', number: 'Plural', gender: 'Feminine', answers: ['has', 'hās'] },
    { case: 'Ablative', number: 'Plural', gender: 'Feminine', answers: ['his', 'hīs'] },
    { case: 'Nominative', number: 'Plural', gender: 'Neuter', answers: ['haec'] },
    { case: 'Genitive', number: 'Plural', gender: 'Neuter', answers: ['horum', 'hōrum'] },
    { case: 'Dative', number: 'Plural', gender: 'Neuter', answers: ['his', 'hīs'] },
    { case: 'Accusative', number: 'Plural', gender: 'Neuter', answers: ['haec'] },
    { case: 'Ablative', number: 'Plural', gender: 'Neuter', answers: ['his', 'hīs'] }
];

let currentQuestion = null;
const quizEls = {
    questionText: document.getElementById('question-text'),
    inputField: document.getElementById('quiz-input'),
    submitBtn: document.getElementById('quiz-submit-btn'),
    feedbackMessage: document.getElementById('quiz-feedback'),
    nextBtn: document.getElementById('quiz-next-btn')
};

function loadQuizQuestion() {
    currentQuestion = paradigm[Math.floor(Math.random() * paradigm.length)];
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
        // Display the macronized version as the primary correct answer for pedagogical reinforcement
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

// Initialize on page load
loadQuizQuestion();