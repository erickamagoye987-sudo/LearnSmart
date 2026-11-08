import React from 'react';
import { X, Award, Star, CheckCircle, Sparkles, BookOpen, Trophy } from 'lucide-react';
import { UserProgress, UserSettings } from '../types';
import { playSound } from '../utils/audio';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  settings: UserSettings;
}

const ALL_BADGES = [
  {
    id: 'welcome_star',
    title: 'First Step!',
    description: 'Welcome to LearnSmart',
    icon: '🌟',
    color: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'alphabet_starter',
    title: 'ABC Explorer',
    description: 'Explored your first 3 letters',
    icon: '🔤',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'letter_explorer',
    title: 'Letter Detective',
    description: 'Learned 10 alphabet letters',
    icon: '🔍',
    color: 'from-emerald-400 to-teal-600'
  },
  {
    id: 'alphabet_master',
    title: 'Alphabet Master',
    description: 'Learned all 26 letters from A to Z!',
    icon: '👑',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'counting_star',
    title: 'Counting Star',
    description: 'Learned numbers 1 through 10',
    icon: '🔢',
    color: 'from-cyan-400 to-blue-600'
  },
  {
    id: 'math_master',
    title: 'Number Hero',
    description: 'Counted all numbers up to 20!',
    icon: '🚀',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'quiz_hero',
    title: 'Quiz Champion',
    description: 'Completed a learning quiz challenge',
    icon: '🏆',
    color: 'from-yellow-400 to-amber-600'
  }
];

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
  settings
}) => {
  if (!isOpen) return null;

  const letterPercent = Math.round((progress.completedLetters.length / 26) * 100);
  const numberPercent = Math.round((progress.completedNumbers.length / 20) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-blue-100 flex flex-col max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 id="progress-title" className="text-xl font-bold text-slate-900 font-heading">
                My Learning Journey
              </h3>
              <p className="text-xs text-slate-500">
                Look at all the amazing things you have achieved!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click', settings);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Close progress"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Stars Banner */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-white flex items-center justify-between shadow-md shadow-amber-500/20">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-100 block">
              Total Golden Stars
            </span>
            <span className="text-3xl font-extrabold font-heading">
              {progress.stars} Stars
            </span>
            <p className="text-xs text-amber-50 mt-0.5">
              Keep learning to collect more shining stars!
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl">
            ⭐
          </div>
        </div>

        {/* Milestone Progress Bars */}
        <div className="mt-5 space-y-4">
          {/* Alphabet Progress */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-slate-800 font-heading">Alphabet Explorer</span>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {progress.completedLetters.length} / 26 Letters
              </span>
            </div>
            <div className="w-full bg-blue-200/60 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${letterPercent}%` }}
              />
            </div>
          </div>

          {/* Numbers Progress */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-slate-800 font-heading">Counting Mastery</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {progress.completedNumbers.length} / 20 Numbers
              </span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${numberPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="mt-5">
          <h4 className="text-sm font-bold text-slate-800 font-heading mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            Special Achievement Badges
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_BADGES.map(badge => {
              const isUnlocked = progress.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isUnlocked
                      ? 'bg-white border-amber-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200/80 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">
                    {badge.title}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-2">
                    {badge.description}
                  </p>
                  {isUnlocked && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 mt-1.5">
                      <CheckCircle className="w-2.5 h-2.5" /> Unlocked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-5 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              playSound('click', settings);
              onClose();
            }}
            className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};
