'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { Image as ImageIcon, Download } from 'lucide-react';
import { pdfToJpg } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function PdfToJpgClient() {
  const t = useTranslations('PdfToJpg');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const zipBlob = await pdfToJpg(file);
      const url = URL.createObjectURL(zipBlob);
      setDownloadUrl(url);
      toast.success(t('success'));
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Dönüştürme sırasında bir hata oluştu.');
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
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {file.name}
            </h3>
            <p className="text-slate-500 mb-6">
              {t('readyToConvert')}
            </p>

            {!downloadUrl ? (
              <Button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full md:w-auto min-w-[200px] h-12 text-lg"
              >
                {isProcessing ? 'Dönüştürülüyor...' : (
                  <>
                    <ImageIcon className="w-5 h-5 mr-2" />
                    {t('convertBtn')}
                  </>
                )}
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex gap-4 w-full justify-center">
                    <Button variant="outline" onClick={() => { setFile(null); setDownloadUrl(null); }}>
                        {t('newOperation')}
                    </Button>
                    <a
                        href={downloadUrl}
                        download={`${file.name.replace('.pdf', '')}-images.zip`}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                    >
                        <Download className="w-5 h-5" />
                        {t('download')}
                    </a>
                </div>
                <p className="text-sm text-green-600 font-medium">
                    {t('successMsg')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
