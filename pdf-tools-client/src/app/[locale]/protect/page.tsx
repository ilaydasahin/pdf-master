import React from 'react';
import { getTranslations } from 'next-intl/server';
import ProtectClient from './ProtectClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Protect' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ProtectPage() {
  return <ProtectClient />;
}
