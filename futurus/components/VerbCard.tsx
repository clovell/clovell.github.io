import React from 'react';
import { Verb } from '../types';

interface VerbCardProps {
  verb: Verb;
  currentIndex: number;
  totalVerbs: number;
}

export const VerbCard: React.FC<VerbCardProps> = ({ verb, currentIndex, totalVerbs }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-roman-stone mb-6">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-roman-gold/20 text-roman-stone px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {verb.conjugation} Conjugation
        </span>
        <span className="text-gray-400 text-sm font-mono">
          {currentIndex + 1} / {totalVerbs}
        </span>
      </div>
      
      <h2 className="text-4xl font-display font-bold text-roman-red mb-2">{verb.infinitive}</h2>
      <p className="text-xl font-serif text-gray-700 italic mb-4">{verb.principalParts}</p>
      <div className="h-px w-full bg-gray-200 mb-4"></div>
      <p className="text-lg text-gray-800 font-bold">Definition: <span className="font-normal">{verb.definition}</span></p>
    </div>
  );
};