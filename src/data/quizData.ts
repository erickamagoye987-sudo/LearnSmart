import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'letter_to_word',
    prompt: 'Which letter does "Apple" start with?',
    audioPrompt: 'Which letter does Apple start with? A, B, or C?',
    visualCue: '🍎',
    options: [
      { id: 'opt_a', label: 'Letter A', icon: '🅰️', isCorrect: true },
      { id: 'opt_b', label: 'Letter B', icon: '🅱️', isCorrect: false },
      { id: 'opt_c', label: 'Letter C', icon: '🅲', isCorrect: false }
    ],
    explanation: 'Awesome! A is for Apple! A says ah, ah, Apple!'
  },
  {
    id: 'q2',
    type: 'word_to_letter',
    prompt: 'Which picture starts with the letter "B"?',
    audioPrompt: 'Which picture starts with the letter B? Ball, Apple, or Cat?',
    visualCue: '🅱️',
    options: [
      { id: 'opt_b1', label: 'Ball', icon: '⚽', isCorrect: true },
      { id: 'opt_b2', label: 'Cat', icon: '🐱', isCorrect: false },
      { id: 'opt_b3', label: 'Fish', icon: '🐟', isCorrect: false }
    ],
    explanation: 'Super star! B is for Ball! Bounce the ball high!'
  },
  {
    id: 'q3',
    type: 'number_count',
    prompt: 'How many golden stars can you count?',
    audioPrompt: 'How many golden stars can you count? Let us count them together!',
    visualCue: '⭐⭐⭐',
    options: [
      { id: 'num_2', label: '2', isCorrect: false },
      { id: 'num_3', label: '3', isCorrect: true },
      { id: 'num_4', label: '4', isCorrect: false }
    ],
    explanation: 'Brilliant! One, Two, Three! There are 3 golden stars!'
  },
  {
    id: 'q4',
    type: 'letter_to_word',
    prompt: 'Which animal says "meow" and starts with letter "C"?',
    audioPrompt: 'Which animal says meow and starts with letter C?',
    visualCue: '🐾',
    options: [
      { id: 'c_dog', label: 'Dog', icon: '🐶', isCorrect: false },
      { id: 'c_cat', label: 'Cat', icon: '🐱', isCorrect: true },
      { id: 'c_elephant', label: 'Elephant', icon: '🐘', isCorrect: false }
    ],
    explanation: 'Fantastic! C is for Cat! Purr purr, meow!'
  },
  {
    id: 'q5',
    type: 'number_word',
    prompt: 'Which number is "FIVE"?',
    audioPrompt: 'Can you find the number Five?',
    visualCue: '✋',
    options: [
      { id: 'n5_4', label: '4', isCorrect: false },
      { id: 'n5_5', label: '5', isCorrect: true },
      { id: 'n5_6', label: '6', isCorrect: false }
    ],
    explanation: 'You did it! Five is 5! High five to you!'
  },
  {
    id: 'q6',
    type: 'number_count',
    prompt: 'Count the colourful balloons! How many are there?',
    audioPrompt: 'Count the balloons floating in the air!',
    visualCue: '🎈🎈🎈🎈',
    options: [
      { id: 'bal_3', label: '3 Balloons', isCorrect: false },
      { id: 'bal_4', label: '4 Balloons', isCorrect: true },
      { id: 'bal_5', label: '5 Balloons', isCorrect: false }
    ],
    explanation: 'Hooray! 1, 2, 3, 4! Exactly 4 floating balloons!'
  },
  {
    id: 'q7',
    type: 'word_to_letter',
    prompt: 'Which creature swims in water and starts with letter "F"?',
    audioPrompt: 'Which creature swims in water and starts with letter F?',
    visualCue: '🌊',
    options: [
      { id: 'f_fish', label: 'Fish', icon: '🐟', isCorrect: true },
      { id: 'f_lion', label: 'Lion', icon: '🦁', isCorrect: false },
      { id: 'f_goat', label: 'Goat', icon: '🐐', isCorrect: false }
    ],
    explanation: 'Great job! F is for Fish, swimming happily in the water!'
  },
  {
    id: 'q8',
    type: 'letter_to_word',
    prompt: 'Which letter does "Lion" start with?',
    audioPrompt: 'Which letter does Lion start with? L, M, or N?',
    visualCue: '🦁',
    options: [
      { id: 'l_k', label: 'Letter K', icon: '🅺', isCorrect: false },
      { id: 'l_l', label: 'Letter L', icon: '🅻', isCorrect: true },
      { id: 'l_m', label: 'Letter M', icon: '🅼', isCorrect: false }
    ],
    explanation: 'Roar! L is for Lion, the brave king of animals!'
  },
  {
    id: 'q9',
    type: 'number_count',
    prompt: 'How many juicy apples are in the basket?',
    audioPrompt: 'Count the red apples! How many do you see?',
    visualCue: '🍎🍎',
    options: [
      { id: 'app_1', label: '1 Apple', isCorrect: false },
      { id: 'app_2', label: '2 Apples', isCorrect: true },
      { id: 'app_3', label: '3 Apples', isCorrect: false }
    ],
    explanation: 'Spot on! There are 2 crisp, sweet red apples!'
  },
  {
    id: 'q10',
    type: 'letter_to_word',
    prompt: 'Which fruit is sweet, golden, and starts with letter "M"?',
    audioPrompt: 'Which fruit is sweet and golden, and starts with letter M? Mango, Nest, or Orange?',
    visualCue: '🥭',
    options: [
      { id: 'm_mango', label: 'Mango', icon: '🥭', isCorrect: true },
      { id: 'm_nest', label: 'Nest', icon: '🪺', isCorrect: false },
      { id: 'm_orange', label: 'Orange', icon: '🍊', isCorrect: false }
    ],
    explanation: 'Yummy! M is for Mango, the sweet golden king of fruits!'
  }
];
