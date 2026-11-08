import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed and running in standalone mode, hide the install button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General or Android Chrome guide when prompt event hasn't fired yet or in preview iframe
      setShowAndroidGuide(true);
    }
  };

  const buttonStyle = variant === 'hero'
    ? 'flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-102 active:scale-98 border border-blue-200'
    : variant === 'settings'
    ? 'w-full flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 text-blue-900 transition-colors'
    : 'flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 whitespace-nowrap shrink-0';

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={buttonStyle}
        title="Install LearnSmart on Android or Desktop"
        aria-label="Install LearnSmart as app"
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span className="font-heading">
          {variant === 'settings' ? 'Install LearnSmart App' : 'Install App'}
        </span>
        {variant === 'settings' && (
          <Smartphone className="w-4 h-4 text-blue-600 ml-auto" />
        )}
      </button>

      {/* Android Chrome Installation Guide Modal */}
      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-blue-100 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-heading">
                    Install on Android
                  </h4>
                  <p className="text-[11px] text-slate-500">Google Chrome / Chromium</p>
                </div>
              </div>
              <button
                onClick={() => setShowAndroidGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm text-slate-600">
              <p className="font-semibold text-slate-800">
                Install LearnSmart on your phone or tablet home screen for 100% offline access:
              </p>
              <div className="space-y-2 bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-700">1.</span>
                  <span>Tap the three dots (<strong>⋮</strong>) menu in the top-right corner of Google Chrome.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-700">2.</span>
                  <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-700">3.</span>
                  <span>Tap <strong>Install</strong> to add LearnSmart to your device app drawer!</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Works offline once installed!</span>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidGuide(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-blue-100 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900 font-heading">
                Install on Apple iOS
              </h4>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="space-y-2 bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-700">1.</span>
                  <span>Tap the <strong>Share</strong> button in Safari toolbar.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-700">2.</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
