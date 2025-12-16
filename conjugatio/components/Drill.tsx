import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle, XCircle, Brain, Info, ScrollText } from 'lucide-react';
import { VERBS, CONJUGATIONS_LIST } from '../constants';
import { Verb, Conjugation } from '../types';
import Button from './Button';
import { getVerbInsight } from '../services/ai';

interface DrillProps {
  onScoreUpdate: (correct: boolean) => void;
  showMacrons: boolean;
  onNextVerb?: () => void;
}

const Drill: React.FC<DrillProps> = ({ onScoreUpdate, showMacrons, onNextVerb }) => {
  const [currentVerb, setCurrentVerb] = useState<Verb | null>(null);
  const [selected, setSelected] = useState<Conjugation | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [showEtymology, setShowEtymology] = useState(false);

  // Pick a random verb, avoiding the immediate repetition if possible
  const nextVerb = useCallback(() => {
    let next: Verb;
    do {
      next = VERBS[Math.floor(Math.random() * VERBS.length)];
    } while (VERBS.length > 1 && next === currentVerb);
    
    setCurrentVerb(next);
    setSelected(null);
    setIsCorrect(null);
    setAiInsight(null);
    setShowEtymology(false);
    if (onNextVerb) onNextVerb();
  }, [currentVerb, onNextVerb]);

  // Initial load
  useEffect(() => {
    if (!currentVerb) nextVerb();
  }, [nextVerb, currentVerb]);

  const handleSelection = useCallback((conjugation: Conjugation) => {
    if (selected !== null || !currentVerb) return; // Prevent double clicking

    setSelected(conjugation);
    const correct = conjugation === currentVerb.conjugation;
    setIsCorrect(correct);
    onScoreUpdate(correct);
  }, [selected, currentVerb, onScoreUpdate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid interference with browser shortcuts or inputs if we had any
      if (e.ctrlKey || e.altKey || e.metaKey || e.target instanceof HTMLInputElement) return;

      const key = e.key.toLowerCase();

      if (selected === null && currentVerb) {
        // Selection phase
        switch (key) {
          case '1': handleSelection(Conjugation.First); break;
          case '2': handleSelection(Conjugation.Second); break;
          case '3': handleSelection(Conjugation.Third); break;
          case '4': handleSelection(Conjugation.ThirdIO); break;
          case '5': handleSelection(Conjugation.Fourth); break;
        }
      } else if (selected !== null) {
        // Result phase
        if (key === 'n' || key === 'enter') {
          nextVerb();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, currentVerb, handleSelection, nextVerb]);

  const handleGetInsight = async () => {
    if (!currentVerb) return;
    setIsLoadingInsight(true);
    const insight = await getVerbInsight(currentVerb);
    setAiInsight(insight);
    setIsLoadingInsight(false);
  };

  const formatText = (text: string) => {
    if (showMacrons) return text;
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  if (!currentVerb) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 animate-fade-in">
      {/* Verb Card */}
      <div className="bg-white rounded-xl shadow-xl border-2 border-stone-200 overflow-hidden relative">
        <div className="bg-stone-100 border-b border-stone-200 p-4 text-center">
          <span className="uppercase tracking-widest text-xs font-bold text-stone-500">Principal Parts</span>
        </div>
        
        <div className="p-8 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-roman-dark mb-4 leading-tight">
            {currentVerb.principalParts.map(formatText).join(', ')}
          </h2>
          <p className="text-xl text-stone-500 italic font-serif">
            {currentVerb.definition}
          </p>
          
          {/* Etymology Link */}
          {currentVerb.etymology && (
            <div className="mt-4 flex flex-col items-center">
               <button 
                onClick={() => setShowEtymology(!showEtymology)}
                className="text-stone-400 text-xs md:text-sm hover:text-roman-gold hover:underline flex items-center gap-1 transition-colors"
               >
                 <ScrollText size={14} />
                 {showEtymology ? 'Hide Etymology' : 'Show Etymology'}
               </button>
               
               {showEtymology && (
                 <div className="mt-3 text-stone-600 text-sm md:text-base italic animate-fade-in bg-stone-50 p-3 rounded-lg border border-stone-200 max-w-lg">
                   {currentVerb.etymology}
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Feedback Overlay */}
        {isCorrect !== null && (
          <div className={`p-4 text-center animate-pulse ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center justify-center gap-2 font-bold text-lg">
              {isCorrect ? <CheckCircle /> : <XCircle />}
              {isCorrect ? 'Optime! (Correct)' : `Eheu! It is ${currentVerb.conjugation} conjugation.`}
            </div>
          </div>
        )}
      </div>

      {/* Answer Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
        {CONJUGATIONS_LIST.map((conj, index) => {
          let variant: 'primary' | 'outline' | 'secondary' | 'ghost' = 'outline';
          
          if (selected === conj) {
            variant = isCorrect ? 'primary' : 'secondary';
            if (!isCorrect) variant = 'secondary';
          }
          
          // Custom styling logic for feedback
          let customClass = "";
          if (selected !== null) {
            if (conj === currentVerb.conjugation) {
              customClass = "!bg-green-600 !text-white !border-green-600";
            } else if (selected === conj && !isCorrect) {
              customClass = "!bg-red-600 !text-white !border-red-600";
            } else {
              customClass = "opacity-50";
            }
          }

          return (
            <Button
              key={conj}
              onClick={() => handleSelection(conj)}
              disabled={selected !== null}
              className={`h-24 md:h-20 text-lg md:text-sm relative group ${customClass}`}
            >
              <span className="absolute top-1 left-2 text-[10px] opacity-50 font-sans border border-current px-1 rounded hidden md:block">
                {index + 1}
              </span>
              {conj}
            </Button>
          );
        })}
      </div>

      {/* Action Area */}
      {selected !== null && (
        <div className="mt-8 flex flex-col items-center gap-4 animate-slide-up">
          <Button onClick={nextVerb} className="flex items-center gap-2 text-lg relative group">
            <span className="absolute -left-8 text-xs bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
              N
            </span>
            <RefreshCw size={20} /> Next Verb
          </Button>

          {/* AI Helper - Only show if not already showing insight */}
          {!aiInsight && (
            <button 
              onClick={handleGetInsight}
              disabled={isLoadingInsight}
              className="text-stone-500 hover:text-roman-red text-sm flex items-center gap-2 underline transition-colors"
            >
              <Brain size={16} />
              {isLoadingInsight ? "Consulting the Oracle..." : "Ask AI for a mnemonic"}
            </button>
          )}

          {/* AI Insight Result */}
          {aiInsight && (
            <div className="bg-roman-stone border border-stone-300 p-4 rounded-lg max-w-lg mt-2 text-left">
              <div className="flex items-center gap-2 text-roman-red font-bold text-sm mb-1">
                <Info size={16} /> AI Tutor Note
              </div>
              <p className="text-stone-700 italic text-sm">{aiInsight}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Drill;