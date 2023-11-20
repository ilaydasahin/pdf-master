'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { Stamp, Download, Type, Palette, RotateCw, Droplets } from 'lucide-react';
import { addWatermark, WatermarkOptions } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function WatermarkClient() {
  const t = useTranslations('Watermark');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  const [options, setOptions] = useState<WatermarkOptions>({
    text: 'CONFIDENTIAL',
    opacity: 0.5,
    rotation: 45,
    fontSize: 60,
    color: '#FF0000'
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
      const pdfBytes = await addWatermark(file, options);
      const blob = new Blob([pdfBytes] as BlobPart[], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(t('success'));
    } catch (error) {
      console.error('Watermark error:', error);
      toast.error('İşlem sırasında bir hata oluştu.');
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
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preview Area */}
          <div className="bg-slate-100 p-8 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center min-h-[400px] relative overflow-hidden">
            <div className="w-64 h-96 bg-white shadow-lg relative flex flex-col justify-between p-4 overflow-hidden">
              <div className="w-full h-4 bg-slate-100 rounded mb-2" />
              <div className="w-3/4 h-4 bg-slate-100 rounded mb-2" />
              <div className="w-full h-32 bg-slate-50 rounded mb-2" />
              <div className="w-full h-4 bg-slate-100 rounded mb-2" />
              <div className="w-full h-4 bg-slate-100 rounded mb-2" />
              
              {/* Watermark Preview */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-bold pointer-events-none select-none"
                style={{
                  transform: `translate(-50%, -50%) rotate(${options.rotation}deg)`,
                  fontSize: `${Math.min(options.fontSize / 2, 40)}px`, // Scale down for preview
                  color: options.color,
                  opacity: options.opacity
                }}
              >
                {options.text}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Stamp className="w-5 h-5" />
                {t('settings')}
              </h3>
              
              <div>
                <label htmlFor="watermark-text" className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Type className="w-4 h-4" /> {t('text')}
                </label>
                <input
                  id="watermark-text"
                  type="text"
                  value={options.text}
                  onChange={(e) => setOptions({ ...options, text: e.target.value })}
                  className="w-full rounded-lg border-slate-300 focus:ring-red-500 focus:border-red-500"
                  aria-label={t('text')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label htmlFor="rotation-input" className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <RotateCw className="w-4 h-4" /> {t('rotation')}
                  </label>
                  <input
                    id="rotation-input"
                    type="range"
                    min="0"
                    max="360"
                    value={options.rotation}
                    onChange={(e) => setOptions({ ...options, rotation: Number(e.target.value) })}
                    className="w-full"
                    aria-label={t('rotation')}
                  />
                  <div className="text-xs text-right text-slate-500">{options.rotation}°</div>
                </div>
                <div>
                   <label htmlFor="opacity-input" className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Droplets className="w-4 h-4" /> {t('opacity')}
                  </label>
                  <input
                    id="opacity-input"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={options.opacity}
                    onChange={(e) => setOptions({ ...options, opacity: Number(e.target.value) })}
                    className="w-full"
                    aria-label={t('opacity')}
                  />
                  <div className="text-xs text-right text-slate-500">{options.opacity * 100}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label htmlFor="font-size-input" className="block text-sm font-medium text-slate-700 mb-1">{t('fontSize')}</label>
                  <input
                    id="font-size-input"
                    type="number"
                    value={options.fontSize}
                    onChange={(e) => setOptions({ ...options, fontSize: Number(e.target.value) })}
                    className="w-full rounded-lg border-slate-300 focus:ring-red-500 focus:border-red-500"
                    aria-label={t('fontSize')}
                  />
                </div>
                <div>
                  <label htmlFor="color-input" className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> {t('color')}
                  </label>
                  <input
                    id="color-input"
                    type="color"
                    value={options.color}
                    onChange={(e) => setOptions({ ...options, color: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                    aria-label={t('color')}
                  />
                </div>
              </div>
            </div>

            {!downloadUrl ? (
              <Button
                onClick={handleProcess}
                disabled={isProcessing || !options.text}
                className="w-full h-12 text-lg bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? 'İşleniyor...' : (
                  <>
                    <Stamp className="w-5 h-5 mr-2" />
                    {t('addWatermark')}
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
                        download={`watermarked-${file.name}`}
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
