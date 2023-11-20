'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { Hash, Download, LayoutTemplate, ArrowDown, ArrowUp } from 'lucide-react';
import { addPageNumbers, PageNumberOptions } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function PageNumberClient() {
  const t = useTranslations('PageNumber');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  const [options, setOptions] = useState<PageNumberOptions>({
    position: 'bottom-center',
    startFrom: 1,
    text: '{n}',
    fontSize: 12
  });

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const pdfBytes = await addPageNumbers(file, options);
      const blob = new Blob([pdfBytes] as BlobPart[], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(t('success'));
    } catch (error) {
      console.error('Page number error:', error);
      toast.error('İşlem sırasında bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const positions = [
    { id: 'top-left', icon: <ArrowUp className="w-4 h-4 rotate-[-45deg]" /> },
    { id: 'top-center', icon: <ArrowUp className="w-4 h-4" /> },
    { id: 'top-right', icon: <ArrowUp className="w-4 h-4 rotate-[45deg]" /> },
    { id: 'bottom-left', icon: <ArrowDown className="w-4 h-4 rotate-[45deg]" /> },
    { id: 'bottom-center', icon: <ArrowDown className="w-4 h-4" /> },
    { id: 'bottom-right', icon: <ArrowDown className="w-4 h-4 rotate-[-45deg]" /> },
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
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preview Area (Simplified) */}
          <div className="bg-slate-100 p-8 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center min-h-[400px] relative">
            <div className="w-64 h-96 bg-white shadow-lg relative flex flex-col justify-between p-4">
              <div className="w-full h-4 bg-slate-100 rounded mb-2" />
              <div className="w-3/4 h-4 bg-slate-100 rounded mb-2" />
              <div className="w-full h-32 bg-slate-50 rounded mb-2" />
              <div className="w-full h-4 bg-slate-100 rounded mb-2" />
              
              {/* Page Number Preview */}
              <div className={`absolute p-2 text-red-600 font-bold text-sm
                ${options.position === 'top-left' && 'top-2 left-2'}
                ${options.position === 'top-center' && 'top-2 left-1/2 -translate-x-1/2'}
                ${options.position === 'top-right' && 'top-2 right-2'}
                ${options.position === 'bottom-left' && 'bottom-2 left-2'}
                ${options.position === 'bottom-center' && 'bottom-2 left-1/2 -translate-x-1/2'}
                ${options.position === 'bottom-right' && 'bottom-2 right-2'}
              `}>
                {options.text.replace('{n}', '1').replace('{total}', '5')}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5" />
                {t('position')}
              </h3>
              <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
                {positions.map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => setOptions({ ...options, position: pos.id as PageNumberOptions['position'] })}
                    className={`p-3 rounded-lg border-2 flex items-center justify-center transition-all ${
                      options.position === pos.id
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-slate-200 hover:border-red-200 text-slate-600'
                    }`}
                    aria-label={t('position') + ' ' + pos.id}
                  >
                    {pos.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                {t('settings')}
              </h3>
              
              <div>
                <label htmlFor="format-select" className="block text-sm font-medium text-slate-700 mb-1">{t('format')}</label>
                <select
                  id="format-select"
                  value={options.text}
                  onChange={(e) => setOptions({ ...options, text: e.target.value })}
                  className="w-full rounded-lg border-slate-300 focus:ring-red-500 focus:border-red-500"
                  aria-label={t('format')}
                >
                  <option value="{n}">1</option>
                  <option value="Page {n}">Page 1</option>
                  <option value="{n} of {total}">1 of 5</option>
                  <option value="Page {n} of {total}">Page 1 of 5</option>
                </select>
              </div>

              <div>
                <label htmlFor="font-size-input" className="block text-sm font-medium text-slate-700 mb-1">{t('fontSize')}</label>
                <input
                  id="font-size-input"
                  type="number"
                  value={options.fontSize}
                  onChange={(e) => setOptions({ ...options, fontSize: Number(e.target.value) })}
                  className="w-full rounded-lg border-slate-300 focus:ring-red-500 focus:border-red-500"
                  min="8"
                  max="72"
                  aria-label={t('fontSize')}
                />
              </div>
            </div>

            {!downloadUrl ? (
              <Button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full h-12 text-lg bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? 'İşleniyor...' : (
                  <>
                    <Hash className="w-5 h-5 mr-2" />
                    {t('addNumbers')}
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
                        download={`numbered-${file.name}`}
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
