import React from 'react';
import { getTranslations } from 'next-intl/server';
import PageNumberClient from './PageNumberClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PageNumber' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function PageNumberPage() {
  return <PageNumberClient />;
}
