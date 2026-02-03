import React, { useState, useMemo } from 'react';
import { ADJECTIVE_DATA } from './constants';
import { QuizMode, QuestionResult, AdjectiveEntry } from './types';
import StartScreen from './components/StartScreen';
import QuizActive from './components/QuizActive';
import ResultsScreen from './components/ResultsScreen';

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<'START' | 'QUIZ' | 'RESULTS'>('START');
  const [mode, setMode] = useState<QuizMode>(QuizMode.STANDARD);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [queue, setQueue] = useState<AdjectiveEntry[]>([]);

  const handleStart = (selectedMode: QuizMode) => {
    setMode(selectedMode);
    setQueue(shuffleArray(ADJECTIVE_DATA));
    setResults([]);
    setScreen('QUIZ');
  };

  const handleComplete = (finalResults: QuestionResult[]) => {
    setResults(finalResults);
    setScreen('RESULTS');
  };

  const handleRestart = () => {
    setScreen('START');
  };

  const handleExit = () => {
    setScreen('START');
  };

  return (
    <div className="min-h-screen w-full bg-roman-50 flex flex-col font-sans">
      <header className="w-full bg-white border-b border-roman-200 py-4 px-6 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-roman-800 cursor-pointer" onClick={handleExit}>
            <span className="text-2xl font-display font-bold">SPQR</span>
            <span className="hidden sm:inline text-sm font-serif italic text-roman-500 border-l border-roman-300 pl-3 ml-1">Senatus Populusque Romanus</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start pt-8 md:pt-12 px-4">
        {screen === 'START' && <StartScreen onStart={handleStart} />}
        {screen === 'QUIZ' && (
          <QuizActive
            mode={mode}
            queue={queue}
            onComplete={handleComplete}
            onExit={handleExit}
          />
        )}
        {screen === 'RESULTS' && (
          <ResultsScreen results={results} onRestart={handleRestart} />
        )}
      </main>

      <footer className="py-6 text-center text-roman-400 text-xs font-serif">
        <p>&copy; {new Date().getFullYear()} Gradus Adjectivorum. Ad Astra Per Aspera.</p>
      </footer>

      {/* Tailwind Custom Keyframes for smooth entries */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;