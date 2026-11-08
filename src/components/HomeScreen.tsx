import React from 'react';
import { BookOpen, Hash, Award, Star, ArrowRight, Settings, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProgress, UserSettings } from '../types';
import { playSound, speakText } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface HomeScreenProps {
  onNavigate: (tab: 'home' | 'abcs' | 'numbers' | 'quiz') => void;
  onOpenSettings: () => void;
  onOpenProgress: () => void;
  progress: UserProgress;
  settings: UserSettings;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenSettings,
  onOpenProgress,
  progress,
  settings
}) => {
  const handleWelcomeSpeech = () => {
    speakText(
      "Welcome to LearnSmart! Learn, Explore and Grow! Choose Learn ABCs, Learn Numbers, or Take a Quiz!",
      settings
    );
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Friendly Welcome Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 text-white shadow-xl shadow-blue-500/15 border border-blue-400/30">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-6 sm:p-8 md:p-10">
          {/* Welcome Text Content */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-blue-50 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Inclusive Early Learning Space</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
              Welcome to LearnSmart!
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-yellow-300 font-heading">
              Learn, Explore and Grow!
            </p>

            <p className="text-sm sm:text-base text-blue-50 max-w-xl leading-relaxed">
              Step into a friendly, joyful learning adventure! Master your alphabet letters, count exciting numbers, and earn golden stars along the way.
            </p>

            {/* Audio greeting button & quick start */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  playSound('correct', settings);
                  onNavigate('abcs');
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:scale-102 active:scale-98"
              >
                <span>Start Learning Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleWelcomeSpeech}
                className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-blue-700/60 hover:bg-blue-700/80 text-white font-bold text-xs sm:text-sm backdrop-blur-xs border border-white/20 transition-all"
                title="Listen to welcome voice greeting"
                aria-label="Listen to welcome voice greeting"
              >
                <Volume2 className="w-4 h-4 text-yellow-300" />
                <span>Hear Greeting</span>
              </button>

              <PWAInstallButton variant="hero" />
            </div>
          </div>

          {/* Friendly Mascot Visual */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group max-w-[280px] sm:max-w-[320px]">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 bg-sky-200 aspect-4/3">
                <img
                  src="/src/assets/images/welcome_mascot_learnsmart_1794146467627.jpg"
                  alt="LearnSmart friendly owl mascot holding a storybook"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Star Badge */}
              <div className="absolute -bottom-3 -right-3 bg-white text-blue-900 px-3.5 py-1.5 rounded-2xl shadow-lg border border-blue-100 flex items-center gap-1.5 font-bold text-xs">
                <span>⭐</span>
                <span>Ready to Learn!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Summary Cards Bar */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-blue-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 font-heading flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              Your Progress Summary
            </h2>
            <p className="text-xs text-slate-500">
              Track what you’ve explored today
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound('star', settings);
                onOpenProgress();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>View All Badges</span>
            </button>

            <button
              onClick={() => {
                playSound('click', settings);
                onOpenSettings();
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Open Settings"
              aria-label="Open settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Progress KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col">
            <span className="text-xs text-amber-800 font-bold">Stars Earned</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-amber-900 tabular-nums font-heading">
                {progress.stars}
              </span>
              <span className="text-lg">⭐</span>
            </div>
            <span className="text-[11px] text-amber-700/80 mt-1">Keep it up!</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col">
            <span className="text-xs text-blue-800 font-bold">ABCs Mastered</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-blue-900 tabular-nums font-heading">
                {progress.completedLetters.length}
              </span>
              <span className="text-xs text-blue-600 font-bold">/ 26</span>
            </div>
            <span className="text-[11px] text-blue-700/80 mt-1">English Alphabet</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col">
            <span className="text-xs text-emerald-800 font-bold">Numbers Explored</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-emerald-900 tabular-nums font-heading">
                {progress.completedNumbers.length}
              </span>
              <span className="text-xs text-emerald-600 font-bold">/ 20</span>
            </div>
            <span className="text-[11px] text-emerald-700/80 mt-1">Numbers 1 to 20</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col">
            <span className="text-xs text-purple-800 font-bold">Badges Earned</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-purple-900 tabular-nums font-heading">
                {progress.badges.length}
              </span>
              <span className="text-lg">🏆</span>
            </div>
            <span className="text-[11px] text-purple-700/80 mt-1">Super achievements</span>
          </div>
        </div>
      </section>

      {/* THE THREE LARGE INTERACTIVE BUTTONS AS REQUESTED BY SPEC */}
      <section className="space-y-4">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
            Choose Your Learning Activity
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tap any of the 3 large buttons below to start learning right away!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BUTTON 1: LEARN ABCs */}
          <button
            onClick={() => {
              playSound('click', settings);
              onNavigate('abcs');
            }}
            className="group flex flex-col bg-white rounded-3xl overflow-hidden border-2 border-blue-200 hover:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-blue-400 cursor-pointer"
            aria-label="Open Module One: Learn ABCs"
          >
            {/* Visual Card Image */}
            <div className="relative w-full aspect-4/3 bg-blue-100 overflow-hidden">
              <img
                src="/src/assets/images/module_abc_illustration_1794146468365.jpg"
                alt="Colorful alphabet toy blocks showing letters A B C with red apple and ball"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-blue-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md">
                MODULE 1
              </div>
            </div>

            {/* Button Content */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-white space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Literacy & Phonics
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 font-heading group-hover:text-blue-600 transition-colors">
                  1. LEARN ABCs
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Discover all 26 letters from A to Z with clear pronunciation, illustrated words, fun facts, and hands-on finger tracing.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500">
                  {progress.completedLetters.length} / 26 Explored
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-extrabold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </button>

          {/* BUTTON 2: LEARN NUMBERS */}
          <button
            onClick={() => {
              playSound('click', settings);
              onNavigate('numbers');
            }}
            className="group flex flex-col bg-white rounded-3xl overflow-hidden border-2 border-emerald-200 hover:border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-emerald-400 cursor-pointer"
            aria-label="Open Module Two: Learn Numbers"
          >
            {/* Visual Card Image */}
            <div className="relative w-full aspect-4/3 bg-emerald-100 overflow-hidden">
              <img
                src="/src/assets/images/module_numbers_illustration_1794146468972.jpg"
                alt="Colorful wooden counting blocks with numbers 1 2 3 and counting rings"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-emerald-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md">
                MODULE 2
              </div>
            </div>

            {/* Button Content */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-white space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Hash className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Numeracy & Counting
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 font-heading group-hover:text-emerald-600 transition-colors">
                  2. LEARN NUMBERS
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Count from 1 to 20 with interactive tap-to-count items, ten-frame visualizers, cheerful rhymes, and audio counting.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500">
                  {progress.completedNumbers.length} / 20 Explored
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-extrabold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  <span>Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </button>

          {/* BUTTON 3: TAKE A QUIZ */}
          <button
            onClick={() => {
              playSound('click', settings);
              onNavigate('quiz');
            }}
            className="group flex flex-col bg-white rounded-3xl overflow-hidden border-2 border-amber-200 hover:border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-amber-400 cursor-pointer"
            aria-label="Open Module Three: Take a Quiz"
          >
            {/* Visual Card Image */}
            <div className="relative w-full aspect-4/3 bg-amber-100 overflow-hidden">
              <img
                src="/src/assets/images/module_quiz_trophy_1794146469117.jpg"
                alt="Joyful smiling gold star trophy with victory ribbon and confetti"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-amber-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md">
                MODULE 3
              </div>
            </div>

            {/* Button Content */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-white space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Fun Challenge & Rewards
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 font-heading group-hover:text-amber-600 transition-colors">
                  3. TAKE A QUIZ
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Put your skills to the test with encouraging multiple choice challenges, picture matching, and win shining gold stars!
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500">
                  {progress.quizzesCompleted} Quizzes Done
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-extrabold text-amber-600 group-hover:translate-x-1 transition-transform">
                  <span>Play Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Special Inclusive & ASD/ADHD friendly reassurance footer */}
      <section className="bg-blue-50/70 rounded-3xl p-6 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 font-heading">
              Designed for Every Learner
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Learn at your own pace with calm visual feedback, gentle voice narration, and sensory-friendly settings.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playSound('click', settings);
            onOpenSettings();
          }}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0"
        >
          Adjust Audio & Pacing
        </button>
      </section>
    </div>
  );
};
