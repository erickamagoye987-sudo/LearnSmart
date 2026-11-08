import React from 'react';
import { X, Volume2, Gauge, Eye, Sparkles, RefreshCw, Check, Smartphone } from 'lucide-react';
import { UserSettings } from '../types';
import { playSound, speakText } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress
}) => {
  if (!isOpen) return null;

  const handleToggle = (key: keyof UserSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
    playSound('click', updated);
  };

  const handleSpeedChange = (speed: number) => {
    const updated = { ...settings, voiceSpeed: speed };
    onUpdateSettings(updated);
    speakText(`Voice speed set to ${speed}x`, updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-blue-100 flex flex-col max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 id="settings-title" className="text-xl font-bold text-slate-900 font-heading">
                Learning & Accessibility Settings
              </h3>
              <p className="text-xs text-slate-500">
                Personalize audio, pacing, and visual comfort
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click', settings);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="py-4 space-y-5">
          {/* Auditory Pacing (crucial for ASD/ADHD auditory processing) */}
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-800">Voice Speed (Speech Pacing)</h4>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Learners with ASD or processing needs benefit from slower, clearer spoken words.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Slow & Gentle (0.7x)', val: 0.7 },
                { label: 'Normal (0.85x)', val: 0.85 },
                { label: 'Quick (1.1x)', val: 1.1 }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => handleSpeedChange(opt.val)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                    settings.voiceSpeed === opt.val
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Toggles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Audio & Pronunciation
            </h4>

            {/* Speech synthesis toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors border border-slate-100">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">Voice Pronunciation</span>
                  <span className="text-xs text-slate-500">Read letters, words, and quiz questions aloud</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.speechEnabled}
                onChange={() => handleToggle('speechEnabled')}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            {/* Sound effects toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors border border-slate-100">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">Encouragement Chimes</span>
                  <span className="text-xs text-slate-500">Gentle musical chimes for stars and achievements</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEffectsEnabled}
                onChange={() => handleToggle('soundEffectsEnabled')}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Sensory & Focus Accommodations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sensory & Focus Accommodations
            </h4>

            {/* Sensory Calm Mode */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors border border-slate-100">
              <div>
                <span className="text-sm font-semibold text-slate-800 block">Sensory Calm Mode</span>
                <span className="text-xs text-slate-500">Soft pastel colors and minimal animation to prevent sensory overload</span>
              </div>
              <input
                type="checkbox"
                checked={settings.sensoryCalmMode}
                onChange={() => handleToggle('sensoryCalmMode')}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            {/* High Contrast Mode */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors border border-slate-100">
              <div>
                <span className="text-sm font-semibold text-slate-800 block">High Contrast Mode</span>
                <span className="text-xs text-slate-500">Deep borders and enhanced contrast for clearer visual boundaries</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={() => handleToggle('highContrast')}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            {/* Large Font Size */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors border border-slate-100">
              <div>
                <span className="text-sm font-semibold text-slate-800 block">Extra Large Display Font</span>
                <span className="text-xs text-slate-500">Enlarge letter cards and text size for early readers</span>
              </div>
              <input
                type="checkbox"
                checked={settings.largeFont}
                onChange={() => handleToggle('largeFont')}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Progressive Web App Install & Offline Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>App Installation & Offline Learning</span>
            </h4>
            <p className="text-xs text-slate-600">
              Install LearnSmart as a standalone application on your Android phone, tablet, or desktop to learn anywhere without internet.
            </p>
            <PWAInstallButton variant="settings" />
          </div>

          {/* Reset Progress Section */}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                if (window.confirm('Would you like to reset your stars and completed learning badges?')) {
                  onResetProgress();
                  playSound('click', settings);
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Learning Progress</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              playSound('click', settings);
              onClose();
            }}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
