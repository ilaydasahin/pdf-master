'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { RotateCw, Download } from 'lucide-react';
import { rotatePDF } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const PageGrid = dynamic(() => import('@/components/PageGrid').then(mod => mod.PageGrid), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">PDF önizlemesi yükleniyor...</div>
});

export default function RotateClient() {
  const t = useTranslations('Rotate');
  const [file, setFile] = useState<File | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
      setSelectedPages([]);
    }
  };

  const handleRotate = async (rotation: number) => {
    if (!file) return;

    setIsProcessing(true);
    try {
      // If no pages selected, rotate all
      const pagesToRotate = selectedPages.length > 0 ? selectedPages : undefined;
      const pdfBytes = await rotatePDF(file, rotation, pagesToRotate);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(t('success'));
    } catch (error) {
      console.error('Rotation error:', error);
      toast.error('Döndürme sırasında bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
    >
      {!file ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          accept={{ 'application/pdf': ['.pdf'] }}
          maxFiles={1}
          description={t('description')}
        />
      ) : (
        <div className="space-y-8">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 sticky top-4 z-10">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600">
                {selectedPages.length === 0 
                  ? t('selectAll') 
                  : t('selectedCount', { count: selectedPages.length })}
              </span>
              {selectedPages.length > 0 && (
                <Button variant="ghost" onClick={() => setSelectedPages([])} className="text-xs h-8">
                  {t('deselect')}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!downloadUrl ? (
                <>
                  <Button
                    onClick={() => handleRotate(90)}
                    disabled={isProcessing}
                    className="gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    {t('rotateRight')}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => { setFile(null); setDownloadUrl(null); }}>
                    {t('newOperation')}
                  </Button>
                  <a
                    href={downloadUrl}
                    download={`rotated-${file.name}`}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                  >
                    <Download className="w-4 h-4" />
                    {t('download')}
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Preview Grid */}
          <div className="bg-slate-100 p-8 rounded-2xl border-2 border-dashed border-slate-300 min-h-[400px]">
             <PageGrid
                file={file}
                selectedPages={selectedPages}
                onPageToggle={(pageIndex) => {
                  setSelectedPages(prev => 
                    prev.includes(pageIndex) 
                      ? prev.filter(p => p !== pageIndex)
                      : [...prev, pageIndex]
                  );
                }}
              />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
