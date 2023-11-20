import React from 'react';
import { getTranslations } from 'next-intl/server';
import PdfToJpgClient from './PdfToJpgClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PdfToJpg' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function PdfToJpgPage() {
  return <PdfToJpgClient />;
}
