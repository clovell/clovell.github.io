import React from 'react';
import { QuestionResult } from '../types';

interface ResultsScreenProps {
  results: QuestionResult[];
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onRestart }) => {
  const correctCount = results.filter(r => r.isCorrect).length;
  const total = results.length;
  const percentage = Math.round((correctCount / total) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 animate-fade-in pb-20">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-4xl font-display text-roman-800">Quiz Completed</h2>
        <div className="text-roman-600 font-serif italic">Here is how you performed</div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-roman-200 overflow-hidden mb-8">
        <div className="p-8 bg-roman-50 border-b border-roman-200 text-center">
            <span className="block text-sm font-bold text-roman-500 uppercase tracking-widest mb-1">Final Score</span>
            <div className="text-6xl font-display font-bold text-roman-900">
                {percentage}%
            </div>
            <div className="text-gray-500 font-medium mt-2">{correctCount} out of {total} correct</div>
        </div>

        <div className="divide-y divide-gray-100">
            {results.map((result, idx) => (
                <div key={idx} className={`p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 ${result.isCorrect ? 'bg-white' : 'bg-red-50/30'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mt-1 ${result.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {result.isCorrect ? '✓' : '✗'}
                        </div>
                        <div>
                            <h4 className="text-xl font-serif font-bold text-gray-800 capitalize mb-1">{result.positive}</h4>
                            
                            {/* Part 1 (Comparative or Positive Definition) */}
                            <div className="text-sm mb-1">
                                <span className={`font-mono mr-2 ${result.isCorrect1 ? 'text-green-700' : 'text-red-600'}`}>
                                   {result.userAnswer1}
                                   {result.isCorrect1 ? ' ✓' : ' ✗'}
                                </span>
                                {!result.isCorrect1 && (
                                   <span className="text-gray-500">→ <span className="font-serif text-roman-700">{result.correctAnswer1}</span></span>
                                )}
                            </div>

                            {/* Part 2 (Superlative or Comparative Definition) */}
                            {result.userAnswer2 !== undefined && (
                                <div className="text-sm mb-1">
                                    <span className={`font-mono mr-2 ${result.isCorrect2 ? 'text-green-700' : 'text-red-600'}`}>
                                       {result.userAnswer2}
                                       {result.isCorrect2 ? ' ✓' : ' ✗'}
                                    </span>
                                    {!result.isCorrect2 && (
                                       <span className="text-gray-500">→ <span className="font-serif text-roman-700">{result.correctAnswer2}</span></span>
                                    )}
                                </div>
                            )}

                            {/* Part 3 (Superlative Definition - if applicable) */}
                            {result.userAnswer3 !== undefined && (
                                <div className="text-sm">
                                    <span className={`font-mono mr-2 ${result.isCorrect3 ? 'text-green-700' : 'text-red-600'}`}>
                                       {result.userAnswer3}
                                       {result.isCorrect3 ? ' ✓' : ' ✗'}
                                    </span>
                                    {!result.isCorrect3 && (
                                       <span className="text-gray-500">→ <span className="font-serif text-roman-700">{result.correctAnswer3}</span></span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
            onClick={onRestart}
            className="px-8 py-4 bg-roman-800 hover:bg-roman-900 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-sans uppercase tracking-widest text-sm flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Start New Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;