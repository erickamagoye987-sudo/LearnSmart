import React, { useState, useEffect } from 'react';
import { Volume2, Award, ArrowLeft, RotateCcw, CheckCircle2, Heart, Sparkles, Trophy } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion, UserProgress, UserSettings } from '../types';
import { playSound, speakText } from '../utils/audio';

interface QuizModuleProps {
  onBackToHome: () => void;
  progress: UserProgress;
  settings: UserSettings;
  onAwardStars: (count: number) => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  onBackToHome,
  progress,
  settings,
  onAwardStars
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  const currentQuestion: QuizQuestion = QUIZ_QUESTIONS[questionIndex];

  // Speak question automatically when question changes (if speech enabled)
  useEffect(() => {
    if (!isQuizCompleted && currentQuestion) {
      speakText(currentQuestion.audioPrompt, settings);
    }
  }, [questionIndex, isQuizCompleted]);

  const handleSelectOption = (option: { id: string; label: string; isCorrect: boolean }) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      setIsCorrectAnswer(true);
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setFeedbackMessage(currentQuestion.explanation);
      playSound('correct', settings);
      onAwardStars(1);
      speakText(`Correct! ${currentQuestion.explanation}`, settings);
    } else {
      setIsCorrectAnswer(false);
      setStreak(0);
      setFeedbackMessage('Good try! Let us see the right answer and learn together!');
      playSound('try_again', settings);
      speakText('Good try! Let us learn together!', settings);
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 < QUIZ_QUESTIONS.length) {
      setQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setFeedbackMessage(null);
      playSound('click', settings);
    } else {
      setIsQuizCompleted(true);
      playSound('celebrate', settings);
      speakText(`Congratulations! You completed the quiz and earned ${score} stars!`, settings);
    }
  };

  const handleRestart = () => {
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsQuizCompleted(false);
    setFeedbackMessage(null);
    playSound('click', settings);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 pb-12">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-3xl border border-blue-100 shadow-xs">
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200 text-xs font-bold font-heading">
            <span>⭐</span>
            <span>{score} Points</span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-2xl border border-rose-200 text-xs font-bold font-heading">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Streak: {streak}</span>
          </div>
        </div>
      </div>

      {!isQuizCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-lg space-y-6">
          {/* Progress Tracker Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Question {questionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="text-amber-600 font-heading">Level 1: Fundamentals</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Prompt Area */}
          <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200/80 text-center space-y-3">
            {currentQuestion.visualCue && (
              <div className="text-5xl sm:text-6xl my-1 animate-pulse select-none">
                {currentQuestion.visualCue}
              </div>
            )}

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading leading-snug">
              {currentQuestion.prompt}
            </h2>

            <button
              onClick={() => speakText(currentQuestion.audioPrompt, settings)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold shadow-xs transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>Hear Question Again</span>
            </button>
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {currentQuestion.options.map(option => {
              const isSelected = selectedOptionId === option.id;
              let btnStyle = 'bg-white border-2 border-slate-200 hover:border-amber-400 text-slate-800';

              if (isAnswered) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-900 shadow-md';
                } else if (isSelected && !option.isCorrect) {
                  btnStyle = 'bg-rose-50 border-2 border-rose-300 text-rose-800 opacity-80';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl transition-all font-heading font-extrabold text-base sm:text-lg cursor-pointer ${btnStyle} ${
                    !isAnswered ? 'hover:-translate-y-1 hover:shadow-md active:scale-98' : ''
                  }`}
                >
                  {option.icon && (
                    <span className="text-4xl mb-2 select-none">{option.icon}</span>
                  )}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isCorrectAnswer
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {feedbackMessage}
                </p>
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md shadow-amber-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer shrink-0"
              >
                {questionIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question →' : 'See Results 🏆'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completion Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-amber-300 shadow-xl text-center space-y-6">
          <div className="relative inline-block mx-auto">
            <div className="w-28 h-28 rounded-3xl bg-amber-100 flex items-center justify-center text-6xl shadow-inner mx-auto">
              🏆
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-amber-950 p-2 rounded-full font-bold text-xs shadow-md">
              ★ Winner!
            </div>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Fantastic Learning!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mt-2">
              You answered with flying colors and earned {score} shining golden stars!
            </p>
          </div>

          {/* Score Box */}
          <div className="max-w-xs mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="text-xs uppercase tracking-wider font-bold text-amber-800">
              Final Quiz Score
            </div>
            <div className="text-3xl font-black text-amber-900 font-heading mt-1">
              {score} / {QUIZ_QUESTIONS.length}
            </div>
            <div className="text-xs text-amber-700 font-semibold mt-1">
              {score >= 8 ? 'Mastery Star Awarded!' : 'Great effort! Practice makes perfect!'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-102 active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Quiz Again</span>
            </button>

            <button
              onClick={() => {
                playSound('click', settings);
                onBackToHome();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Back to Home Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
