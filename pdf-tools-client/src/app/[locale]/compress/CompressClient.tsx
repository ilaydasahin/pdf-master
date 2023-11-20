'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { Minimize2, Download, Settings } from 'lucide-react';
import { compressPDF } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function CompressClient() {
  const t = useTranslations('Compress');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<number>(0.7); // 0.7 is "Recommended"

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const pdfBytes = await compressPDF(file, compressionLevel);
      const blob = new Blob([pdfBytes] as BlobPart[], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(t('success'));
    } catch (error) {
      console.error('Compression error:', error);
      toast.error('Sıkıştırma sırasında bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const levels = [
    { value: 0.9, label: t('lowCompression'), desc: t('lowDesc') },
    { value: 0.7, label: t('mediumCompression'), desc: t('mediumDesc') },
    { value: 0.4, label: t('highCompression'), desc: t('highDesc') },
  ];

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
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Compression Options */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {t('compressionLevel')}
            </h3>
            
            <div className="grid gap-4">
              {levels.map((level) => (
                <div
                  key={level.value}
                  onClick={() => setCompressionLevel(level.value)}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    compressionLevel === level.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-800">{level.label}</div>
                      <div className="text-sm text-slate-500">{level.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      compressionLevel === level.value ? 'border-blue-500' : 'border-slate-300'
                    }`}>
                      {compressionLevel === level.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {!downloadUrl ? (
              <Button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full md:w-auto min-w-[200px] h-12 text-lg"
              >
                {isProcessing ? 'Sıkıştırılıyor...' : (
                  <>
                    <Minimize2 className="w-5 h-5 mr-2" />
                    {t('compressBtn')}
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
                        download={`compressed-${file.name}`}
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
