'use client';

import { motion } from 'framer-motion';
import { 
  Files, 
  Scissors, 
  Minimize2, 
  FileImage, 
  FileText, 
  Lock,
  Unlock,
  RotateCw,
  Trash2,
  Type,
  Image,
  Stamp,
  ScanLine,
  FileOutput,
  Globe,
  Archive,
  Wrench,
  GitCompare,
  Eraser,
  Crop,
  Workflow,
  ArrowRight
} from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

const tools = [
  {
    id: 'merge-pdf',
    title: 'PDF Birleştir',
    description: 'PDF\'leri istediğiniz sırada birleştirin.',
    icon: Files,
    color: 'from-red-500 to-pink-500',
    iconColor: 'text-red-500',
    href: '/merge',
    popular: true
  },
  {
    id: 'split-pdf',
    title: 'PDF Ayır',
    description: 'PDF\'ten sayfaları ayırın veya çıkarın.',
    icon: Scissors,
    color: 'from-pink-500 to-rose-500',
    iconColor: 'text-pink-500',
    href: '/split',
    popular: true
  },
  {
    id: 'compress-pdf',
    title: 'PDF Küçült',
    description: 'PDF dosya boyutunu küçültün.',
    icon: Minimize2,
    color: 'from-green-500 to-emerald-500',
    iconColor: 'text-green-500',
    href: '/compress',
    popular: true
  },
  {
    id: 'word-to-pdf',
    title: 'Word\'den PDF\'e',
    description: 'Word belgelerinizi PDF\'e dönüştürün.',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    iconColor: 'text-blue-500',
    href: '/word-to-pdf'
  },
  {
    id: 'powerpoint-to-pdf',
    title: 'PowerPoint\'ten PDF\'e',
    description: 'PowerPoint sunumlarınızı PDF\'e dönüştürün.',
    icon: FileText,
    color: 'from-orange-500 to-amber-500',
    iconColor: 'text-orange-500',
    href: '/powerpoint-to-pdf'
  },
  {
    id: 'excel-to-pdf',
    title: 'Excel\'den PDF\'e',
    description: 'Excel tablolarınızı PDF\'e dönüştürün.',
    icon: FileText,
    color: 'from-green-600 to-teal-600',
    iconColor: 'text-green-600',
    href: '/excel-to-pdf'
  },
  {
    id: 'edit-pdf',
    title: 'PDF Düzenle',
    description: 'PDF\'inize metin, şekil, resim ve açıklama ekleyin.',
    icon: Type,
    color: 'from-indigo-500 to-purple-500',
    iconColor: 'text-indigo-500',
    href: '/edit-pdf'
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF\'ten JPG\'e',
    description: 'PDF sayfalarını JPG resimlerine dönüştürün.',
    icon: Image,
    color: 'from-yellow-500 to-orange-400',
    iconColor: 'text-yellow-500',
    href: '/pdf-to-jpg'
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG\'den PDF\'e',
    description: 'JPG resimlerinizi PDF\'e dönüştürün.',
    icon: FileImage,
    color: 'from-yellow-400 to-yellow-600',
    iconColor: 'text-yellow-500',
    href: '/jpg-to-pdf'
  },
  {
    id: 'watermark',
    title: 'Filigran Ekle',
    description: 'PDF\'inize resim veya metin filigranı ekleyin.',
    icon: Stamp,
    color: 'from-red-400 to-pink-400',
    iconColor: 'text-red-400',
    href: '/watermark'
  },
  {
    id: 'rotate-pdf',
    title: 'PDF Döndür',
    description: 'PDF sayfalarınızı döndürün.',
    icon: RotateCw,
    color: 'from-purple-500 to-pink-500',
    iconColor: 'text-purple-500',
    href: '/rotate'
  },
  {
    id: 'unlock-pdf',
    title: 'PDF Kilidini Aç',
    description: 'PDF şifre korumasını kaldırın.',
    icon: Unlock,
    color: 'from-pink-400 to-rose-400',
    iconColor: 'text-pink-400',
    href: '/unlock'
  },
  {
    id: 'protect-pdf',
    title: 'PDF Kilitle',
    description: 'PDF dosyanızı şifre ile koruyun.',
    icon: Lock,
    color: 'from-slate-500 to-gray-600',
    iconColor: 'text-slate-500',
    href: '/protect'
  },
  {
    id: 'organize-pdf',
    title: 'Sayfaları Sil',
    description: 'PDF dosyanızdan istemediğiniz sayfaları silin.',
    icon: Trash2,
    color: 'from-red-600 to-red-700',
    iconColor: 'text-red-600',
    href: '/delete'
  },
  {
    id: 'page-number',
    title: 'Sayfa Numarası',
    description: 'PDF sayfalarına numara ekleyin.',
    icon: FileOutput,
    color: 'from-blue-400 to-indigo-500',
    iconColor: 'text-blue-400',
    href: '/page-number'
  },
  {
    id: 'ocr-pdf',
    title: 'PDF Tarama (OCR)',
    description: 'Taranmış PDF\'leri aranabilir metne dönüştürün.',
    icon: ScanLine,
    color: 'from-indigo-600 to-blue-600',
    iconColor: 'text-indigo-600',
    href: '/ocr'
  },
  {
    id: 'html-to-pdf',
    title: 'HTML\'den PDF\'e',
    description: 'Web sayfalarını PDF\'e dönüştürün.',
    icon: Globe,
    color: 'from-blue-600 to-cyan-600',
    iconColor: 'text-blue-600',
    href: '/html-to-pdf'
  },
  {
    id: 'pdf-to-pdfa',
    title: 'PDF\'ten PDF/A\'ya',
    description: 'Arşivleme için PDF\'inizi PDF/A formatına dönüştürün.',
    icon: Archive,
    color: 'from-red-700 to-orange-700',
    iconColor: 'text-red-700',
    href: '/pdf-to-pdfa'
  },
  {
    id: 'repair-pdf',
    title: 'PDF Onar',
    description: 'Hasarlı PDF dosyalarını onarın.',
    icon: Wrench,
    color: 'from-gray-500 to-slate-600',
    iconColor: 'text-gray-500',
    href: '/repair'
  },
  {
    id: 'compare-pdf',
    title: 'PDF Karşılaştır',
    description: 'İki PDF dosyasını yan yana karşılaştırın.',
    icon: GitCompare,
    color: 'from-pink-600 to-rose-600',
    iconColor: 'text-pink-600',
    href: '/compare'
  },
  {
    id: 'redact-pdf',
    title: 'PDF Sansürle',
    description: 'Hassas bilgileri kalıcı olarak gizleyin.',
    icon: Eraser,
    color: 'from-gray-700 to-slate-800',
    iconColor: 'text-gray-700',
    href: '/redact'
  },
  {
    id: 'crop-pdf',
    title: 'PDF Kırp',
    description: 'PDF sayfalarının kenar boşluklarını kırpın.',
    icon: Crop,
    color: 'from-orange-600 to-red-600',
    iconColor: 'text-orange-600',
    href: '/crop'
  },
  {
    id: 'workflows',
    title: 'İş Akışı Oluştur',
    description: 'Favori araçlarınızla özel iş akışları oluşturun.',
    icon: Workflow,
    color: 'from-indigo-500 to-purple-600',
    iconColor: 'text-indigo-500',
    href: '/workflows',
    featured: true
  }
];

