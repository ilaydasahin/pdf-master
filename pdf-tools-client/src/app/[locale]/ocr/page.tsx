import React from 'react';
import { getTranslations } from 'next-intl/server';
import OcrClient from './OcrClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Ocr' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function OcrPage() {
  return <OcrClient />;
}
