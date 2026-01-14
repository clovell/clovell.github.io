import React from 'react';
import { Scroll, Info } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-roman-red text-roman-cream p-6 shadow-lg border-b-4 border-roman-gold relative">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scroll className="w-8 h-8 text-roman-gold" />
          <div>
            <h1 className="text-3xl font-display font-bold tracking-wider">FUTURUM</h1>
            <p className="text-xs font-serif italic text-roman-gold opacity-90">Active Voice Conjugation Trainer</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm opacity-80">
          <Info size={16} />
          <span>Use macrons (ā) or plain text (a)</span>
        </div>
      </div>
    </header>
  );
};