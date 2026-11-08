// PWA Registration and Service Worker Lifecycle Management
import { registerSW } from 'virtual:pwa-register';

export function registerPWA() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  const swUrl = `${baseUrl}sw.js`;

  try {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('[LearnSmart PWA] New version available. Refreshing cache...');
        updateSW(true);
      },
      onOfflineReady() {
        console.log('[LearnSmart PWA] Application ready for offline learning!');
      },
      onRegisteredSW(registeredUrl, registration) {
        console.log('[LearnSmart PWA] Service worker registered at:', registeredUrl, 'scope:', registration?.scope);
      },
      onRegisterError(error) {
        console.warn('[LearnSmart PWA] virtual:pwa-register notice, testing:', swUrl, error);
        navigator.serviceWorker.register(swUrl, { scope: baseUrl })
          .then((reg) => console.log('[LearnSmart PWA] Base service worker registered for scope:', reg.scope))
          .catch((e) => console.warn('[LearnSmart PWA] Registration status:', e));
      }
    });
  } catch (err) {
    navigator.serviceWorker.register(swUrl, { scope: baseUrl })
      .then((reg) => console.log('[LearnSmart PWA] Direct service worker registered for scope:', reg.scope))
      .catch((e) => console.warn('[LearnSmart PWA] Direct registration attempt:', e));
  }
}
