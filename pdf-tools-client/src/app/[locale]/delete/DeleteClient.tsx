'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FileUploader } from '@/components/ui/FileUploader';
import { ToolLayout } from '@/components/ToolLayout';
import { Download, ArrowLeft, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { deletePages } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';

const DeletePageGrid = dynamic(() => import('@/components/DeletePageGrid').then(mod => mod.DeletePageGrid), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400">PDF önizlemesi yükleniyor...</div>
});

export default function DeleteClient() {
  const t = useTranslations('Delete');
  const tCommon = useTranslations('Common');
  const [file, setFile] = useState<File | null>(null);
  const [pagesToDelete, setPagesToDelete] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
      setPagesToDelete([]);
    }
  };

  const togglePage = (pageNum: number) => {
    setPagesToDelete(prev => 
      prev.includes(pageNum) 
        ? prev.filter(p => p !== pageNum)
        : [...prev, pageNum]
    );
  };

  const handleProcess = async () => {
    if (!file) return;

    if (pagesToDelete.length === 0) {
      toast.error(t('alertSelect'));
      return;
    }

    if (pagesToDelete.length === totalPages) {
      toast.error(t('alertAll'));
      return;
    }

    setIsProcessing(true);
    try {
      const pdfBytes = await deletePages(file, pagesToDelete);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(t('success'));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(tCommon('error'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout title={t('title')} description={t('description')}>
      {!file ? (
        <FileUploader onFilesSelected={handleFilesSelected} />
      ) : !downloadUrl ? (
        <div className="space-y-6">
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
              {tCommon('changeFile')}
            </Button>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-red-600">{pagesToDelete.length}</span> {t('selectedCount', {count: pagesToDelete.length}).replace('{count}', '')}
            </div>
            <Button
              onClick={handleProcess}
              disabled={isProcessing || pagesToDelete.length === 0}
              size="lg"
              className="w-full sm:w-auto min-w-[200px] bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? tCommon('processing') : t('button')}
            </Button>
          </div>
          
          <DeletePageGrid
            file={file}
            pagesToDelete={pagesToDelete}
            onTogglePage={togglePage}
            onLoad={(pages) => setTotalPages(pages)}
          />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center space-y-6 py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900">
            {t('success')}
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={downloadUrl}
              download="modified.pdf"
              className="inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium text-white bg-[#E53935] rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              {tCommon('download')}
            </a>
            
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setDownloadUrl(null);
                setPagesToDelete([]);
              }}
            >
              {tCommon('newOperation')}
            </Button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
