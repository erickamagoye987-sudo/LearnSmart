import { UserProgress, UserSettings } from '../types';

const PROGRESS_KEY = 'learnsmart_user_progress_v1';
const SETTINGS_KEY = 'learnsmart_user_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  voiceSpeed: 0.85, // Friendly, clear pacing
  voicePitch: 1.1,
  soundEffectsEnabled: true,
  speechEnabled: true,
  sensoryCalmMode: false,
  highContrast: false,
  largeFont: false,
  dyslexicFont: false
};

export const DEFAULT_PROGRESS: UserProgress = {
  stars: 12,
  completedLetters: ['A', 'B', 'C'],
  completedNumbers: [1, 2, 3],
  quizzesCompleted: 1,
  quizzesCorrect: 1,
  currentStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  badges: ['welcome_star', 'alphabet_starter']
};

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load progress', e);
  }
  return DEFAULT_PROGRESS;
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress', e);
  }
}

export function addStars(count: number, currentProgress: UserProgress): UserProgress {
  const newStars = currentProgress.stars + count;
  const newProgress = { ...currentProgress, stars: newStars };
  saveProgress(newProgress);
  return newProgress;
}

export function markLetterCompleted(letter: string, currentProgress: UserProgress): UserProgress {
  if (currentProgress.completedLetters.includes(letter)) return currentProgress;
  const completed = [...currentProgress.completedLetters, letter];
  const badges = [...currentProgress.badges];
  if (completed.length >= 10 && !badges.includes('letter_explorer')) {
    badges.push('letter_explorer');
  }
  if (completed.length >= 26 && !badges.includes('alphabet_master')) {
    badges.push('alphabet_master');
  }
  const newProgress = {
    ...currentProgress,
    completedLetters: completed,
    stars: currentProgress.stars + 1,
    badges
  };
  saveProgress(newProgress);
  return newProgress;
}

export function markNumberCompleted(num: number, currentProgress: UserProgress): UserProgress {
  if (currentProgress.completedNumbers.includes(num)) return currentProgress;
  const completed = [...currentProgress.completedNumbers, num];
  const badges = [...currentProgress.badges];
  if (completed.length >= 10 && !badges.includes('counting_star')) {
    badges.push('counting_star');
  }
  if (completed.length >= 20 && !badges.includes('math_master')) {
    badges.push('math_master');
  }
  const newProgress = {
    ...currentProgress,
    completedNumbers: completed,
    stars: currentProgress.stars + 1,
    badges
  };
  saveProgress(newProgress);
  return newProgress;
}
