const cases = ['nom', 'gen', 'dat', 'acc', 'abl', 'voc'];
const numbers = ['sg', 'pl'];
const caseLabels = ['Nominative', 'Genitive', 'Dative', 'Accusative', 'Ablative', 'Vocative'];

let currentNoun = null;
let currentQuizKey = null;
let perfectChartsCount = 0;
let currentStreak = 0;
let hasChecked = false;

function switchMode(mode) {
    document.getElementById('chart-mode').classList.remove('active');
    document.getElementById('quiz-mode').classList.remove('active');
    document.getElementById('btn-chart').classList.remove('active');
    document.getElementById('btn-quiz').classList.remove('active');

    document.getElementById(`${mode}-mode`).classList.add('active');
    document.getElementById(`btn-${mode}`).classList.add('active');

    if (mode === 'chart') loadNewChart();
    if (mode === 'quiz') loadNewQuiz();
}

function removeMacrons(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isCorrect(userInput, correctAnswer) {
    const input = userInput.trim().toLowerCase();
    const answer = correctAnswer.toLowerCase();
    const hasMacrons = /[āēīōūĀĒĪŌŪ]/.test(input);

    return hasMacrons ? input === answer : input === removeMacrons(answer);
}

function getRandomNoun() {
    return vocabulary[Math.floor(Math.random() * vocabulary.length)];
}

function loadNewChart() {
    currentNoun = getRandomNoun();
    hasChecked = false;
    
    document.getElementById('btn-next').style.display = 'none';
    document.getElementById('chart-lemma').innerText = currentNoun.lemma;
    
    const tbody = document.getElementById('chart-body');
    tbody.innerHTML = '';

    const includeVocative = document.getElementById('vocative-toggle').checked;
    const activeCases = includeVocative ? cases : cases.slice(0, 5);

    let tabIndexSg = 1;
    let tabIndexPl = activeCases.length + 1;

    activeCases.forEach((c, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <th>${caseLabels[index]}</th>
            <td><input type="text" data-key="${c}_sg" tabindex="${tabIndexSg++}" autocomplete="off"></td>
            <td><input type="text" data-key="${c}_pl" tabindex="${tabIndexPl++}" autocomplete="off"></td>
        `;
        tbody.appendChild(tr);
    });

    const inputs = document.querySelectorAll('#chart-body input');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const allFilled = Array.from(inputs).every(inp => inp.value.trim() !== '');
            if (allFilled) checkChart();
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkChart();
        });
    });
}

function checkChart() {
    const inputs = document.querySelectorAll('#chart-body input');
    let allCorrect = true;
    let anyEmpty = false;

    document.getElementById('btn-next').style.display = 'block';

    inputs.forEach(input => {
        const key = input.getAttribute('data-key');
        const correctAnswer = currentNoun.forms[key];
        
        input.classList.remove('correct', 'incorrect');
        
        if (input.value.trim() === '') {
            allCorrect = false;
            anyEmpty = true;
            return;
        }

        if (isCorrect(input.value, correctAnswer)) {
            input.classList.add('correct');
        } else {
            input.classList.add('incorrect');
            allCorrect = false;
        }
    });

    if (!hasChecked) {
        hasChecked = true;
        if (allCorrect && !anyEmpty && inputs.length > 0) {
            perfectChartsCount++;
            currentStreak++;
        } else {
            currentStreak = 0;
        }
        document.getElementById('score-count').innerText = perfectChartsCount;
        document.getElementById('streak-count').innerText = currentStreak;
    }
}

function loadNewQuiz() {
    currentNoun = getRandomNoun();
    
    const includeVocative = document.getElementById('vocative-toggle').checked;
    const activeCases = includeVocative ? cases : cases.slice(0, 5);
    
    const randomCase = activeCases[Math.floor(Math.random() * activeCases.length)];
    const randomNum = numbers[Math.floor(Math.random() * numbers.length)];
    currentQuizKey = `${randomCase}_${randomNum}`;

    const caseIndex = cases.indexOf(randomCase);
    const numLabel = randomNum === 'sg' ? 'singular' : 'plural';
    
    document.getElementById('quiz-prompt').innerHTML = `Provide the <strong>${caseLabels[caseIndex].toLowerCase()} ${numLabel}</strong> of <em>${currentNoun.lemma}</em>`;
    
    const inputField = document.getElementById('quiz-input');
    inputField.value = '';
    inputField.classList.remove('correct', 'incorrect');
    inputField.focus();
    
    document.getElementById('quiz-feedback').innerText = '';
}

function checkQuiz() {
    const inputField = document.getElementById('quiz-input');
    const feedback = document.getElementById('quiz-feedback');
    const correctAnswer = currentNoun.forms[currentQuizKey];

    inputField.classList.remove('correct', 'incorrect');

    if (inputField.value.trim() === '') return;

    if (isCorrect(inputField.value, correctAnswer)) {
        inputField.classList.add('correct');
        feedback.innerText = 'Correct!';
        feedback.style.color = '#34a853';
    } else {
        inputField.classList.add('incorrect');
        feedback.innerHTML = `Incorrect. The correct form is <strong>${correctAnswer}</strong>.`;
        feedback.style.color = '#ea4335';
    }
}

window.onload = loadNewChart;