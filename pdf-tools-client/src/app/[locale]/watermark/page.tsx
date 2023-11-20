import React from 'react';
import { getTranslations } from 'next-intl/server';
import WatermarkClient from './WatermarkClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Watermark' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function WatermarkPage() {
  return <WatermarkClient />;
}
