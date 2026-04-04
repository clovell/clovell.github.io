const personsFull = [
    "1st person singular", "2nd person singular", "3rd person singular", 
    "1st person plural", "2nd person plural", "3rd person plural"
];

const standardEndings = ["ō / m", "s", "t", "mus", "tis", "nt"];

let currentVerb = { forms: {}, personIndex: 0 };
let isGuidedMode = false;

const tag = (text, type) => `<span class="${type}">${text}</span>`;

// Vowel shortener for generation
function shortVowel(v) {
    const map = { 'ā':'a', 'ē':'e', 'ī':'i', 'ō':'o', 'ū':'u', 'iē':'ie', 'iū':'iu' };
    return map[v] || v;
}

// Strip HTML tags to get pure text form
function stripTags(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

// Normalize student input vs required answer (ignore macrons)
function normalizeLatin(str) {
    return str.toLowerCase().replace(/[āá]/g,'a').replace(/[ēé]/g,'e').replace(/[īí]/g,'i').replace(/[ōó]/g,'o').replace(/[ūú]/g,'u').trim();
}

document.addEventListener('DOMContentLoaded', () => {
    const newBtn = document.getElementById('new-verb-btn');
    if (newBtn) {
        newBtn.addEventListener('click', () => {
            document.getElementById('mode-buttons').style.display = 'block';
            document.getElementById('step-0-verb-display').classList.add('hidden');
            document.getElementById('step-0-arrow').classList.add('hidden');
            scrollToCard('step-0'); 
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const nav = document.getElementById('controls');
            if (entry.isIntersecting) nav.classList.add('hidden-nav');
            else nav.classList.remove('hidden-nav');
        });
    }, { threshold: 0.5 });
    observer.observe(document.getElementById('step-0'));
});

function startTutorial(guided) {
    isGuidedMode = guided;
    generateVerb();
    document.getElementById('mode-buttons').style.display = 'none';
    document.getElementById('step-0-verb-display').classList.remove('hidden');
    document.getElementById('step-0-arrow').classList.remove('hidden');
}

