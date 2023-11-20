import React from 'react';
import { getTranslations } from 'next-intl/server';
import SignClient from './SignClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Sign' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function SignPage() {
  return <SignClient />;
}
