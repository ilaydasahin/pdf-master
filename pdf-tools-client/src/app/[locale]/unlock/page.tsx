import React from 'react';
import { getTranslations } from 'next-intl/server';
import UnlockClient from './UnlockClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Unlock' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function UnlockPage() {
  return <UnlockClient />;
}
