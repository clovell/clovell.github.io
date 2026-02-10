import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { Verb, ParticipleType, Question } from '../types';
import { VERB_LIST } from '../data/verbs';
import { generateParticipleData, isTranslationCorrect } from '../services/latinService';

interface Props {
  onBack: () => void;
}

const IdentifyMode: React.FC<Props> = ({ onBack }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedParticipleType, setSelectedParticipleType] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);

  const generateQuestion = () => {
    const randomVerb = VERB_LIST[Math.floor(Math.random() * VERB_LIST.length)];
    const types = [ParticipleType.PresentActive, ParticipleType.PerfectPassive, ParticipleType.FutureActive];
    
    // Filter out illogical types if necessary (e.g. Intransitive PPP), but for this simple app we assume standard transitive mostly
    // or just let it generate potentially awkward forms that are technically grammatically possible or standard drills.
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const data = generateParticipleData(randomVerb, randomType);
    
    setQuestion({
      verb: randomVerb,
      targetType: randomType,
      latinForm: data.latinDisplay.split(',')[0], // Show just the first part e.g. "Amans" or "Amatus"
      translationBase: data.translation
    });
    
    setSelectedParticipleType('');
    setTranslation('');
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    const isTypeCorrect = selectedParticipleType === question.targetType;
    const isTransCorrect = isTranslationCorrect(translation, question.verb.definition, question.targetType);

    if (isTypeCorrect && isTransCorrect) {
      setFeedback('correct');
      setStreak(s => s + 1);
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Menu
        </button>
        <div className="text-slate-500 font-medium">Streak: {streak}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Identify the Participle</h2>
          <div className="text-5xl font-bold text-slate-800 font-serif mb-2">{question.latinForm}</div>
          <p className="text-slate-500 italic">from {question.verb.principalParts.join(', ')} ({question.verb.definition})</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tense and Voice</label>
            <select 
              value={selectedParticipleType}
              onChange={(e) => setSelectedParticipleType(e.target.value)}
              className="w-full rounded-lg border-slate-200 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
              disabled={feedback !== null}
            >
              <option value="">Select Type...</option>
              <option value={ParticipleType.PresentActive}>Present Active</option>
              <option value={ParticipleType.PerfectPassive}>Perfect Passive</option>
              <option value={ParticipleType.FutureActive}>Future Active</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Translation</label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder=""
              className="w-full rounded-lg border-slate-200 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
              disabled={feedback !== null}
            />
          </div>

          {feedback === null ? (
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Check Answer
            </button>
          ) : (
            <div className={`rounded-lg p-6 ${feedback === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center mb-4">
                {feedback === 'correct' ? (
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600 mr-3" />
                )}
                <div>
                  <h3 className={`text-lg font-bold ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                    {feedback === 'correct' ? 'Excellent!' : 'Not quite right'}
                  </h3>
                  {feedback === 'incorrect' && (
                    <p className="text-red-700 mt-1">
                      Correct: <strong>{question.targetType}</strong>, translated as "<strong>{question.translationBase}</strong>"
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={generateQuestion}
                className={`w-full py-2 px-4 rounded-md font-semibold transition-colors flex items-center justify-center ${
                  feedback === 'correct' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Next Question
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default IdentifyMode;