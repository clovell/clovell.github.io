import React from 'react';
import { getPersonLabel } from '../utils/latinHelpers';

interface ConjugationCellProps {
  id: string;
  value: string;
  status: 'correct' | 'incorrect' | 'neutral';
  correctValue?: string;
  onChange: (val: string) => void;
  showReveal: boolean;
}

export const ConjugationCell: React.FC<ConjugationCellProps> = ({ 
  id, 
  value, 
  status, 
  correctValue, 
  onChange,
  showReveal
}) => {
  const baseStyles = "w-full p-3 border-2 rounded-md font-serif text-lg transition-all focus:outline-none focus:ring-2 focus:ring-roman-gold";
  
  let statusStyles = "border-gray-300 bg-white";
  if (status === 'correct') statusStyles = "border-green-600 bg-green-50 text-green-800";
  if (status === 'incorrect') statusStyles = "border-red-600 bg-red-50 text-red-800";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
        {getPersonLabel(id)}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseStyles} ${statusStyles}`}
        placeholder="..."
        autoComplete="off"
        disabled={showReveal}
      />
      {showReveal && status !== 'correct' && (
        <span className="text-sm font-bold text-roman-red animate-pulse">
          {correctValue}
        </span>
      )}
    </div>
  );
};