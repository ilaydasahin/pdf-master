import React from 'react';
import { getTranslations } from 'next-intl/server';
import OfficeToPdfClient from './OfficeToPdfClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'OfficeToPdf' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function OfficeToPdfPage() {
  return <OfficeToPdfClient />;
}
