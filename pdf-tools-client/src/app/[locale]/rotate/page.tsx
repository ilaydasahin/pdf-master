import React from 'react';
import { getTranslations } from 'next-intl/server';
import RotateClient from './RotateClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Rotate' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function RotatePage() {
  return <RotateClient />;
}
