import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Button from './Button';

interface HelpProps {
  onBack: () => void;
}

const Help: React.FC<HelpProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <Button variant="ghost" onClick={onBack} className="mb-6 flex items-center gap-2 pl-0">
        <ArrowLeft size={20} /> Back to Practice
      </Button>

      <div className="bg-white p-8 rounded-xl shadow-xl border border-stone-200">
        <div className="flex items-center gap-3 mb-6 border-b border-stone-200 pb-4">
          <BookOpen className="text-roman-red" size={32} />
          <h2 className="text-3xl font-display text-roman-dark">Identifying Conjugations</h2>
        </div>

        <div className="prose prose-stone max-w-none text-lg">
          <p className="mb-6">
            To determine the conjugation of a Latin verb, you must look primarily at the 
            <strong> Second Principal Part (Infinitive)</strong> and the <strong>First Principal Part (Present Indicative)</strong>.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-stone-50 p-6 rounded-lg border-l-4 border-roman-red">
              <h3 className="font-display text-xl font-bold mb-2">1st Conjugation</h3>
              <p className="mb-2"><strong>Stem vowel:</strong> Ā</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>1st P.P. ends in <strong>-ō</strong></li>
                <li>2nd P.P. ends in <strong>-āre</strong></li>
              </ul>
              <div className="mt-3 text-sm text-stone-500 italic">Ex: amō, amāre</div>
            </div>

            <div className="bg-stone-50 p-6 rounded-lg border-l-4 border-roman-gold">
              <h3 className="font-display text-xl font-bold mb-2">2nd Conjugation</h3>
              <p className="mb-2"><strong>Stem vowel:</strong> Ē (Long)</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>1st P.P. ends in <strong>-eō</strong></li>
                <li>2nd P.P. ends in <strong>-ēre</strong> (long 'e')</li>
              </ul>
              <div className="mt-3 text-sm text-stone-500 italic">Ex: moneō, monēre</div>
            </div>

            <div className="bg-stone-50 p-6 rounded-lg border-l-4 border-stone-400">
              <h3 className="font-display text-xl font-bold mb-2">3rd Conjugation</h3>
              <p className="mb-2"><strong>Stem vowel:</strong> E (Short)</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>1st P.P. ends in <strong>-ō</strong></li>
                <li>2nd P.P. ends in <strong>-ere</strong> (short 'e')</li>
              </ul>
              <div className="mt-3 text-sm text-stone-500 italic">Ex: regō, regere</div>
            </div>

            <div className="bg-stone-50 p-6 rounded-lg border-l-4 border-stone-600">
              <h3 className="font-display text-xl font-bold mb-2">3rd Conjugation (-io)</h3>
              <p className="mb-2"><strong>Hybrid of 3rd & 4th</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>1st P.P. ends in <strong>-iō</strong></li>
                <li>2nd P.P. ends in <strong>-ere</strong> (short 'e')</li>
              </ul>
              <div className="mt-3 text-sm text-stone-500 italic">Ex: capiō, capere</div>
            </div>

            <div className="bg-stone-50 p-6 rounded-lg border-l-4 border-roman-dark">
              <h3 className="font-display text-xl font-bold mb-2">4th Conjugation</h3>
              <p className="mb-2"><strong>Stem vowel:</strong> Ī</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>1st P.P. ends in <strong>-iō</strong></li>
                <li>2nd P.P. ends in <strong>-īre</strong></li>
              </ul>
              <div className="mt-3 text-sm text-stone-500 italic">Ex: audiō, audīre</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;