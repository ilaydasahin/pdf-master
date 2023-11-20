'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * GDPR-compliant Cookie Consent Banner
 * Shows cookie consent for analytics and advertising
 */
export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    
    // Enable analytics/ads scripts here if needed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
    
    // Keep analytics/ads disabled
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We use cookies to improve your experience, analyze site traffic, and serve personalized ads. 
              By clicking &quot;Accept&quot;, you consent to our use of cookies.{' '}
              <a 
                href="/privacy-policy" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Learn more
              </a>
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
