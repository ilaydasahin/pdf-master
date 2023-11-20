import React from 'react';
import { getTranslations } from 'next-intl/server';
import MergeClient from './MergeClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Merge' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function MergePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'PDF Tools - Merge PDF',
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'description': 'Merge multiple PDF files into one document for free. Secure, fast, and easy to use online PDF merger.'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MergeClient />
    </>
  );
}
