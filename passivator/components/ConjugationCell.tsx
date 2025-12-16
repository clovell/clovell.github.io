import React, { useRef, useEffect } from 'react';

interface ConjugationCellProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  status: boolean | null; // null = pristine, true = correct, false = incorrect
  correctAnswer: string;
  disabled: boolean;
}

export const ConjugationCell: React.FC<ConjugationCellProps> = ({
  label,
  value,
  onChange,
  status,
  correctAnswer,
  disabled
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus effect when status changes to null (reset) could be added here if we wanted auto-focus logic,
  // but simpler to let user tab through.

  let borderColor = "border-stone-300";
  let bgColor = "bg-white";
  let icon = null;

  if (status === true) {
    borderColor = "border-green-500";
    bgColor = "bg-green-50";
    icon = <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-bold text-xl">✓</span>;
  } else if (status === false) {
    borderColor = "border-red-500";
    bgColor = "bg-red-50";
    icon = <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 font-bold text-xl">✗</span>;
  }

  return (
    <div className={`relative group ${status === false ? 'animate-shake' : ''}`}>
      <label className="block text-xs font-bold text-stone-500 uppercase mb-1 ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || status === true}
          placeholder="e.g. laudatus, -a, -um sum"
          className={`w-full p-3 pr-10 rounded-lg border-2 ${borderColor} ${bgColor} 
            text-stone-800 font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400
            disabled:opacity-90 disabled:cursor-not-allowed`}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {icon}
      </div>
      {status === false && (
        <div className="text-xs text-red-600 mt-1 pl-1 font-semibold animate-pulse">
           Answer: {correctAnswer}
        </div>
      )}
    </div>
  );
};