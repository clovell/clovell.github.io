import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RefreshCcw, HelpCircle } from 'lucide-react';
import { Verb, ParticipleType, Question } from '../types';
import { VERB_LIST } from '../data/verbs';
import { generateParticipleData, isFormationCorrect } from '../services/latinService';

interface Props {
  onBack: () => void;
}

const FormMode: React.FC<Props> = ({ onBack }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);
  const [targetDisplayData, setTargetDisplayData] = useState<{latin: string, latinDisplay: string}>({latin: '', latinDisplay: ''});

  const generateQuestion = () => {
    const randomVerb = VERB_LIST[Math.floor(Math.random() * VERB_LIST.length)];
    const types = [ParticipleType.PresentActive, ParticipleType.PerfectPassive, ParticipleType.FutureActive];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const data = generateParticipleData(randomVerb, randomType);
    
    setQuestion({
      verb: randomVerb,
      targetType: randomType,
      latinForm: data.latin,
      translationBase: data.translation
    });
    setTargetDisplayData({ latin: data.latin, latinDisplay: data.latinDisplay });
    
    setUserAnswer('');
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    if (isFormationCorrect(userAnswer, targetDisplayData.latin, targetDisplayData.latinDisplay)) {
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
          <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Form the Participle</h2>
          <div className="text-2xl font-serif text-slate-700 mb-4 bg-slate-50 py-3 rounded-lg border border-slate-100">
            {question.verb.principalParts.join(', ')}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-slate-500 mb-1">Make this verb:</span>
            <span className="text-3xl font-bold text-indigo-600">{question.targetType}</span>
            <span className="text-slate-400 text-sm mt-2 italic">({question.translationBase})</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Answer (Latin)
                <span className="block text-xs text-slate-400 font-normal mt-0.5">Macrons optional. Acceptable formats: "amans", "amans, amantis", "amatus", "amatus -a -um".</span>
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type Latin form here..."
              className="w-full rounded-lg border-slate-200 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-serif text-lg bg-white text-slate-900"
              disabled={feedback !== null}
              autoFocus
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
                    {feedback === 'correct' ? 'Optime! (Excellent)' : 'Eheu! (Alas)'}
                  </h3>
                  {feedback === 'incorrect' && (
                    <div className="text-red-700 mt-1">
                      <p>Correct form: <strong>{targetDisplayData.latinDisplay}</strong></p>
                    </div>
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
                <RefreshCcw className="w-4 h-4 mr-2" /> Next Verb
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormMode;