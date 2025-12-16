import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center border-t-8 border-amber-600">
      <h2 className="text-4xl font-bold text-stone-800 mb-6 serif-font">Salve, Discipule!</h2>
      <p className="text-stone-600 mb-6 text-lg leading-relaxed">
        Review the Latin <strong>Perfect</strong>, <strong>Pluperfect</strong>, and <strong>Future Perfect</strong> passive tenses.
      </p>
      
      <div className="bg-amber-50 p-6 rounded-xl text-left mb-8 border border-amber-100">
        <h3 className="font-bold text-amber-800 mb-3 text-xl">Instructions:</h3>
        <ul className="list-disc pl-5 space-y-2 text-stone-700">
          <li>You will be given a verb and a target tense.</li>
          <li>Fill in all 6 forms of the conjugation.</li>
          <li>
            <strong>Crucial:</strong> Provide all genders for the participle.
            <br/>
            <span className="text-sm text-stone-500 font-mono bg-white px-1 rounded">Correct: laudatus, -a, -um sum</span>
          </li>
          <li>Forms must include the correct form of <em>sum</em>.</li>
        </ul>
      </div>

      <button
        onClick={onStart}
        className="bg-amber-600 hover:bg-amber-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95"
      >
        Incipe (Start)
      </button>
    </div>
  );
};