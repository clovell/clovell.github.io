(function () {
  // --- Configuration ---
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          serif: ['Merriweather', 'serif'],
          display: ['Cinzel', 'serif'],
        },
        colors: {
          roman: {
            red: '#8E1600',
            gold: '#C5A059',
            cream: '#F4F1EA',
            stone: '#2C2C2C'
          }
        }
      }
    }
  };

  // --- Setup React & HTM ---
  const { useState, useEffect } = React;
  const html = htm.bind(React.createElement);

  // --- Icons (Inline SVGs) ---
  const Icons = {
    Scroll: () => html`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 md:w-8 md:h-8 text-roman-gold">
        <path d="M8 2h2v20H8z"/><path d="M14 2h2v20h-2z"/><path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2"/><path d="M14 2h2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2"/>
      </svg>`,
    Info: () => html`
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
      </svg>`,
    ArrowRight: () => html`
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
      </svg>`,
    RotateCcw: () => html`
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
      </svg>`,
    CheckCircle: () => html`
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>
      </svg>`,
    Check: () => html`
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5"/>
      </svg>`,
    X: () => html`
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 18 12"/>
      </svg>`
  };

  // --- Helpers ---
  const normalizeLatin = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  };

  const checkAnswer = (input, correct) => {
    if (!input) return false;
    const cleanInput = input.trim().toLowerCase();
    const cleanCorrect = correct.trim().toLowerCase();
    const noMacronInput = normalizeLatin(cleanInput);
    const noMacronCorrect = normalizeLatin(cleanCorrect);

    if (cleanInput === cleanCorrect) return true;
    if (cleanInput === noMacronCorrect) return true;
    return false;
  };

  const checkEnglishTranslation = (input, verbDefinition, personKey) => {
    if (!input) return false;
    const lowerInput = input.toLowerCase().trim();
    
    // 1. Check for Future Tense marker
    const hasFuture = lowerInput.includes('will') || lowerInput.includes('shall') || lowerInput.includes("'ll");
    if (!hasFuture) return false;

    // 2. Check for Verb Meaning
    // Remove "to " from definition "to love" -> "love"
    const stems = verbDefinition.replace(/^to\s+/, '').split(',').map(s => s.trim().toLowerCase());
    const hasMeaning = stems.some(stem => lowerInput.includes(stem));
    if (!hasMeaning) return false;

    // 3. Check for Person (Pronoun)
    const pronouns = {
      s1: ['i'],
      s2: ['you'],
      s3: ['he', 'she', 'it', 'there'],
      p1: ['we'],
      p2: ['you', "y'all"],
      p3: ['they']
    };

    const allowedPronouns = pronouns[personKey] || [];
    const hasPronoun = allowedPronouns.some(p => {
       const regex = new RegExp(`\\b${p}\\b`, 'i');
       return regex.test(lowerInput);
    });

    return hasPronoun;
  };

  const getPersonLabel = (key) => {
    const map = {
      s1: '1st Singular (Ego)',
      s2: '2nd Singular (Tu)',
      s3: '3rd Singular (Is/Ea/Id)',
      p1: '1st Plural (Nos)',
      p2: '2nd Plural (Vos)',
      p3: '3rd Plural (Ei/Eae/Ea)',
    };
    return map[key];
  };

  // --- Components ---

  const Header = () => {
    return html`
      <header className="bg-roman-red text-roman-cream p-4 md:p-6 shadow-lg border-b-4 border-roman-gold relative">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <${Icons.Scroll} />
            <div>
              <h1 className="text-xl md:text-3xl font-display font-bold tracking-wider">FUTURUM</h1>
              <p className="text-[10px] md:text-xs font-serif italic text-roman-gold opacity-90">Active Voice Conjugation Trainer</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm opacity-80">
            <${Icons.Info} />
            <span>Use macrons (ā) or plain text (a)</span>
          </div>
        </div>
      </header>
    `;
  };

  const VerbCard = ({ verb, currentIndex, totalVerbs }) => {
    return html`
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-t-4 border-roman-stone mb-4 md:mb-6">
        <div className="flex justify-between items-start mb-2 md:mb-4">
          <!-- Hidden conjugation group hint to make user work for it -->
          <span className="text-roman-stone/50 px-2 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider border border-roman-stone/10 rounded">
             Active Voice
          </span>
          <span className="text-gray-400 text-xs md:text-sm font-mono">
             ${totalVerbs} Verbs
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-display font-bold text-roman-red mb-1 md:mb-2 break-words">${verb.infinitive}</h2>
        <p className="text-lg md:text-xl font-serif text-gray-700 italic mb-3 md:mb-4 break-words leading-tight">${verb.principalParts}</p>
        <div className="h-px w-full bg-gray-200 mb-3 md:mb-4"></div>
        <p className="text-base md:text-lg text-gray-800 font-bold">Definition: <span className="font-normal">${verb.definition}</span></p>
      </div>
    `;
  };

  const ConjugationCell = ({ label, value, status, correctValue, onChange, showReveal, subLabel }) => {
    const baseStyles = "w-full p-2 md:p-3 border-2 rounded-md font-serif text-base md:text-lg transition-all focus:outline-none focus:ring-2 focus:ring-roman-gold";
    let statusStyles = "border-gray-300 bg-white";
    if (status === 'correct') statusStyles = "border-green-600 bg-green-50 text-green-800";
    if (status === 'incorrect') statusStyles = "border-red-600 bg-red-50 text-red-800";

    return html`
      <div className="flex flex-col gap-1">
        <label className="flex justify-between items-baseline">
          <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wide truncate max-w-[70%]">${label}</span>
          ${subLabel ? html`<span className="text-[10px] md:text-sm font-serif italic text-roman-red truncate">${subLabel}</span>` : ''}
        </label>
        <input
          type="text"
          value=${value}
          onInput=${(e) => onChange(e.target.value)}
          className=${baseStyles + ' ' + statusStyles}
          placeholder="" 
          autoComplete="off"
          disabled=${showReveal && status === 'correct'}
        />
        ${showReveal && status !== 'correct' && html`
          <span className="text-sm font-bold text-roman-red animate-pulse">
            ${correctValue || 'Incorrect'}
          </span>
        `}
      </div>
    `;
  };

  const App = () => {
    const verbList = window.VERB_DATA || [];
    
    // Initialize with a random index
    const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * verbList.length));
    
    // Initialize state
    const [inputs, setInputs] = useState({ s1: '', s2: '', s3: '', p1: '', p2: '', p3: '' });
    const [feedback, setFeedback] = useState({ s1: 'neutral', s2: 'neutral', s3: 'neutral', p1: 'neutral', p2: 'neutral', p3: 'neutral' });
    const [showReveal, setShowReveal] = useState(false);
    const [mode, setMode] = useState('drill'); // 'drill' | 'translate'

    const currentVerb = verbList[currentIndex];

    useEffect(() => {
      setInputs({ s1: '', s2: '', s3: '', p1: '', p2: '', p3: '' });
      setFeedback({ s1: 'neutral', s2: 'neutral', s3: 'neutral', p1: 'neutral', p2: 'neutral', p3: 'neutral' });
      setShowReveal(false);
    }, [currentIndex, mode]);

    const handleInputChange = (key, value) => {
      setInputs(prev => ({ ...prev, [key]: value }));
      if (feedback[key] !== 'neutral') {
        setFeedback(prev => ({ ...prev, [key]: 'neutral' }));
      }
    };

    const checkAnswers = () => {
      const newFeedback = { ...feedback };
      let allCorrect = true;

      ['s1', 's2', 's3', 'p1', 'p2', 'p3'].forEach((key) => {
        let isCorrect = false;
        
        if (mode === 'drill') {
          isCorrect = checkAnswer(inputs[key], currentVerb.futureActive[key]);
        } else {
          isCorrect = checkEnglishTranslation(inputs[key], currentVerb.definition, key);
        }

        newFeedback[key] = isCorrect ? 'correct' : 'incorrect';
        if (!isCorrect) allCorrect = false;
      });

      setFeedback(newFeedback);
      if (!allCorrect) setShowReveal(true);
    };

    const nextVerb = () => {
       let nextIndex;
       if (verbList.length <= 1) {
         nextIndex = 0;
       } else {
         do {
            nextIndex = Math.floor(Math.random() * verbList.length);
         } while (nextIndex === currentIndex);
       }
       setCurrentIndex(nextIndex);
    };

    const isComplete = Object.values(feedback).every(s => s === 'correct');

    if (!currentVerb) return html`<div>Loading...</div>`;

    return html`
      <div className="min-h-screen bg-roman-cream pb-20">
        <${Header} />

        <main className="max-w-4xl mx-auto px-2 md:px-4 py-4 md:py-8">
          <${VerbCard} 
            verb=${currentVerb} 
            currentIndex=${currentIndex} 
            totalVerbs=${verbList.length} 
          />

          <div className="flex gap-2 md:gap-4 mb-4 md:mb-6">
            <button
              onClick=${() => setMode('drill')}
              className=${`flex-1 md:flex-none px-2 md:px-4 py-2 rounded-t-lg font-bold text-xs md:text-base transition-colors ${
                mode === 'drill' 
                ? 'bg-white text-roman-red border-t-2 border-x-2 border-roman-gold' 
                : 'bg-transparent text-gray-500 hover:text-roman-stone'
              }`}
            >
              Conjugation
            </button>
            <button
               onClick=${() => setMode('translate')}
               className=${`flex-1 md:flex-none px-2 md:px-4 py-2 rounded-t-lg font-bold text-xs md:text-base transition-colors ${
                mode === 'translate' 
                ? 'bg-white text-roman-red border-t-2 border-x-2 border-roman-gold' 
                : 'bg-transparent text-gray-500 hover:text-roman-stone'
              }`}
            >
              Translation
            </button>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-b-lg rounded-tr-lg shadow-lg border-2 border-gray-100">
             
             ${mode === 'translate' && html`
                <div className="mb-4 md:mb-6 bg-blue-50 p-3 md:p-4 rounded border border-blue-100 text-xs md:text-sm text-blue-800">
                  <p><strong>Instructions:</strong> Translate the Latin word into English future tense.</p>
                  <p class="mt-1">Example: <em>amābō</em> → <em>I will love</em></p>
                </div>
             `}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-6">
              <!-- Singular Column -->
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-center font-display font-bold text-lg md:text-xl text-roman-stone border-b-2 border-roman-gold pb-1 md:pb-2">Singular</h3>
                ${['s1', 's2', 's3'].map((key) => html`
                  <${ConjugationCell}
                    key=${key}
                    label=${mode === 'drill' ? getPersonLabel(key) : currentVerb.futureActive[key]}
                    subLabel=${mode === 'translate' ? getPersonLabel(key).split(' ')[0] : ''}
                    value=${inputs[key]}
                    status=${feedback[key]}
                    correctValue=${mode === 'drill' ? currentVerb.futureActive[key] : '(e.g. I will...)'}
                    showReveal=${showReveal}
                    onChange=${(val) => handleInputChange(key, val)}
                  />
                `)}
              </div>

              <!-- Plural Column -->
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-center font-display font-bold text-lg md:text-xl text-roman-stone border-b-2 border-roman-gold pb-1 md:pb-2">Plural</h3>
                ${['p1', 'p2', 'p3'].map((key) => html`
                  <${ConjugationCell}
                    key=${key}
                    label=${mode === 'drill' ? getPersonLabel(key) : currentVerb.futureActive[key]}
                    subLabel=${mode === 'translate' ? getPersonLabel(key).split(' ')[0] : ''}
                    value=${inputs[key]}
                    status=${feedback[key]}
                    correctValue=${mode === 'drill' ? currentVerb.futureActive[key] : '(e.g. We will...)'}
                    showReveal=${showReveal}
                    onChange=${(val) => handleInputChange(key, val)}
                  />
                `)}
              </div>
            </div>

            <!-- Action Buttons: Stack on mobile, row on desktop -->
            <div className="mt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
               <button 
                onClick=${() => setInputs({ s1: '', s2: '', s3: '', p1: '', p2: '', p3: '' })}
                className="w-full md:w-auto flex justify-center items-center gap-2 px-4 py-2 text-gray-500 hover:text-roman-red transition-colors text-sm font-bold border border-transparent hover:border-gray-200 rounded"
              >
                <${Icons.RotateCcw} /> Reset
              </button>

              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick=${checkAnswers}
                  className="w-full md:w-auto bg-roman-red text-white px-6 py-3 rounded shadow hover:bg-red-800 transition-all font-bold tracking-wide flex justify-center items-center gap-2"
                >
                  <${Icons.CheckCircle} /> Check Answers
                </button>
                ${isComplete && html`
                   <button
                   onClick=${nextVerb}
                   className="w-full md:w-auto bg-roman-gold text-roman-stone px-6 py-3 rounded shadow hover:bg-yellow-600 transition-all font-bold tracking-wide flex justify-center items-center gap-2 animate-bounce"
                 >
                   Next Verb <${Icons.ArrowRight} />
                 </button>
                `}
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  };

  // --- Mount ---
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(html`<${App} />`);
})();