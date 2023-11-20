import React from 'react';
import { getTranslations } from 'next-intl/server';
import JpgToPdfClient from './JpgToPdfClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'JpgToPdf' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function JpgToPdfPage() {
  return <JpgToPdfClient />;
}
