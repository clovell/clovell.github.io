import React from 'react';

interface HeaderProps {
  streak: number;
}

export const Header: React.FC<HeaderProps> = ({ streak }) => {
  return (
    <header className="flex justify-between items-center bg-white shadow-md p-4 rounded-xl border border-stone-200 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-amber-600 text-white p-2 rounded-lg font-bold text-xl font-serif">
          SPQR
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-stone-800 hidden sm:block">Latin Passive Review</h1>
        <h1 className="text-xl font-bold text-stone-800 sm:hidden">Latin Review</h1>
      </div>
      
      <div className="flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full border border-stone-300">
        <span className="text-xl">🔥</span>
        <span className="font-bold text-stone-700">Streak: {streak}</span>
      </div>
    </header>
  );
};