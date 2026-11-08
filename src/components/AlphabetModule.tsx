import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Sparkles, Check, ArrowLeft, Pencil, BookOpen } from 'lucide-react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { AlphabetItem, UserProgress, UserSettings } from '../types';
import { playSound, speakText } from '../utils/audio';
import { TracingCanvas } from './TracingCanvas';

interface AlphabetModuleProps {
  onBackToHome: () => void;
  progress: UserProgress;
  settings: UserSettings;
  onCompleteLetter: (letter: string) => void;
}

export const AlphabetModule: React.FC<AlphabetModuleProps> = ({
  onBackToHome,
  progress,
  settings,
  onCompleteLetter
}) => {
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem>(ALPHABET_DATA[0]);
  const [caseMode, setCaseMode] = useState<'both' | 'upper' | 'lower'>('both');
  const [activeTab, setActiveTab] = useState<'explore' | 'trace'>('explore');

  const currentIndex = ALPHABET_DATA.findIndex(item => item.letter === selectedLetter.letter);
  const isCompleted = progress.completedLetters.includes(selectedLetter.letter);

  const handleSelectLetter = (item: AlphabetItem) => {
    setSelectedLetter(item);
    playSound('click', settings);
    speakLetter(item);
  };

  const speakLetter = (item: AlphabetItem) => {
    // E.g., "Letter A. A says ah! Apple!"
    const textToSpeak = `Letter ${item.letter}. ${item.letter} says ${item.phonics}! ${item.word}!`;
    speakText(textToSpeak, settings);
  };

  const handlePrevLetter = () => {
    const prevIdx = (currentIndex - 1 + ALPHABET_DATA.length) % ALPHABET_DATA.length;
    handleSelectLetter(ALPHABET_DATA[prevIdx]);
  };

  const handleNextLetter = () => {
    const nextIdx = (currentIndex + 1) % ALPHABET_DATA.length;
    handleSelectLetter(ALPHABET_DATA[nextIdx]);
  };

  const handleMarkCompleted = () => {
    onCompleteLetter(selectedLetter.letter);
    playSound('star', settings);
  };

  const formatLetterDisplay = (item: AlphabetItem) => {
    if (caseMode === 'upper') return item.letter;
    if (caseMode === 'lower') return item.lowercase;
    return `${item.letter} ${item.lowercase}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 pb-12">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-blue-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSound('click', settings);
              onBackToHome();
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors flex items-center gap-1.5 font-bold text-xs sm:text-sm"
            aria-label="Return to Home Screen"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-blue-900 font-heading">
              Module 1: Learn ABCs
            </h1>
            <p className="text-xs text-slate-500">
              Select any letter from A to Z to hear its sound, word, and fun fact!
            </p>
          </div>
        </div>

        {/* Uppercase / Lowercase Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-stretch sm:self-auto justify-center">
          <button
            onClick={() => {
              setCaseMode('both');
              playSound('click', settings);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              caseMode === 'both'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aa Both
          </button>
          <button
            onClick={() => {
              setCaseMode('upper');
              playSound('click', settings);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              caseMode === 'upper'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            A Upper
          </button>
          <button
            onClick={() => {
              setCaseMode('lower');
              playSound('click', settings);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              caseMode === 'lower'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            a Lower
          </button>
        </div>
      </div>

      {/* Main Focus Stage: Selected Letter Detailed Experience */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-md">
        {/* Stage Viewport Tabs: Explore Word vs Finger Tracing */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('explore');
                playSound('click', settings);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'explore'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Letter & Word</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('trace');
                playSound('click', settings);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'trace'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Pencil className="w-4 h-4" />
              <span>Trace Letter {selectedLetter.letter}</span>
            </button>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevLetter}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Previous Letter"
              aria-label="Previous letter"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-slate-600 tabular-nums px-2">
              {currentIndex + 1} of 26
            </span>

            <button
              onClick={handleNextLetter}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Next Letter"
              aria-label="Next letter"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === 'explore' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Big Colorful Letter Card with Audio & Phonics */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-blue-50/80 border-4 border-blue-300 flex flex-col items-center justify-center p-4 shadow-inner">
                {/* Large Letter */}
                <span className="text-7xl sm:text-8xl font-black text-blue-600 font-heading tracking-tight select-none">
                  {formatLetterDisplay(selectedLetter)}
                </span>

                {/* Phonics Sound Badge */}
                <div className="mt-2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-xs">
                  Phonics sound: "{selectedLetter.phonics}"
                </div>

                {isCompleted && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1.5 rounded-full shadow-md" title="Mastered!">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Big Pronunciation Audio Button */}
              <div className="mt-5 w-full max-w-xs flex flex-col gap-2">
                <button
                  onClick={() => speakLetter(selectedLetter)}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all hover:scale-102 active:scale-98"
                  aria-label={`Pronounce letter ${selectedLetter.letter}`}
                >
                  <Volume2 className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <span>Hear Pronunciation</span>
                </button>

                <button
                  onClick={handleMarkCompleted}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isCompleted ? 'Letter Mastered! ⭐' : 'Mark as Mastered (+1 Star)'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Corresponding Word, Visual Icon, Sentence & Fun Fact */}
            <div className="md:col-span-7 space-y-5 bg-slate-50/70 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white border-2 border-blue-200 shadow-sm flex items-center justify-center text-5xl sm:text-6xl shrink-0">
                  {selectedLetter.icon}
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
                    Letter {selectedLetter.letter} is for...
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                    {selectedLetter.word}
                  </h3>
                  <button
                    onClick={() => speakText(`${selectedLetter.word}`, settings)}
                    className="mt-1 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Say "{selectedLetter.word}"</span>
                  </button>
                </div>
              </div>

              {/* Example Sentence */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Example Sentence
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-800">
                  "{selectedLetter.exampleSentence}"
                </p>
                <button
                  onClick={() => speakText(selectedLetter.exampleSentence, settings)}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Read aloud sentence</span>
                </button>
              </div>

              {/* Fun Fact / Special Educational Context */}
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/70 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1 flex items-center gap-1">
                  <span>💡</span>
                  <span>Fun Learning Fact</span>
                </span>
                <p className="text-xs sm:text-sm font-semibold text-amber-900">
                  {selectedLetter.funFact}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Tracing Mode */
          <div className="flex flex-col items-center">
            <TracingCanvas
              symbol={selectedLetter.letter}
              subText={`Practice tracing uppercase letter ${selectedLetter.letter}!`}
              settings={settings}
              onComplete={handleMarkCompleted}
            />
          </div>
        )}
      </div>

      {/* 26-LETTER ATTRACTIVE GRID (A to Z) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 font-heading">
              Alphabet Overview (A to Z)
            </h2>
            <p className="text-xs text-slate-500">
              Tap any letter card to hear it and explore its details
            </p>
          </div>

          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {progress.completedLetters.length} of 26 Mastered
          </span>
        </div>

        {/* The 26 Alphabet Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-2.5 sm:gap-3">
          {ALPHABET_DATA.map(item => {
            const isSelected = item.letter === selectedLetter.letter;
            const itemCompleted = progress.completedLetters.includes(item.letter);

            return (
              <button
                key={item.letter}
                onClick={() => handleSelectLetter(item)}
                className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md scale-105 z-10'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-slate-800'
                }`}
                aria-label={`Letter ${item.letter} for ${item.word}`}
              >
                {/* Completed Check Dot */}
                {itemCompleted && (
                  <span
                    className={`absolute top-1.5 right-1.5 text-[10px] ${
                      isSelected ? 'text-yellow-300' : 'text-emerald-500'
                    }`}
                  >
                    ★
                  </span>
                )}

                {/* Letter */}
                <span className="text-2xl sm:text-3xl font-black font-heading leading-tight">
                  {caseMode === 'lower' ? item.lowercase : item.letter}
                </span>

                {/* Mini Word & Icon */}
                <span className="text-sm mt-0.5">{item.icon}</span>
                <span
                  className={`text-[10px] font-bold mt-0.5 truncate max-w-full ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {item.word}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
