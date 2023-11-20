'use client';

import React, { useState, useEffect } from 'react';
import { SplitOptionsPanel } from '@/components/SplitOptionsPanel';
import { Button } from '@/components/ui/Button';
import { FileUploader } from '@/components/ui/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { Download, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { splitPDF } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import AdPlaceholder from '@/components/AdPlaceholder';

const PageGrid = dynamic(() => import('@/components/PageGrid').then(mod => mod.PageGrid), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">PDF önizlemesi yükleniyor...</div>
});

export default function SplitClient() {
  const t = useTranslations('Split');
  const tCommon = useTranslations('Common');
  
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'range' | 'extract'>('range');
  const [ranges, setRanges] = useState<string>('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Cleanup effect to revoke object URLs and prevent memory leaks
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        window.URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      
      // Validation
      if (selectedFile.type !== 'application/pdf') {
        toast.error(t('errorInvalidFileType'));
        return;
      }

      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error(t('errorFileTooLarge', { size: 100 }));
        return;
      }

      setFile(selectedFile);
      setDownloadUrl(null);
      setSelectedPages([]);
      setRanges('');
    }
  };

  const handlePageToggle = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum)
        ? prev.filter((p) => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b)
    );
  };

  const handleSplit = async () => {
    if (!file) return;

    if (mode === 'range' && !ranges) {
      toast.error(t('alertRange'));
      return;
    }

    if (mode === 'extract' && selectedPages.length === 0) {
      toast.error(t('alertSelect'));
      return;
    }

    setIsProcessing(true);
    try {
      const blob = await splitPDF(file, mode, ranges, selectedPages);
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(t('success'));
    } catch (error) {
      console.error('Split error:', error);
      toast.error(tCommon('error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setDownloadUrl(null);
    setRanges('');
    setSelectedPages([]);
  };

  if (downloadUrl) {
    return (
      <ToolLayout title={t('title')} description={t('description')}>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <AdPlaceholder slotId="split-success-top" className="mb-8" />

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('downloadReady')}</h2>
            <p className="text-slate-600 mb-8">{t('success')}</p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href={downloadUrl}
                download={file ? `split_${file.name.replace('.pdf', '')}.zip` : 'split_files.zip'}
                className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                <Download className="w-5 h-5 mr-2" />
                {t('downloadYourFile')}
              </a>

              <Button
                onClick={resetTool}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {t('splitAnother')}
              </Button>
            </div>
          </div>

          <AdPlaceholder slotId="split-success-bottom" format="rectangle" className="mx-auto" />
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout title={t('title')} description={t('description')}>
      <div className="space-y-8">
        <AdPlaceholder slotId="split-top" className="mx-auto" />

        {!file ? (
          <FileUploader onFilesSelected={handleFilesSelected} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {file.name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('delete')}
                </Button>
              </div>
              
              <PageGrid
                file={file}
                selectedPages={selectedPages}
                onPageToggle={handlePageToggle}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <SplitOptionsPanel
                  mode={mode}
                  onModeChange={setMode}
                  ranges={ranges}
                  onRangesChange={setRanges}
                  onSplit={handleSplit}
                  isProcessing={isProcessing}
                />
                <AdPlaceholder slotId="split-sidebar" format="rectangle" />
              </div>
            </div>
          </div>
        )}

        <AdPlaceholder slotId="split-bottom" className="mx-auto" />
      </div>
    </ToolLayout>
  );
}