function scrollToCard(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function getConjugation(pp1, pp2) {
    if (pp2.endsWith('āre')) return 1;
    if (pp2.endsWith('ere') || pp2.endsWith('ēre')) {
        if (pp1.endsWith('iō')) return 3.5;
        if (pp1.endsWith('eō')) return 2;
        return 3;
    }
    if (pp2.endsWith('īre')) return 4;
    return 3; 
}

function generateVerb() {
    const rawVerb = verbs[Math.floor(Math.random() * verbs.length)];
    const conj = getConjugation(rawVerb.parts[0], rawVerb.parts[1]);
    const base = rawVerb.parts[1].slice(0, -3); 

    currentVerb = {
        pp1: rawVerb.parts[0], pp2: rawVerb.parts[1], pp3: rawVerb.parts[2], pp4: rawVerb.parts[3],
        trans: rawVerb.trans, conjugation: conj, presentBase: base, perfectStem: rawVerb.parts[2].slice(0, -1),
        personIndex: Math.floor(Math.random() * 6), forms: {}
    };

    updateUI();
}

function updateUI() {
    const setText = (id, text) => { const el = document.getElementById(id); if(el) el.textContent = text; };
    const setHTML = (id, html) => { const el = document.getElementById(id); if(el) el.innerHTML = html; };

    const verbString = `${currentVerb.pp1}, ${currentVerb.pp2}, ${currentVerb.pp3}, ${currentVerb.pp4} - "${currentVerb.trans}"`;
    const targetLabel = `${personsFull[currentVerb.personIndex]}`;
    
    setText('current-verb-display', verbString);
    setText('target-form-display', targetLabel);
    
    setHTML('s0-parts', `${currentVerb.pp1}, ${currentVerb.pp2}, ${currentVerb.pp3}, ${currentVerb.pp4}`);
    setText('s0-trans', `"${currentVerb.trans}"`);
    setText('s0-target', targetLabel);

    // Step 1: Personal Endings
    setText('s1-person-target', personsFull[currentVerb.personIndex]);
    setText('s1-ending', `-${standardEndings[currentVerb.personIndex]}`);

    // Step 2: ID
    let pp1Display = currentVerb.pp1;
    if (currentVerb.pp1.endsWith('iō')) {
        pp1Display = currentVerb.pp1.replace('iō', '<span style="color:var(--highlight); font-weight:bold;">iō</span>');
    }
    setHTML('pp-display', `
        <div style="font-family: var(--font-latin); font-size: 1.3rem; margin-bottom:1rem;">
            ${pp1Display}, <span class="circled">${currentVerb.pp2}</span>, ${currentVerb.pp3}, ${currentVerb.pp4}
        </div>
        <p style="font-size:0.9rem; color:#666; margin-top:1rem;">Look at the <strong>2nd Principal Part</strong>. Check if the 1st Principal Part ends in <strong>-iō</strong>.</p>
    `);
    
    const conjOrder = [{ id: 1, label: '1st (-āre)' }, { id: 2, label: '2nd (-ēre)' }, { id: 3, label: '3rd (-ere)' }, { id: 3.5, label: '3rd-io (-ere + -iō)' }, { id: 4, label: '4th (-īre)' }];
    let flowHtml = '';
    conjOrder.forEach(item => { flowHtml += `<div class="flow-node ${(item.id === currentVerb.conjugation) ? 'active' : ''}">${item.label}</div>`; });
    setHTML('conj-flowchart', flowHtml);

    // Steps 3 & 7 Stems
    let subText = (currentVerb.conjugation === 3 || currentVerb.conjugation === 3.5) ? 'ere' : 're';
    setText('step3-infinitive', currentVerb.pp2);
    setText('step3-base', currentVerb.presentBase + '-'); 
    const step3 = document.getElementById('step-3');
    if(step3) step3.querySelector('.strike').textContent = subText;

    setText('step7-3pp', currentVerb.pp3);
    setText('step7-stem', currentVerb.perfectStem + '-'); 
    setText('final-target-badge', targetLabel);

    buildPresent(); buildImperfect(); buildFuture(); buildPerfect(); buildPluperfect(); buildFuturePerfect();
    renderMasterTable();
}

// Validation logic for Guided Mode
function checkAnswer(btn, tableId) {
    const input = btn.previousElementSibling;
    const feedback = btn.nextElementSibling;
    const targetFormText = input.getAttribute('data-answer');
    const displayHTML = input.getAttribute('data-html');
    
    if (normalizeLatin(input.value) === normalizeLatin(targetFormText)) {
        // Correct - Reveal Form
        btn.parentElement.innerHTML = displayHTML;
    } else {
        // Incorrect
        feedback.innerHTML = `<span class="feedback-incorrect">Not quite. Look closely at the hint!</span>`;
    }
}

function renderSingleRow(id, formHTML) {
    const table = document.getElementById(id);
    if (!table) return;
    
    const plainForm = stripTags(formHTML);

    if (isGuidedMode) {
        table.innerHTML = `
            <tr>
                <td style="width:45%">${personsFull[currentVerb.personIndex]}</td>
                <td>
                    <input type="text" class="guided-input" data-answer="${plainForm}" data-html='${formHTML}' placeholder="Type form...">
                    <button class="check-btn" onclick="checkAnswer(this, '${id}')">Check</button>
                    <div class="feedback-msg"></div>
                </td>
            </tr>`;
    } else {
        table.innerHTML = `<tr><td style="width:45%">${personsFull[currentVerb.personIndex]}</td><td>${formHTML}</td></tr>`;
    }
}

function buildPresent() {
    const endings = ["m", "s", "t", "mus", "tis", "nt"];
    let forms = [];
    const base = tag(currentVerb.presentBase, 'stem');
    const c = currentVerb.conjugation;

    let hint = (c === 1) ? "1st conj. keeps thematic 'ā' (except 1st sg merges to 'ō')." : 
               (c === 2) ? "2nd conj. keeps thematic 'ē'." : 
               (c === 3) ? "3rd conj. uses connecting 'i' (becomes 'u' in 3rd pl)." : 
               "3rd-io/4th conj. use 'ī' or 'i', becoming 'iu' in 3rd pl.";
    document.getElementById('hint-present').textContent = "Vowel Hint: " + hint;

    forms.push(tag(currentVerb.pp1, 'stem')); 

    for (let i = 1; i < 6; i++) {
        let v = (c === 1) ? 'ā' : (c === 2) ? 'ē' : (c === 3) ? ((i === 5) ? 'u' : 'i') : (c === 3.5) ? ((i === 5) ? 'iu' : 'i') : ((i === 5) ? 'iu' : 'ī');
        let displayV = (i === 2 || i === 5) ? shortVowel(v) : v;
        forms.push(base + tag(displayV, 'vowel') + tag(endings[i], 'ending'));
    }
    
    currentVerb.forms.present = forms[currentVerb.personIndex];
    renderSingleRow('table-present', currentVerb.forms.present);
}

function buildImperfect() {
    const endings = ["m", "s", "t", "mus", "tis", "nt"];
    let forms = [];
    const base = tag(currentVerb.presentBase, 'stem');
    const c = currentVerb.conjugation;
    let v = (c === 1) ? 'ā' : (c === 2 || c === 3) ? 'ē' : 'iē';

    let hint = `This conjugation needs the vowel '${v}' before the tense marker.`;
    document.getElementById('hint-imperfect').textContent = "Vowel Hint: " + hint;
    document.getElementById('imp-stem').innerHTML = currentVerb.presentBase + tag(v, 'vowel');

    for (let i = 0; i < 6; i++) {
        let tense = (i === 0 || i === 2 || i === 5) ? 'ba' : 'bā';
        forms.push(`${base}${tag(v, 'vowel')}${tag(tense, 'tense')}${tag(endings[i], 'ending')}`);
    }
    currentVerb.forms.imperfect = forms[currentVerb.personIndex];
    renderSingleRow('table-imperfect', currentVerb.forms.imperfect);
}

function buildFuture() {
    const isBoBiBu = (currentVerb.conjugation === 1 || currentVerb.conjugation === 2);
    let forms = [];
    const base = tag(currentVerb.presentBase, 'stem');
    const c = currentVerb.conjugation;
    
    document.getElementById('future-rule-1').className = isBoBiBu ? 'split-side active' : 'split-side';
    document.getElementById('future-rule-2').className = !isBoBiBu ? 'split-side active' : 'split-side';

    let hint = isBoBiBu ? "Notice the tense marker changes: bō, bi, bi, bi, bi, bu." : "Notice the connecting vowels: 'a' in the 1st singular, and 'ē' everywhere else.";
    document.getElementById('hint-future').textContent = "Vowel Hint: " + hint;

    if (isBoBiBu) {
        let v = (c === 1) ? 'ā' : 'ē';
        forms.push(base + tag(v, 'vowel') + tag('bō', 'tense')); 
        forms.push(base + tag(v, 'vowel') + tag('bi', 'tense') + tag('s', 'ending'));
        forms.push(base + tag(v, 'vowel') + tag('bi', 'tense') + tag('t', 'ending'));
        forms.push(base + tag(v, 'vowel') + tag('bi', 'tense') + tag('mus', 'ending'));
        forms.push(base + tag(v, 'vowel') + tag('bi', 'tense') + tag('tis', 'ending'));
        forms.push(base + tag(v, 'vowel') + tag('bu', 'tense') + tag('nt', 'ending'));
    } else {
        let v = (c === 3.5 || c === 4) ? 'i' : '';
        forms.push(base + tag(v, 'vowel') + tag('a', 'tense') + tag('m', 'ending'));
        const endings = ["s", "t", "mus", "tis", "nt"];
        for (let i = 0; i < 5; i++) {
            let tenseVowel = (i + 1 === 2 || i + 1 === 5) ? 'e' : 'ē';
            forms.push(base + tag(v, 'vowel') + tag(tenseVowel, 'tense') + tag(endings[i], 'ending'));
        }
    }
    currentVerb.forms.future = forms[currentVerb.personIndex];
    renderSingleRow('table-future', currentVerb.forms.future);
}

function buildPerfect() {
    const endings = ["ī", "istī", "it", "imus", "istis", "ērunt"];
    const base = tag(currentVerb.perfectStem, 'perf-stem');
    const forms = endings.map(e => `${base}${tag(e, 'ending')}`);
    currentVerb.forms.perfect = forms[currentVerb.personIndex];
    renderSingleRow('table-perfect', currentVerb.forms.perfect);
}

function buildPluperfect() {
    const base = tag(currentVerb.perfectStem, 'perf-stem');
    const endings = ["m", "s", "t", "mus", "tis", "nt"];
    let forms = [];
    for (let i = 0; i < 6; i++) {
        let tense = (i === 0 || i === 2 || i === 5) ? 'era' : 'erā';
        forms.push(`${base}${tag(tense, 'tense')}${tag(endings[i], 'ending')}`);
    }
    currentVerb.forms.pluperfect = forms[currentVerb.personIndex];
    renderSingleRow('table-pluperfect', currentVerb.forms.pluperfect);
}

function buildFuturePerfect() {
    const base = tag(currentVerb.perfectStem, 'perf-stem');
    const endings = ["ō", "s", "t", "mus", "tis", "nt"];
    let forms = [];
    for (let i = 0; i < 6; i++) {
        let tense = (i === 0) ? 'er' : 'eri';
        forms.push(`${base}${tag(tense, 'tense')}${tag(endings[i], 'ending')}`);
    }
    currentVerb.forms.futureperfect = forms[currentVerb.personIndex];
    renderSingleRow('table-futureperfect', currentVerb.forms.futureperfect);
}

function renderMasterTable() {
    const table = document.getElementById('table-master');
    if (!table) return;
    
    // In Guided Mode, only reveal the master table if they made it to the end
    let content = `
        <thead><tr><th>Pres</th><th>Imp</th><th>Fut</th><th>Perf</th><th>Plup</th><th>FutP</th></tr></thead>
        <tbody>
            <tr>
                <td>${isGuidedMode ? stripTags(currentVerb.forms.present) : currentVerb.forms.present}</td>
                <td>${isGuidedMode ? stripTags(currentVerb.forms.imperfect) : currentVerb.forms.imperfect}</td>
                <td>${isGuidedMode ? stripTags(currentVerb.forms.future) : currentVerb.forms.future}</td>
                <td>${isGuidedMode ? stripTags(currentVerb.forms.perfect) : currentVerb.forms.perfect}</td>
                <td>${isGuidedMode ? stripTags(currentVerb.forms.pluperfect) : currentVerb.forms.pluperfect}</td>
                <td>${isGuidedMode ? stripTags(currentVerb.forms.futureperfect) : currentVerb.forms.futureperfect}</td>
            </tr>
        </tbody>
    `;
    table.innerHTML = content;
}