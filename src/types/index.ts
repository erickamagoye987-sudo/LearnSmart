export interface AlphabetItem {
  letter: string;
  lowercase: string;
  word: string;
  phonics: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  exampleSentence: string;
  funFact: string;
  soundCue: string;
}

export interface NumberItem {
  number: number;
  word: string;
  itemEmoji: string;
  itemName: string;
  color: string;
  bgColor: string;
  funFact: string;
  rhyme: string;
}

export interface QuizQuestion {
  id: string;
  type: 'letter_to_word' | 'word_to_letter' | 'number_count' | 'number_word';
  prompt: string;
  audioPrompt: string;
  visualCue?: string;
  options: {
    id: string;
    label: string;
    icon?: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface UserProgress {
  stars: number;
  completedLetters: string[];
  completedNumbers: number[];
  quizzesCompleted: number;
  quizzesCorrect: number;
  currentStreak: number;
  lastActiveDate: string;
  badges: string[];
}

export interface UserSettings {
  voiceSpeed: number; // 0.7 = slow (ASD/ADHD friendly), 1.0 = normal, 1.2 = fast
  voicePitch: number;
  soundEffectsEnabled: boolean;
  speechEnabled: boolean;
  sensoryCalmMode: boolean; // reduces intense colors and animations
  highContrast: boolean;
  largeFont: boolean;
  dyslexicFont: boolean;
}
