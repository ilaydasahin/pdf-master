'use client';

import { useEffect, useRef } from 'react';
import { trackAdImpression } from '@/lib/analytics';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  adClient?: string;
}

export function AdBanner({ 
  adSlot, 
  adFormat = 'auto',
  className = '',
  adClient = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXX'
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const impressionTracked = useRef(false);

  useEffect(() => {
    // Load AdSense script if not already loaded
    if (typeof window !== 'undefined' && !(window as any).adsbygoogle) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push ad to AdSense
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }

    // Track impression (once)
    if (!impressionTracked.current) {
      trackAdImpression(adSlot);
      impressionTracked.current = true;
    }
  }, [adSlot, adClient]);

  return (
    <div className={`ad-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Predefined ad placements
export function AdBannerTop() {
  return (
    <AdBanner
      adSlot="1234567890" // Replace with actual slot ID
      adFormat="horizontal"
      className="mb-8"
    />
  );
}

export function AdBannerSidebar() {
  return (
    <AdBanner
      adSlot="0987654321" // Replace with actual slot ID
      adFormat="vertical"
      className="sticky top-4"
    />
  );
}

export function AdBannerInFeed() {
  return (
    <AdBanner
      adSlot="1122334455" // Replace with actual slot ID
      adFormat="fluid"
      className="my-6"
    />
  );
}

export function AdBannerBottom() {
  return (
    <AdBanner
      adSlot="5544332211" // Replace with actual slot ID
      adFormat="horizontal"
      className="mt-8"
    />
  );
}
