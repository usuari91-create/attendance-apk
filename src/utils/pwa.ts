export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('SW registered:', reg.scope);
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateAvailable();
              }
            });
          }
        });
      }).catch(err => console.log('SW registration failed:', err));
    });
  }
}

function showUpdateAvailable() {
  const event = new CustomEvent('sw-update-available');
  window.dispatchEvent(event);
}

export function onUpdateAvailable(callback: () => void) {
  window.addEventListener('sw-update-available', callback);
  return () => window.removeEventListener('sw-update-available', callback);
}

export function applyUpdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  }
}

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

export function installPrompt(): Promise<void> {
  return new Promise((resolve, reject) => {
    let deferredPrompt: any;
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      window.removeEventListener('beforeinstallprompt', handler);
    };
    window.addEventListener('beforeinstallprompt', handler);
    setTimeout(() => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice: any) => {
          if (choice.outcome === 'accepted') resolve();
          else reject(new Error('User dismissed'));
        });
      } else {
        reject(new Error('No install prompt available'));
      }
    }, 100);
  });
}