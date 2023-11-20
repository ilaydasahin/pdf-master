import React from 'react';
import { getTranslations } from 'next-intl/server';
import EditPdfClient from './EditPdfClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'EditPdf' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function EditPdfPage() {
  return <EditPdfClient />;
}
