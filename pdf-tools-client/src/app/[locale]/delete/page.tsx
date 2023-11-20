import { getTranslations } from 'next-intl/server';
import DeleteClient from './DeleteClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Delete' });
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function DeletePage() {
  return <DeleteClient />;
}
