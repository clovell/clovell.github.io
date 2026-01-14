import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VerbCard } from './components/VerbCard';
import { ConjugationCell } from './components/ConjugationCell';
import { TranslationPractice } from './components/TranslationPractice';
import { verbList } from './data/verbs';
import { checkAnswer } from './utils/latinHelpers';
import { InputState, FeedbackState, ConjugationForms } from './types';
import { ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';

const initialInputState: InputState = {
  s1: '', s2: '', s3: '',
  p1: '', p2: '', p3: ''
};

const initialFeedbackState: FeedbackState = {
  s1: 'neutral', s2: 'neutral', s3: 'neutral',
  p1: 'neutral', p2: 'neutral', p3: 'neutral'
};

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputs, setInputs] = useState<InputState>(initialInputState);
  const [feedback, setFeedback] = useState<FeedbackState>(initialFeedbackState);
  const [showReveal, setShowReveal] = useState(false);
  const [mode, setMode] = useState<'drill' | 'translate'>('drill');

  const currentVerb = verbList[currentIndex];

  useEffect(() => {
    // Reset state when verb changes
    setInputs(initialInputState);
    setFeedback(initialFeedbackState);
    setShowReveal(false);
  }, [currentIndex]);

  const handleInputChange = (key: keyof InputState, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    // Reset feedback for this cell if user types again
    if (feedback[key] !== 'neutral') {
      setFeedback(prev => ({ ...prev, [key]: 'neutral' }));
    }
  };

  const checkAnswers = () => {
    const newFeedback: FeedbackState = { ...initialFeedbackState };
    let allCorrect = true;

    (Object.keys(currentVerb.futureActive) as Array<keyof ConjugationForms>).forEach((key) => {
      const isCorrect = checkAnswer(inputs[key], currentVerb.futureActive[key]);
      newFeedback[key] = isCorrect ? 'correct' : 'incorrect';
      if (!isCorrect) allCorrect = false;
    });

    setFeedback(newFeedback);
    if (!allCorrect) setShowReveal(true);
  };

  const nextVerb = () => {
    setCurrentIndex(prev => (prev + 1) % verbList.length);
  };

  const isComplete = Object.values(feedback).every(s => s === 'correct');

  return (
    <div className="min-h-screen bg-roman-cream pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <VerbCard 
          verb={currentVerb} 
          currentIndex={currentIndex} 
          totalVerbs={verbList.length} 
        />

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('drill')}
            className={`px-4 py-2 rounded-t-lg font-bold transition-colors ${
              mode === 'drill' 
              ? 'bg-white text-roman-red border-t-2 border-x-2 border-roman-gold' 
              : 'bg-transparent text-gray-500 hover:text-roman-stone'
            }`}
          >
            Conjugation Chart
          </button>
          <button
             onClick={() => setMode('translate')}
             className={`px-4 py-2 rounded-t-lg font-bold transition-colors ${
              mode === 'translate' 
              ? 'bg-white text-roman-red border-t-2 border-x-2 border-roman-gold' 
              : 'bg-transparent text-gray-500 hover:text-roman-stone'
            }`}
          >
            Translation Practice
          </button>
        </div>

        {mode === 'drill' ? (
          <div className="bg-white p-6 rounded-b-lg rounded-tr-lg shadow-lg border-2 border-gray-100">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Singular Column */}
              <div className="space-y-4">
                <h3 className="text-center font-display font-bold text-xl text-roman-stone border-b-2 border-roman-gold pb-2">Singular</h3>
                {(['s1', 's2', 's3'] as Array<keyof ConjugationForms>).map((key) => (
                  <ConjugationCell
                    key={key}
                    id={key}
                    value={inputs[key]}
                    status={feedback[key]}
                    correctValue={currentVerb.futureActive[key]}
                    showReveal={showReveal}
                    onChange={(val) => handleInputChange(key, val)}
                  />
                ))}
              </div>

              {/* Plural Column */}
              <div className="space-y-4">
                <h3 className="text-center font-display font-bold text-xl text-roman-stone border-b-2 border-roman-gold pb-2">Plural</h3>
                {(['p1', 'p2', 'p3'] as Array<keyof ConjugationForms>).map((key) => (
                  <ConjugationCell
                    key={key}
                    id={key}
                    value={inputs[key]}
                    status={feedback[key]}
                    correctValue={currentVerb.futureActive[key]}
                    showReveal={showReveal}
                    onChange={(val) => handleInputChange(key, val)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
               <button 
                onClick={() => setInputs(initialInputState)}
                className="flex items-center gap-2 text-gray-500 hover:text-roman-red transition-colors"
              >
                <RotateCcw size={18} /> Reset
              </button>

              <div className="flex gap-3">
                <button
                  onClick={checkAnswers}
                  className="bg-roman-red text-white px-6 py-3 rounded shadow hover:bg-red-800 transition-all font-bold tracking-wide flex items-center gap-2"
                >
                  <CheckCircle size={20} /> Check Answers
                </button>
                {isComplete && (
                   <button
                   onClick={nextVerb}
                   className="bg-roman-gold text-roman-stone px-6 py-3 rounded shadow hover:bg-yellow-600 transition-all font-bold tracking-wide flex items-center gap-2 animate-bounce"
                 >
                   Next Verb <ArrowRight size={20} />
                 </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-b-lg rounded-tr-lg shadow-lg border-2 border-gray-100 min-h-[300px]">
             <h2 className="text-2xl font-display text-roman-stone mb-4">English Translation</h2>
             <p className="text-gray-600 mb-6">Translate the future tense form of <span className="italic font-bold text-roman-red">{currentVerb.infinitive}</span>.</p>
             <TranslationPractice verb={currentVerb} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;