export default function ToolGrid() {
  const t = useTranslations('Tools');

  return (
    <section id="tools" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            All PDF Tools You Need
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Choose from 20+ professional PDF tools, all free to use
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.03, duration: 0.4 }}
              className="group h-full"
            >
              <Link href={tool.href} className="block h-full">
                <div className="relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:ring-indigo-500/30 hover:-translate-y-1">
                  {/* Popular/Featured Badge */}
                  {(tool.popular || tool.featured) && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-0.5 text-xs font-medium text-white shadow-lg">
                        {tool.popular ? '★ Popular' : '✦ New'}
                      </span>
                    </div>
                  )}

                  {/* Icon with gradient background */}
                  <div className="mb-4">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} p-0.5 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-white">
                        <tool.icon className={`h-7 w-7 ${tool.iconColor}`} aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 flex items-center gap-2">
                    {t(`${tool.id}.title`) || tool.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </h3>
                  
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t(`${tool.id}.desc`) || tool.description}
                  </p>

                  {/* Hover gradient effect */}
                  <div className={`absolute inset-x-0 -bottom-full h-1 bg-gradient-to-r ${tool.color} opacity-0 transition-all duration-300 group-hover:bottom-0 group-hover:opacity-100`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-slate-600 mb-4">
            Can't find what you're looking for?
          </p>
          <Link
            href="/workflows"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Create Custom Workflow
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
