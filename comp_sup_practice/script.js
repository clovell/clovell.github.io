/* --- CONFIGURATION & DATA --- */

// Teacher: Edit this list. 
// 'base': The stem used for regular forms.
// 'nom_sg': Required for 'rimus' rule (pulcher -> pulcherrimus).
// 'special': 'rimus' (for -er adjs), 'limus' (for facilis/similis), or null.
const adjectives = [
    { 
        dict: 'longus, -a, -um', 
        base: 'long', 
        nom_sg: 'longus', 
        special: null 
    },
    { 
        dict: 'altus, -a, -um', 
        base: 'alt', 
        nom_sg: 'altus', 
        special: null 
    },
    { 
        dict: 'pulcher, pulchra, pulchrum', 
        base: 'pulchr', 
        nom_sg: 'pulcher', 
        special: 'rimus' 
    },
    { 
        dict: 'miser, misera, miserum', 
        base: 'miser', 
        nom_sg: 'miser', 
        special: 'rimus' 
    },
    { 
        dict: 'facilis, facile', 
        base: 'facil', 
        nom_sg: 'facilis', 
        special: 'limus' 
    },
    { 
        dict: 'fortis, forte', 
        base: 'fort', 
        nom_sg: 'fortis', 
        special: null 
    }
];

// Morphology Endings
const endings = {
    // Superlative uses 1st/2nd declension endings
    superlative: {
        m: ['us', 'ī', 'ō', 'um', 'ō', 'ī', 'ōrum', 'īs', 'ōs', 'īs'],
        f: ['a', 'ae', 'ae', 'am', 'ā', 'ae', 'ārum', 'īs', 'ās', 'īs'],
        n: ['um', 'ī', 'ō', 'um', 'ō', 'a', 'ōrum', 'īs', 'a', 'īs']
    },
    // Comparative uses 3rd declension endings
    comparative: {
        mf: ['', 'is', 'ī', 'em', 'e', 'ēs', 'um', 'ibus', 'ēs', 'ibus'],
        n:  ['', 'is', 'ī', '', 'e', 'a', 'um', 'ibus', 'a', 'ibus'] 
    }
};

const cases = ['Nom', 'Gen', 'Dat', 'Acc', 'Abl'];
const numbers = ['Sg', 'Pl'];
const genders = ['M', 'F', 'N'];

/* --- STATE MANAGEMENT --- */

let currentFormationQ = null;
let currentInflectionQ = null;

/* --- UTILITIES --- */

