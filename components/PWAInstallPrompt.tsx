import React, { useState, useEffect, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasMsStream = typeof window !== 'undefined' && 'MSStream' in window;
    // Detect iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !hasMsStream);
    // Detect if running in standalone mode (PWA installed)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandalone && !isIOS) { // Only show prompt if not installed and not iOS
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide prompt if app is installed
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isStandalone, isIOS]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        } else {
          console.log('User dismissed the PWA install prompt');
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
  };

  if (isStandalone) {
    return null; // Don't show prompt if app is already installed
  }

  if (isIOS && !isStandalone) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 text-center shadow-lg z-50">
        <p className="text-sm">
          To install this app, tap the <strong className="font-bold">Share button</strong> <span className="text-lg">↗</span> then &quot;Add to Home Screen&quot;.
        </p>
        <button
          onClick={handleClosePrompt}
          className="absolute top-1 right-2 text-white text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    );
  }

  if (showPrompt && deferredPrompt) {
    return (
      <div ref={promptRef} className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 text-center shadow-lg z-50 flex items-center justify-between">
        <p className="text-sm flex-grow">Install App for Faster Access</p>
        <div className="flex items-center">
          <button
            onClick={handleInstallClick}
            className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-semibold mr-2"
          >
            Install
          </button>
          <button
            onClick={handleClosePrompt}
            className="text-white text-xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
