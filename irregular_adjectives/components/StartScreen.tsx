import React from 'react';
import { QuizMode } from '../types';

interface StartScreenProps {
  onStart: (mode: QuizMode) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 animate-fade-in p-6">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-display text-roman-800 tracking-tight">
          Gradus Adjectivorum
        </h1>
        <p className="text-lg md:text-xl text-roman-600 font-serif italic max-w-2xl mx-auto">
          "Practice the irregular degrees of comparison for the five common Latin adjectives."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <button
          onClick={() => onStart(QuizMode.STANDARD)}
          className="group relative flex flex-col items-center p-8 bg-white border-2 border-roman-200 rounded-xl hover:border-roman-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="mb-4 p-4 bg-roman-100 rounded-full text-roman-700 group-hover:bg-roman-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">Standard Forms</h3>
          <p className="text-sm text-gray-500 font-sans">
            Enter the basic comparative and superlative forms (e.g., <em>melior</em>, <em>optimus</em>).
          </p>
        </button>

        <button
          onClick={() => onStart(QuizMode.FULL_GENDER)}
          className="group relative flex flex-col items-center p-8 bg-white border-2 border-roman-200 rounded-xl hover:border-roman-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="mb-4 p-4 bg-roman-100 rounded-full text-roman-700 group-hover:bg-roman-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">Full Gender Forms</h3>
          <p className="text-sm text-gray-500 font-sans">
             Enter full citations (e.g., <em>melior, -ius</em> and <em>optimus, -a, -um</em>).
          </p>
        </button>

        <button
          onClick={() => onStart(QuizMode.DEFINITION)}
          className="group relative flex flex-col items-center p-8 bg-white border-2 border-roman-200 rounded-xl hover:border-roman-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="mb-4 p-4 bg-roman-100 rounded-full text-roman-700 group-hover:bg-roman-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">Definitions</h3>
          <p className="text-sm text-gray-500 font-sans">
            Quiz yourself on the English meanings of these adjectives.
          </p>
        </button>
      </div>
    </div>
  );
};

export default StartScreen;