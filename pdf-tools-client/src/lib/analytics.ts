// Google Analytics 4 configuration and tracking utilities

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// GA4 Measurement ID (replace with actual ID from Google Analytics)
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
};

// Page view tracking
export const pageview = (url: string) => {
  if (typeof window.gtag === 'undefined') return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Event tracking
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag === 'undefined') return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// PDF Tool specific events
export const trackToolUsage = (toolName: string, action: 'start' | 'complete' | 'error') => {
  event({
    action: `tool_${action}`,
    category: 'PDF Tools',
    label: toolName,
  });
};

export const trackFileUpload = (fileSize: number, fileType: string) => {
  event({
    action: 'file_upload',
    category: 'User Interaction',
    label: fileType,
    value: Math.round(fileSize / 1024), // KB
  });
};

export const trackDownload = (toolName: string, processingTime: number) => {
  event({
    action: 'file_download',
    category: 'Conversion',
    label: toolName,
    value: processingTime, // seconds
  });
};

export const trackError = (errorType: string, errorMessage: string) => {
  event({
    action: 'error',
    category: 'Error',
    label: `${errorType}: ${errorMessage}`,
  });
};

// User engagement events
export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: 'button_click',
    category: 'User Engagement',
    label: `${buttonName} - ${location}`,
  });
};

export const trackNavigation = (from: string, to: string) => {
  event({
    action: 'navigation',
    category: 'User Flow',
    label: `${from} → ${to}`,
  });
};

// Ad interaction events
export const trackAdImpression = (adUnit: string) => {
  event({
    action: 'ad_impression',
    category: 'Monetization',
    label: adUnit,
  });
};

export const trackAdClick = (adUnit: string) => {
  event({
    action: 'ad_click',
    category: 'Monetization',
    label: adUnit,
  });
};
