/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { AlphabetModule } from './components/AlphabetModule';
import { NumbersModule } from './components/NumbersModule';
import { QuizModule } from './components/QuizModule';
import { SettingsModal } from './components/SettingsModal';
import { ProgressModal } from './components/ProgressModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  loadProgress,
  saveProgress,
  loadSettings,
  saveSettings,
  markLetterCompleted,
  markNumberCompleted,
  addStars,
  DEFAULT_PROGRESS
} from './utils/storage';
import { UserProgress, UserSettings } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'abcs' | 'numbers' | 'quiz'>('home');
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  // Sync settings when modified
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Sync progress
  const handleCompleteLetter = (letter: string) => {
    const updated = markLetterCompleted(letter, progress);
    setProgress(updated);
  };

  const handleCompleteNumber = (num: number) => {
    const updated = markNumberCompleted(num, progress);
    setProgress(updated);
  };

  const handleAwardStars = (count: number) => {
    const updated = addStars(count, progress);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    const reset = { ...DEFAULT_PROGRESS, stars: 0, completedLetters: [], completedNumbers: [], badges: ['welcome_star'] };
    setProgress(reset);
    saveProgress(reset);
  };

  // Apply sensory calm or high contrast mode classes to root container
  const containerClasses = [
    'min-h-screen flex flex-col transition-colors duration-300',
    settings.sensoryCalmMode
      ? 'bg-slate-100 text-slate-800'
      : 'bg-gradient-to-b from-sky-50 via-blue-50/40 to-slate-50 text-slate-900',
    settings.highContrast ? 'contrast-125' : '',
    settings.largeFont ? 'text-lg' : 'text-base'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProgress={() => setIsProgressOpen(true)}
        progress={progress}
        settings={settings}
      />

      {/* Main Learning Canvas */}
      <main className="flex-1 py-6 sm:py-8">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigate={setCurrentTab}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenProgress={() => setIsProgressOpen(true)}
            progress={progress}
            settings={settings}
          />
        )}

        {currentTab === 'abcs' && (
          <AlphabetModule
            onBackToHome={() => setCurrentTab('home')}
            progress={progress}
            settings={settings}
            onCompleteLetter={handleCompleteLetter}
          />
        )}

        {currentTab === 'numbers' && (
          <NumbersModule
            onBackToHome={() => setCurrentTab('home')}
            progress={progress}
            settings={settings}
            onCompleteNumber={handleCompleteNumber}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizModule
            onBackToHome={() => setCurrentTab('home')}
            progress={progress}
            settings={settings}
            onAwardStars={handleAwardStars}
          />
        )}
      </main>

      {/* Clean Learner-Friendly Footer */}
      <footer className="border-t border-blue-100/80 bg-white/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-600">
            LearnSmart – Learn, Explore and Grow!
          </p>
          <p className="text-slate-400">
            Interactive, inclusive learning for young minds and neurodivergent learners
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
      />

      {/* Progress & Badges Modal */}
      <ProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        progress={progress}
        settings={settings}
      />

      {/* Offline Connectivity State Indicator */}
      <OfflineIndicator />
    </div>
  );
}
