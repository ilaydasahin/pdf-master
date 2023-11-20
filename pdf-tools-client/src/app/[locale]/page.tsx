import { getTranslations } from 'next-intl/server';
import HeroSection from '@/components/HeroSection';
import ToolGrid from '@/components/ToolGrid';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Seo' });
 
  return {
    title: t('homeTitle'),
    description: t('homeDesc'),
  };
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <HeroSection />
      <ToolGrid />
    </main>
  );
}
