import React from 'react';
import { getTranslations } from 'next-intl/server';
import CompressClient from './CompressClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Compress' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function CompressPage() {
  return <CompressClient />;
}
