import React, { useState, useEffect } from 'react';
import { Verb, Tense, AnswerState, ValidationState } from '../types';
import { checkAnswer, getCorrectForms } from '../services/latinService';
import { VerbCard } from './VerbCard';
import { ConjugationCell } from './ConjugationCell';
import { playSound, SoundType } from '../services/audioService';

interface DrillScreenProps {
  verb: Verb;
  tense: Tense;
  onCorrectRound: () => void;
  onResetStreak: () => void;
  onNextRound: () => void;
}

const INITIAL_ANSWERS: AnswerState = {
  '1s': '', '2s': '', '3s': '',
  '1pl': '', '2pl': '', '3pl': ''
};

const INITIAL_VALIDATION: ValidationState = {
  '1s': null, '2s': null, '3s': null,
  '1pl': null, '2pl': null, '3pl': null
};

export const DrillScreen: React.FC<DrillScreenProps> = ({
  verb,
  tense,
  onCorrectRound,
  onResetStreak,
  onNextRound
}) => {
  const [answers, setAnswers] = useState<AnswerState>(INITIAL_ANSWERS);
  const [validation, setValidation] = useState<ValidationState>(INITIAL_VALIDATION);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [correctForms, setCorrectForms] = useState<Record<string, string>>({});

  // Reset state when verb/tense changes
  useEffect(() => {
    setAnswers(INITIAL_ANSWERS);
    setValidation(INITIAL_VALIDATION);
    setIsRoundOver(false);
    setCorrectForms(getCorrectForms(verb, tense));
  }, [verb, tense]);

  const handleInputChange = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const checkAll = () => {
    const keys = ['1s', '2s', '3s', '1pl', '2pl', '3pl'];
    const newValidation: ValidationState = {};
    let allCorrect = true;

    keys.forEach(key => {
      const isCorrect = checkAnswer(answers[key], verb, tense, key);
      newValidation[key] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setValidation(newValidation);
    setIsRoundOver(true);

    if (allCorrect) {
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      onCorrectRound();
    } else {
      onResetStreak();
    }
  };

  const handleNext = () => {
    onNextRound();
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <VerbCard verb={verb} tense={tense} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
        {/* Singular Column */}
        <div className="space-y-4">
          <h3 className="text-stone-500 font-bold text-sm uppercase border-b border-stone-300 pb-1">Singular</h3>
          <ConjugationCell
            label="1st Person"
            value={answers['1s']}
            onChange={(v) => handleInputChange('1s', v)}
            status={validation['1s']}
            correctAnswer={correctForms['1s']}
            disabled={isRoundOver}
          />
          <ConjugationCell
            label="2nd Person"
            value={answers['2s']}
            onChange={(v) => handleInputChange('2s', v)}
            status={validation['2s']}
            correctAnswer={correctForms['2s']}
            disabled={isRoundOver}
          />
          <ConjugationCell
            label="3rd Person"
            value={answers['3s']}
            onChange={(v) => handleInputChange('3s', v)}
            status={validation['3s']}
            correctAnswer={correctForms['3s']}
            disabled={isRoundOver}
          />
        </div>

        {/* Plural Column */}
        <div className="space-y-4">
          <h3 className="text-stone-500 font-bold text-sm uppercase border-b border-stone-300 pb-1">Plural</h3>
          <ConjugationCell
            label="1st Person"
            value={answers['1pl']}
            onChange={(v) => handleInputChange('1pl', v)}
            status={validation['1pl']}
            correctAnswer={correctForms['1pl']}
            disabled={isRoundOver}
          />
          <ConjugationCell
            label="2nd Person"
            value={answers['2pl']}
            onChange={(v) => handleInputChange('2pl', v)}
            status={validation['2pl']}
            correctAnswer={correctForms['2pl']}
            disabled={isRoundOver}
          />
          <ConjugationCell
            label="3rd Person"
            value={answers['3pl']}
            onChange={(v) => handleInputChange('3pl', v)}
            status={validation['3pl']}
            correctAnswer={correctForms['3pl']}
            disabled={isRoundOver}
          />
        </div>
      </div>

      <div className="flex justify-center">
        {!isRoundOver ? (
          <button
            onClick={checkAll}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl shadow-md text-lg transition-transform active:scale-95 w-full md:w-auto"
          >
            Check Answers
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-stone-800 hover:bg-stone-900 text-white font-bold py-3 px-8 rounded-xl shadow-md text-lg transition-transform active:scale-95 w-full md:w-auto flex items-center justify-center gap-2"
          >
            Next Verb <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
};