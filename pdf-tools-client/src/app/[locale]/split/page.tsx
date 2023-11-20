import React from 'react';
import { getTranslations } from 'next-intl/server';
import SplitClient from './SplitClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Seo' });
 
  return {
    title: t('splitTitle'),
    description: t('splitDesc'),
  };
}

export default function SplitPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'PDF Tools - Split PDF',
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'description': 'Split PDF files online for free. Extract pages or select ranges securely and easily.'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SplitClient />
    </>
  );
}
