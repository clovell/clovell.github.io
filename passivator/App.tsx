import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DrillScreen } from './components/DrillScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GameState } from './types';
import { VERBS, getRandomVerb, getRandomTense } from './services/latinService';
import { playSound, SoundType } from './services/audioService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [streak, setStreak] = useState(0);
  const [currentVerb, setCurrentVerb] = useState(VERBS[0]);
  const [currentTense, setCurrentTense] = useState(getRandomTense());

  const startGame = useCallback(() => {
    setGameState('playing');
    nextRound();
    playSound(SoundType.CLICK);
  }, []);

  const nextRound = useCallback(() => {
    setCurrentVerb(getRandomVerb());
    setCurrentTense(getRandomTense());
  }, []);

  const handleCorrectRound = useCallback(() => {
    setStreak((prev) => prev + 1);
    // Determine if we should play a special sound for a milestone
    if ((streak + 1) % 5 === 0) {
      playSound(SoundType.VICTORY);
    } else {
      playSound(SoundType.SUCCESS);
    }
  }, [streak]);

  const handleResetStreak = useCallback(() => {
    setStreak(0);
    playSound(SoundType.FAILURE);
  }, []);

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto w-full p-4 md:p-6 lg:p-8">
      <Header streak={streak} />
      
      <main className="flex-grow flex flex-col items-center justify-center w-full mt-6">
        {gameState === 'welcome' && (
          <WelcomeScreen onStart={startGame} />
        )}
        
        {gameState === 'playing' && (
          <DrillScreen 
            verb={currentVerb}
            tense={currentTense}
            onCorrectRound={handleCorrectRound}
            onResetStreak={handleResetStreak}
            onNextRound={nextRound}
          />
        )}
      </main>

      <footer className="mt-12 text-center text-stone-500 text-sm py-4">
        <p>Latin Passive Voice Review &bull; Dickinson Core Vocabulary</p>
      </footer>
    </div>
  );
};

export default App;