function cleanString(str) {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* --- LOGIC ENGINE --- */

function generateCorrectForm(adj, degree, gender, caseIdx, numIdx) {
    
    // --- 1. SUPERLATIVE GENERATION ---
    if (degree === 'Superlative') {
        let superStem = '';

        if (adj.special === 'rimus') {
            // Rule: Add -rimus to the Nominative Singular Masculine
            // e.g., pulcher -> pulcherrimus
            superStem = adj.nom_sg + 'rim';
        } else if (adj.special === 'limus') {
            // Rule: Add -limus to the Base
            // e.g., facil -> facillimus
            superStem = adj.base + 'lim';
        } else {
            // Regular Rule: Add -issimus to the Base
            // e.g., long -> longissimus
            superStem = adj.base + 'issim';
        }

        const endingTable = endings.superlative[gender.toLowerCase()];
        const index = numIdx === 0 ? caseIdx : caseIdx + 5;
        return superStem + endingTable[index];
    }

    // --- 2. COMPARATIVE GENERATION ---
    if (degree === 'Comparative') {
        let compStem = '';
        let endingTable = [];
        
        // Comparative Stem is always Base + ior (M/F) or Base + ius (N)
        if (gender === 'N') {
            compStem = adj.base + 'ius';
            endingTable = endings.comparative.n;
        } else {
            compStem = adj.base + 'ior';
            endingTable = endings.comparative.mf;
        }

        const index = numIdx === 0 ? caseIdx : caseIdx + 5;
        
        // Special Handling for N Acc Sg (which must match Nom Sg)
        // In 3rd declension neuter, Nom and Acc are identical (-ius)
        if (gender === 'N' && caseIdx === 3 && numIdx === 0) {
           return compStem; // "longius"
        }

        return compStem + endingTable[index];
    }
    
    return "Error";
}

/* --- UI FUNCTIONS --- */

function setMode(mode) {
    document.querySelectorAll('main section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('main section').forEach(el => el.classList.remove('active-section'));
    
    document.getElementById(mode + '-mode').classList.remove('hidden');
    document.getElementById(mode + '-mode').classList.add('active-section');

    if (mode === 'formation') nextFormationQuestion();
    if (mode === 'inflection') nextInflectionQuestion();
}

/* --- LEVEL I: FORMATION QUIZ --- */

function nextFormationQuestion() {
    const adj = getRandom(adjectives);
    const degree = Math.random() > 0.5 ? 'Comparative' : 'Superlative';
    
    // For Level 1, we just ask for Nom Sg Masculine to keep it simple,
    // or we can randomize gender. Let's stick to Masculine Nom Sg for clarity in basic formation.
    const gender = 'M'; 
    const target = generateCorrectForm(adj, degree, gender, 0, 0); 

    currentFormationQ = { target: target, adj: adj, degree: degree };

    document.getElementById('f-adj-display').innerText = adj.dict;
    document.getElementById('f-target-display').innerText = `Make ${degree} (Nom Sg M)`;
    document.getElementById('f-user-input').value = '';
    document.getElementById('f-feedback').innerText = '';
    document.getElementById('f-feedback').className = 'feedback';
    document.querySelector('#formation-question-box .next-btn').style.display = 'none';
}

function checkFormation() {
    const userIn = document.getElementById('f-user-input').value;
    const isCorrect = cleanString(userIn) === cleanString(currentFormationQ.target);
    const fb = document.getElementById('f-feedback');

    if (isCorrect) {
        fb.innerHTML = `Rectē! The answer is <strong>${currentFormationQ.target}</strong>.`;
        fb.className = 'feedback correct';
    } else {
        fb.innerHTML = `Nōn bene. The correct form was <strong>${currentFormationQ.target}</strong>.`;
        fb.className = 'feedback incorrect';
    }
    document.querySelector('#formation-question-box .next-btn').style.display = 'inline-block';
}

/* --- LEVEL II: INFLECTION QUIZ --- */

function nextInflectionQuestion() {
    const adj = getRandom(adjectives);
    const degree = Math.random() > 0.5 ? 'Comparative' : 'Superlative';
    const gender = getRandom(genders);
    const caseName = getRandom(cases);
    const caseIdx = cases.indexOf(caseName);
    const numName = getRandom(numbers);
    const numIdx = numbers.indexOf(numName);

    const target = generateCorrectForm(adj, degree, gender, caseIdx, numIdx);

    currentInflectionQ = { target: target };

    document.getElementById('i-adj-display').innerText = adj.dict;
    document.getElementById('i-params-display').innerText = `${degree} | ${gender} ${caseName} ${numName}`;
    document.getElementById('i-user-input').value = '';
    document.getElementById('i-feedback').innerText = '';
    document.getElementById('i-feedback').className = 'feedback';
    document.querySelector('#inflection-question-box .next-btn').style.display = 'none';
}

function checkInflection() {
    const userIn = document.getElementById('i-user-input').value;
    const isCorrect = cleanString(userIn) === cleanString(currentInflectionQ.target);
    const fb = document.getElementById('i-feedback');

    if (isCorrect) {
        fb.innerHTML = `Optimē! The answer is <strong>${currentInflectionQ.target}</strong>.`;
        fb.className = 'feedback correct';
    } else {
        fb.innerHTML = `Errāvistī. The correct form was <strong>${currentInflectionQ.target}</strong>.`;
        fb.className = 'feedback incorrect';
    }
    document.querySelector('#inflection-question-box .next-btn').style.display = 'inline-block';
}

// Initialize
setMode('tutorial');