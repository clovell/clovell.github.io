import React from 'react';
import { Verb, Tense } from '../types';

interface VerbCardProps {
  verb: Verb;
  tense: Tense;
}

export const VerbCard: React.FC<VerbCardProps> = ({ verb, tense }) => {
  return (
    <div className="w-full bg-stone-800 text-stone-50 p-6 rounded-xl shadow-lg mb-6 text-center border-b-4 border-amber-500">
      <div className="text-stone-400 uppercase tracking-widest text-xs font-semibold mb-2">Conjugate in the</div>
      <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-4 serif-font">{tense}</h2>
      
      <div className="bg-stone-700/50 p-4 rounded-lg inline-block w-full">
        <div className="text-xl md:text-2xl font-mono mb-2">
          {verb.principalParts.join(', ')}
        </div>
        <div className="text-stone-300 italic">
          {verb.definition}
        </div>
      </div>
    </div>
  );
};