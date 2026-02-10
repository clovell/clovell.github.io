import React, { useState } from 'react';
import { BookOpen, PenTool, GraduationCap } from 'lucide-react';
import IdentifyMode from './components/IdentifyMode';
import FormMode from './components/FormMode';
import { GameMode } from './types';

export default function App() {
  const [mode, setMode] = useState<GameMode>('home');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Latin Participles</h1>
          </div>
          {mode !== 'home' && (
             <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {mode === 'identify' ? 'Identification Mode' : 'Formation Mode'}
             </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {mode === 'home' && (
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-1 md:col-span-2 text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Master Latin Participles</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Practice identifying and forming Present Active, Perfect Passive, and Future Active participles with instant feedback.
              </p>
            </div>

            {/* Identify Card */}
            <button
              onClick={() => setMode('identify')}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:border-indigo-500 transition-all hover:shadow-xl text-left flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">Identify</h3>
              <p className="text-slate-500 mb-6">
                See a Latin participle and identify its tense, voice, and translation.
              </p>
              <div className="mt-auto flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                Start Practice &rarr;
              </div>
            </button>

            {/* Form Card */}
            <button
              onClick={() => setMode('form')}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:border-indigo-500 transition-all hover:shadow-xl text-left flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="bg-purple-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <PenTool className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">Form</h3>
              <p className="text-slate-500 mb-6">
                Given the principal parts, create the correct Latin participle form.
              </p>
              <div className="mt-auto flex items-center text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                Start Practice &rarr;
              </div>
            </button>
          </div>
        )}

        {mode === 'identify' && <IdentifyMode onBack={() => setMode('home')} />}
        {mode === 'form' && <FormMode onBack={() => setMode('home')} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Latin Participles.
        </div>
      </footer>
    </div>
  );
}