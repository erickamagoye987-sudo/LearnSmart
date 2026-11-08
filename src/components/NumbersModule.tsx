import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Sparkles, Check, ArrowLeft, Pencil, RotateCcw } from 'lucide-react';
import { NUMBERS_DATA } from '../data/numbersData';
import { NumberItem, UserProgress, UserSettings } from '../types';
import { playSound, speakText } from '../utils/audio';
import { TracingCanvas } from './TracingCanvas';

interface NumbersModuleProps {
  onBackToHome: () => void;
  progress: UserProgress;
  settings: UserSettings;
  onCompleteNumber: (num: number) => void;
}

export const NumbersModule: React.FC<NumbersModuleProps> = ({
  onBackToHome,
  progress,
  settings,
  onCompleteNumber
}) => {
  const [selectedNumber, setSelectedNumber] = useState<NumberItem>(NUMBERS_DATA[0]);
  const [countedItems, setCountedItems] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'count' | 'trace'>('count');

  const currentIndex = NUMBERS_DATA.findIndex(item => item.number === selectedNumber.number);
  const isCompleted = progress.completedNumbers.includes(selectedNumber.number);

  const handleSelectNumber = (item: NumberItem) => {
    setSelectedNumber(item);
    setCountedItems([]);
    playSound('click', settings);
    speakNumber(item);
  };

  const speakNumber = (item: NumberItem) => {
    const textToSpeak = `Number ${item.number}. ${item.word}! Let us count ${item.number} ${item.itemName}!`;
    speakText(textToSpeak, settings);
  };

  const handlePrevNumber = () => {
    const prevIdx = (currentIndex - 1 + NUMBERS_DATA.length) % NUMBERS_DATA.length;
    handleSelectNumber(NUMBERS_DATA[prevIdx]);
  };

  const handleNextNumber = () => {
    const nextIdx = (currentIndex + 1) % NUMBERS_DATA.length;
    handleSelectNumber(NUMBERS_DATA[nextIdx]);
  };

  const handleTapItem = (index: number) => {
    if (!countedItems.includes(index)) {
      const nextCount = countedItems.length + 1;
      const updated = [...countedItems, index];
      setCountedItems(updated);
      playSound('count', settings);
      speakText(`${nextCount}`, settings);

      if (updated.length === selectedNumber.number) {
        setTimeout(() => {
          playSound('correct', settings);
          speakText(`Hooray! That is all ${selectedNumber.number} ${selectedNumber.itemName}!`, settings);
        }, 300);
      }
    }
  };

  const resetCount = () => {
    setCountedItems([]);
    playSound('click', settings);
  };

  const handleMarkCompleted = () => {
    onCompleteNumber(selectedNumber.number);
    playSound('star', settings);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 pb-12">
      {/* Header and Breadcrumb */}
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
              Module 2: Learn Numbers
            </h1>
            <p className="text-xs text-slate-500">
              Count interactive items from 1 to 20, practice ten-frames, and trace numbers!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            {progress.completedNumbers.length} of 20 Mastered
          </span>
        </div>
      </div>

      {/* Main Focus Stage for Selected Number */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md">
        {/* Navigation & Mode Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('count');
                playSound('click', settings);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'count'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Count & Explore</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('trace');
                playSound('click', settings);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'trace'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Pencil className="w-4 h-4" />
              <span>Trace Number {selectedNumber.number}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevNumber}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Previous Number"
              aria-label="Previous number"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-slate-600 tabular-nums px-2">
              {selectedNumber.number} of 20
            </span>

            <button
              onClick={handleNextNumber}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Next Number"
              aria-label="Next number"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === 'count' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Big Colorful Number & Word */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-emerald-50/80 border-4 border-emerald-300 flex flex-col items-center justify-center p-4 shadow-inner">
                <span className="text-7xl sm:text-8xl font-black text-emerald-600 font-heading tracking-tight select-none">
                  {selectedNumber.number}
                </span>

                <span className="text-2xl font-extrabold text-emerald-800 font-heading mt-1 uppercase tracking-wider">
                  {selectedNumber.word}
                </span>

                {isCompleted && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 w-full max-w-xs flex flex-col gap-2">
                <button
                  onClick={() => speakNumber(selectedNumber)}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all hover:scale-102 active:scale-98"
                >
                  <Volume2 className="w-5 h-5 text-yellow-300" />
                  <span>Hear Number Sound</span>
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
                  <span>{isCompleted ? 'Number Mastered! ⭐' : 'Mark as Mastered (+1 Star)'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Tap-To-Count Objects Arena & Ten-Frame */}
            <div className="md:col-span-7 space-y-5 bg-slate-50/70 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 font-heading">
                    Tap to Count the {selectedNumber.itemName}!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tap each item to count aloud ({countedItems.length} of {selectedNumber.number} tapped)
                  </p>
                </div>

                {countedItems.length > 0 && (
                  <button
                    onClick={resetCount}
                    className="p-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white rounded-lg border border-slate-200 flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Interactive Countable Objects Grid */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 min-h-[140px] flex items-center justify-center">
                <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center max-w-md">
                  {Array.from({ length: selectedNumber.number }).map((_, idx) => {
                    const isTapped = countedItems.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTapItem(idx)}
                        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-2xl sm:text-3xl flex items-center justify-center transition-all transform cursor-pointer ${
                          isTapped
                            ? 'bg-emerald-100 ring-4 ring-emerald-400 scale-110 shadow-md animate-bounce'
                            : 'bg-slate-100 hover:bg-emerald-50 hover:scale-105 active:scale-95'
                        }`}
                        title={`Tap to count ${idx + 1}`}
                        aria-label={`Count item ${idx + 1}`}
                      >
                        <span>{selectedNumber.itemEmoji}</span>
                        {isTapped && (
                          <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {idx + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ten-Frame Visualizer (Pedagogical Math Tool) */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Ten-Frame Representation
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {selectedNumber.number <= 10
                      ? `${selectedNumber.number} in ten-frame`
                      : `10 + ${selectedNumber.number - 10} extra`}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 max-w-xs mx-auto">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-9 rounded-lg border-2 flex items-center justify-center text-xs font-bold ${
                        i < Math.min(selectedNumber.number, 10)
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                          : 'border-dashed border-slate-200 bg-slate-50 text-slate-300'
                      }`}
                    >
                      {i < Math.min(selectedNumber.number, 10) ? '●' : ''}
                    </div>
                  ))}
                </div>
              </div>

              {/* Number Rhyme */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-emerald-950">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Catchy Number Rhyme
                </span>
                <p className="text-sm font-bold">"{selectedNumber.rhyme}"</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <TracingCanvas
              symbol={`${selectedNumber.number}`}
              subText={`Practice writing number ${selectedNumber.number} (${selectedNumber.word})!`}
              settings={settings}
              onComplete={handleMarkCompleted}
            />
          </div>
        )}
      </div>

      {/* Numbers Grid (1 to 20) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 font-heading">
              Numbers 1 to 20 Grid
            </h2>
            <p className="text-xs text-slate-500">
              Select any number to practice counting and ten-frames
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {progress.completedNumbers.length} / 20 Completed
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3">
          {NUMBERS_DATA.map(item => {
            const isSelected = item.number === selectedNumber.number;
            const itemCompleted = progress.completedNumbers.includes(item.number);

            return (
              <button
                key={item.number}
                onClick={() => handleSelectNumber(item)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-md scale-105 z-10'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-800'
                }`}
                aria-label={`Number ${item.number}`}
              >
                {itemCompleted && (
                  <span
                    className={`absolute top-1 right-1 text-[10px] ${
                      isSelected ? 'text-yellow-300' : 'text-emerald-500'
                    }`}
                  >
                    ★
                  </span>
                )}

                <span className="text-2xl sm:text-3xl font-black font-heading leading-tight">
                  {item.number}
                </span>

                <span className="text-sm mt-0.5">{item.itemEmoji}</span>
                <span
                  className={`text-[10px] font-bold mt-0.5 truncate max-w-full ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500'
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
