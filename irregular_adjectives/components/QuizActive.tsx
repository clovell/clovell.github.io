import React, { useState, useRef, useEffect } from 'react';
import { QuizMode, AdjectiveEntry, QuestionResult } from '../types';
import { checkAnswer, checkDefinition } from '../utils/latinUtils';

interface QuizActiveProps {
  mode: QuizMode;
  queue: AdjectiveEntry[];
  onComplete: (results: QuestionResult[]) => void;
  onExit: () => void;
}

const QuizActive: React.FC<QuizActiveProps> = ({ mode, queue, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input1, setInput1] = useState(''); // Comp (Standard/Full) OR Positive Def (Definition)
  const [input2, setInput2] = useState(''); // Super (Standard/Full) OR Comparative Def (Definition)
  const [input3, setInput3] = useState(''); // Unused (Standard/Full) OR Superlative Def (Definition)
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState<QuestionResult | null>(null);

  const input1Ref = useRef<HTMLInputElement>(null);

  const currentItem = queue[currentIndex];
  const isLastQuestion = currentIndex === queue.length - 1;

  // Focus input on new question
  useEffect(() => {
    if (!showFeedback && input1Ref.current) {
      input1Ref.current.focus();
    }
  }, [currentIndex, showFeedback]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showFeedback) return handleNext();

    let isCorrect = false;
    let resultEntry: QuestionResult;

    if (mode === QuizMode.DEFINITION) {
      // Definition Mode: Check all 3 definitions
      const valid1 = checkDefinition(input1, currentItem.definition);
      const valid2 = checkDefinition(input2, currentItem.definitionComparative);
      const valid3 = checkDefinition(input3, currentItem.definitionSuperlative);

      isCorrect = valid1 && valid2 && valid3;
      resultEntry = {
        positive: currentItem.positive,
        userAnswer1: input1,
        userAnswer2: input2,
        userAnswer3: input3,
        correctAnswer1: currentItem.definition,
        correctAnswer2: currentItem.definitionComparative,
        correctAnswer3: currentItem.definitionSuperlative,
        isCorrect,
        isCorrect1: valid1,
        isCorrect2: valid2,
        isCorrect3: valid3
      };
    } else {
      // Standard or Full Gender Mode
      const targetComp = mode === QuizMode.FULL_GENDER ? currentItem.comparativeFull : currentItem.comparative;
      const targetSup = mode === QuizMode.FULL_GENDER ? currentItem.superlativeFull : currentItem.superlative;

      const compCorrect = checkAnswer(input1, targetComp);
      const supCorrect = checkAnswer(input2, targetSup);

      isCorrect = compCorrect && supCorrect;
      resultEntry = {
        positive: currentItem.positive,
        userAnswer1: input1,
        userAnswer2: input2,
        correctAnswer1: targetComp,
        correctAnswer2: targetSup,
        isCorrect,
        isCorrect1: compCorrect,
        isCorrect2: supCorrect
      };
    }

    setLastResult(resultEntry);
    setResults([...results, resultEntry]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setInput1('');
    setInput2('');
    setInput3('');
    setLastResult(null);

    if (isLastQuestion) {
      if (lastResult) {
          onComplete([...results, lastResult]); 
      } else {
           onComplete(results);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Label helpers
  const getLabel1 = () => mode === QuizMode.DEFINITION ? "Meaning (Positive)" : "Comparative";
  const getLabel2 = () => mode === QuizMode.DEFINITION ? "Meaning (Comparative)" : "Superlative";
  const getLabel3 = () => "Meaning (Superlative)";
  
  const getPlaceholder1 = () => {
    if (mode === QuizMode.DEFINITION) return "e.g., good";
    if (mode === QuizMode.FULL_GENDER) return "e.g., melior, -ius";
    return "e.g., melior";
  };

  const getPlaceholder2 = () => {
    if (mode === QuizMode.DEFINITION) return "e.g., better";
    if (mode === QuizMode.FULL_GENDER) return "e.g., optimus, -a, -um";
    return "e.g., optimus";
  };

  const getPlaceholder3 = () => "e.g., best";

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in">
      {/* Header / Progress */}
      <div className="mb-8 flex justify-between items-center text-roman-600 font-sans text-sm font-medium">
        <button onClick={onExit} className="hover:text-roman-800 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Quit
        </button>
        <span className="bg-roman-200 px-3 py-1 rounded-full text-roman-800">
          {currentIndex + 1} / {queue.length}
        </span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-roman-200 overflow-hidden relative min-h-[400px] flex flex-col">
        
        {/* Flashcard Content */}
        <div className="p-8 flex-grow flex flex-col items-center justify-center text-center space-y-2 bg-roman-50/50">
          <h2 className="text-xl text-roman-500 font-sans font-medium tracking-wide uppercase">Positive Degree</h2>
          <p className="text-6xl font-serif text-roman-900 font-bold mb-8">{currentItem.positive}</p>
        </div>

        {/* Input Area */}
        <div className="bg-white p-8 border-t border-roman-100">
          {!showFeedback ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={`grid gap-6 ${mode === QuizMode.DEFINITION ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {/* Input 1 */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
                    {getLabel1()}
                  </label>
                  <input
                    ref={input1Ref}
                    type="text"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                    className="w-full text-lg p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-roman-500 focus:ring-0 outline-none transition-colors font-serif text-gray-800 placeholder-gray-300"
                    placeholder={getPlaceholder1()}
                    autoComplete="off"
                  />
                </div>
                
                {/* Input 2 */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
                    {getLabel2()}
                  </label>
                  <input
                    type="text"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                    className="w-full text-lg p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-roman-500 focus:ring-0 outline-none transition-colors font-serif text-gray-800 placeholder-gray-300"
                    placeholder={getPlaceholder2()}
                    autoComplete="off"
                  />
                </div>

                {/* Input 3 (Definition Only) */}
                {mode === QuizMode.DEFINITION && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
                      {getLabel3()}
                    </label>
                    <input
                      type="text"
                      value={input3}
                      onChange={(e) => setInput3(e.target.value)}
                      className="w-full text-lg p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-roman-500 focus:ring-0 outline-none transition-colors font-serif text-gray-800 placeholder-gray-300"
                      placeholder={getPlaceholder3()}
                      autoComplete="off"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-roman-600 hover:bg-roman-700 text-white font-bold rounded-xl shadow-md transform active:scale-[0.99] transition-all duration-200 font-sans uppercase tracking-widest text-sm"
              >
                Submit Answer
              </button>
            </form>
          ) : (
            <div className="animate-fade-in space-y-6">
              {/* Feedback Display */}
              <div className={`text-center p-4 rounded-xl border-2 ${lastResult?.isCorrect ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <h3 className={`text-2xl font-display font-bold mb-4 ${lastResult?.isCorrect ? 'text-green-800' : 'text-orange-900'}`}>
                  {lastResult?.isCorrect ? 'Optime!' : 'Check your answers'}
                </h3>
                
                <div className={`grid gap-4 text-left ${mode === QuizMode.DEFINITION ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {/* Feedback 1 */}
                    <div className="bg-white/50 p-3 rounded-lg border border-black/5">
                        <span className="text-xs uppercase text-gray-400 font-bold block mb-1">{getLabel1()}</span>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`font-serif text-lg ${lastResult?.isCorrect1 ? 'text-green-700' : 'text-red-600 line-through decoration-2'}`}>
                                {lastResult?.userAnswer1 || <span className="italic text-gray-400">empty</span>}
                            </span>
                            {lastResult?.isCorrect1 ? (
                                <span className="text-green-600">✓</span>
                            ) : (
                                <span className="text-red-500">✗</span>
                            )}
                        </div>
                        {!lastResult?.isCorrect1 && (
                            <div className="text-sm text-roman-700 font-medium">
                                <span className="text-xs text-gray-500 font-sans mr-1">Correct:</span>
                                {lastResult?.correctAnswer1}
                            </div>
                        )}
                    </div>

                    {/* Feedback 2 */}
                    <div className="bg-white/50 p-3 rounded-lg border border-black/5">
                        <span className="text-xs uppercase text-gray-400 font-bold block mb-1">{getLabel2()}</span>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`font-serif text-lg ${lastResult?.isCorrect2 ? 'text-green-700' : 'text-red-600 line-through decoration-2'}`}>
                                {lastResult?.userAnswer2 || <span className="italic text-gray-400">empty</span>}
                            </span>
                            {lastResult?.isCorrect2 ? (
                                <span className="text-green-600">✓</span>
                            ) : (
                                <span className="text-red-500">✗</span>
                            )}
                        </div>
                        {!lastResult?.isCorrect2 && (
                            <div className="text-sm text-roman-700 font-medium">
                                <span className="text-xs text-gray-500 font-sans mr-1">Correct:</span>
                                {lastResult?.correctAnswer2}
                            </div>
                        )}
                    </div>

                    {/* Feedback 3 (Definition Only) */}
                    {mode === QuizMode.DEFINITION && (
                      <div className="bg-white/50 p-3 rounded-lg border border-black/5">
                        <span className="text-xs uppercase text-gray-400 font-bold block mb-1">{getLabel3()}</span>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`font-serif text-lg ${lastResult?.isCorrect3 ? 'text-green-700' : 'text-red-600 line-through decoration-2'}`}>
                                {lastResult?.userAnswer3 || <span className="italic text-gray-400">empty</span>}
                            </span>
                            {lastResult?.isCorrect3 ? (
                                <span className="text-green-600">✓</span>
                            ) : (
                                <span className="text-red-500">✗</span>
                            )}
                        </div>
                        {!lastResult?.isCorrect3 && (
                            <div className="text-sm text-roman-700 font-medium">
                                <span className="text-xs text-gray-500 font-sans mr-1">Correct:</span>
                                {lastResult?.correctAnswer3}
                            </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
              
              <button
                onClick={handleNext}
                autoFocus
                className="w-full py-4 bg-roman-800 hover:bg-roman-900 text-white font-bold rounded-xl shadow-md transform active:scale-[0.99] transition-all duration-200 font-sans uppercase tracking-widest text-sm"
              >
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizActive;