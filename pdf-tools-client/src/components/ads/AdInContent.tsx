'use client';

import { useEffect } from 'react';

interface AdInContentProps {
  dataAdSlot: string;
  className?: string;
}

/**
 * Google AdSense In-Content Ad Component
 * Displays ads within content areas
 */
export default function AdInContent({
  dataAdSlot,
  className = ''
}: AdInContentProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`ad-in-content my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={dataAdSlot}
      />
    </div>
  );
}
