import React from 'react';
import { Settings, Sparkles, BookOpen, Hash, Award, Home as HomeIcon } from 'lucide-react';
import { UserProgress, UserSettings } from '../types';
import { playSound } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: 'home' | 'abcs' | 'numbers' | 'quiz';
  onNavigate: (tab: 'home' | 'abcs' | 'numbers' | 'quiz') => void;
  onOpenSettings: () => void;
  onOpenProgress: () => void;
  progress: UserProgress;
  settings: UserSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenSettings,
  onOpenProgress,
  progress,
  settings
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => {
            playSound('click', settings);
            onNavigate('home');
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-blue-900 font-heading whitespace-nowrap shrink-0">
            Learn<span className="text-blue-600">Smart</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links (Clean, single line text links) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 lg:gap-4">
          <button
            onClick={() => {
              playSound('click', settings);
              onNavigate('home');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'home'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              playSound('click', settings);
              onNavigate('abcs');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'abcs'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Learn ABCs</span>
          </button>

          <button
            onClick={() => {
              playSound('click', settings);
              onNavigate('numbers');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'numbers'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>Learn Numbers</span>
          </button>

          <button
            onClick={() => {
              playSound('click', settings);
              onNavigate('quiz');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'quiz'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Take a Quiz</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area (Stars summary, Install button & Settings) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* PWA In-App Install Button */}
          <PWAInstallButton variant="header" />

          {/* Interactive Star Pill */}
          <button
            onClick={() => {
              playSound('star', settings);
              onOpenProgress();
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 transition-colors cursor-pointer group"
            title="View learning stars & badges"
            aria-label="View learning stars"
          >
            <span className="text-base group-hover:scale-125 transition-transform">⭐</span>
            <span className="text-xs sm:text-sm font-bold tabular-nums text-amber-700 font-heading">
              {progress.stars}
            </span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => {
              playSound('click', settings);
              onOpenSettings();
            }}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Settings & Accessibility"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar for Android smartphones & small tablets */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-100 px-2 py-1.5">
        <button
          onClick={() => {
            playSound('click', settings);
            onNavigate('home');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[11px] font-bold ${
            currentTab === 'home' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <HomeIcon className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            playSound('click', settings);
            onNavigate('abcs');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[11px] font-bold ${
            currentTab === 'abcs' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>ABCs</span>
        </button>

        <button
          onClick={() => {
            playSound('click', settings);
            onNavigate('numbers');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[11px] font-bold ${
            currentTab === 'numbers' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Hash className="w-4 h-4 mb-0.5" />
          <span>Numbers</span>
        </button>

        <button
          onClick={() => {
            playSound('click', settings);
            onNavigate('quiz');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[11px] font-bold ${
            currentTab === 'quiz' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Award className="w-4 h-4 mb-0.5" />
          <span>Quiz</span>
        </button>
      </div>
    </header>
  );
};
