'use client';

import { ToolLayout } from '@/components/ToolLayout';
import { Wrench } from 'lucide-react';
import { Link } from '@/navigation';

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <ToolLayout title={title} description={description}>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Wrench className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Bu özellik yapım aşamasında</h2>
        <p className="text-slate-600 max-w-md mb-8">
          {title} özelliği çok yakında hizmetinizde olacak. Şu anda üzerinde çalışıyoruz.
        </p>
        <Link 
          href="/"
          className="text-indigo-600 font-semibold hover:text-indigo-500"
        >
          Anasayfaya Dön
        </Link>
      </div>
    </ToolLayout>
  );
}
