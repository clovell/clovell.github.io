import React, { useState } from 'react';
import { Verb } from '../types';
import { Check, X, RefreshCw } from 'lucide-react';

interface TranslationPracticeProps {
  verb: Verb;
}

export const TranslationPractice: React.FC<TranslationPracticeProps> = ({ verb }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Simple heuristic check for future tense English
  const checkTranslation = () => {
    const i = input.toLowerCase().trim();
    // Basic checks: must contain "will" or "shall" and the verb definition (roughly)
    // This is a naive client-side check. A better version would use an LLM, but we stick to logic per prompt.
    
    // Extract core meaning from definition (e.g., "to love" -> "love")
    const coreMeanings = verb.definition.replace(/^to\s+/, '').split(',').map(s => s.trim());
    
    const hasFutureMarker = i.includes('will') || i.includes('shall') || i.includes("'ll");
    const hasMeaning = coreMeanings.some(m => i.includes(m));

    if (hasFutureMarker && hasMeaning) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  const reset = () => {
    setInput('');
    setStatus('idle');
  };

  return (
    <div className="mt-8 bg-roman-cream p-6 rounded-lg border border-roman-gold/30">
      <h3 className="text-lg font-bold text-roman-stone mb-3 flex items-center gap-2">
        Translate "Ego {verb.futureActive.s1}"
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border-2 border-gray-300 rounded focus:border-roman-gold focus:outline-none"
          placeholder={`I will ${verb.definition.replace('to ', '')}...`}
          value={input}
          onChange={(e) => {
             setInput(e.target.value);
             if (status !== 'idle') setStatus('idle');
          }}
          onKeyDown={(e) => e.key === 'Enter' && checkTranslation()}
        />
        <button 
          onClick={checkTranslation}
          disabled={!input}
          className="bg-roman-stone text-white px-4 py-2 rounded hover:bg-black transition-colors disabled:opacity-50"
        >
          Check
        </button>
      </div>
      
      {status === 'correct' && (
        <div className="mt-2 text-green-700 font-bold flex items-center gap-2">
          <Check size={18} /> Optime! (Excellent)
        </div>
      )}
      
      {status === 'incorrect' && (
        <div className="mt-2 text-roman-red font-bold flex items-center gap-2">
           <X size={18} /> Try again. Remember to use "will" + the meaning.
        </div>
      )}
    </div>
  );
};