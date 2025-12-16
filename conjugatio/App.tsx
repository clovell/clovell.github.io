import React, { useState } from 'react';
import { Book, GraduationCap, Github } from 'lucide-react';
import Drill from './components/Drill';
import Help from './components/Help';
import FeedbackEffects from './components/FeedbackEffects';
import { playSound } from './services/audio';
import { Stats } from './types';

function App() {
  const [view, setView] = useState<'drill' | 'help'>('drill');
  const [stats, setStats] = useState<Stats>({ correct: 0, total: 0, streak: 0 });
  const [showMacrons, setShowMacrons] = useState(true);
  
  // Effects State
  const [effectType, setEffectType] = useState<'incorrect' | 'streak' | null>(null);
  
  // Helper to handle completion of effect animations
  const handleEffectComplete = () => {
    setEffectType(null);
  };

  const handleNextVerb = () => {
    setEffectType(null);
  };

  const handleScoreUpdate = (isCorrect: boolean) => {
    if (isCorrect) {
      const newStreak = stats.streak + 1;
      setStats(prev => ({
        total: prev.total + 1,
        correct: prev.correct + 1,
        streak: newStreak
      }));

      // Check for streak milestone (every 5)
      if (newStreak > 0 && newStreak % 5 === 0) {
        setEffectType('streak');
        playSound('streak', newStreak / 5);
      } else {
        playSound('correct');
      }
    } else {
      // Incorrect logic
      setStats(prev => ({
        total: prev.total + 1,
        correct: prev.correct, // Don't increment correct
        streak: 0 // Reset streak
      }));
      setEffectType('incorrect');
      playSound('incorrect');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-transform ${effectType === 'incorrect' ? 'animate-shake' : ''}`}>
      <FeedbackEffects 
        type={effectType} 
        streakCount={stats.streak} 
        onComplete={handleEffectComplete} 
      />

      {/* Header */}
      <header className="bg-roman-dark text-stone-100 py-4 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-roman-red p-2 rounded-lg">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold tracking-wider">Conjugatio</h1>
              <p className="text-xs text-stone-400 hidden md:block">Master Latin Verbs</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowMacrons(!showMacrons)}
              className="text-xs font-semibold px-2 py-1 rounded border border-stone-600 hover:bg-stone-800 transition-colors"
              title="Toggle vowel length marks"
            >
              Macrons: <span className={showMacrons ? "text-roman-gold" : "text-stone-500"}>{showMacrons ? "ON" : "OFF"}</span>
            </button>

            <div className="text-right hidden sm:block">
              <div className="text-sm text-stone-400">Streak</div>
              <div className="font-display font-bold text-roman-gold text-xl transition-all duration-300 transform key={stats.streak}">
                {stats.streak}
              </div>
            </div>
            
            {view === 'drill' && (
              <button 
                onClick={() => setView('help')}
                className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 px-4 py-2 rounded-md transition-colors text-sm font-semibold"
              >
                <Book size={18} />
                <span className="hidden sm:inline">How to Identify</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center relative z-0">
        {view === 'drill' ? (
          <Drill 
            onScoreUpdate={handleScoreUpdate} 
            showMacrons={showMacrons} 
            onNextVerb={handleNextVerb}
          />
        ) : (
          <Help onBack={() => setView('drill')} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-stone-500 text-sm border-t border-stone-300/50">
        <p className="mb-2">Verbs sourced from Dickinson College Commentaries Core Vocabulary.</p>
        <div className="flex justify-center items-center gap-2 opacity-70">
          <Github size={14} />
          <span>Built for Latin students everywhere.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;