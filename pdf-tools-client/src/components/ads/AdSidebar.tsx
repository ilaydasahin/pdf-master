'use client';

import { useEffect } from 'react';

interface AdSidebarProps {
  dataAdSlot: string;
  className?: string;
}

/**
 * Google AdSense Sidebar Component
 * 300x600 sidebar ad unit
 */
export default function AdSidebar({
  dataAdSlot,
  className = ''
}: AdSidebarProps) {
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
    <div className={`ad-sidebar ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '300px', height: '600px' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={dataAdSlot}
      />
    </div>
  );
}
