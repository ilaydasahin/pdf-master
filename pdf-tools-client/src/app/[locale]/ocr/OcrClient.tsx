'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { ScanText, Copy, Download, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdf.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export default function OcrClient() {
  const t = useTranslations('Ocr');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setExtractedText('');
      setProgress(0);
      setStatus('');
    }
  };

  const handleOcr = async () => {
    if (!file) return;
    setIsProcessing(true);
    setExtractedText('');
    setStatus(t('initializing'));

    try {
      let text = '';

      if (file.type === 'application/pdf') {
        setStatus(t('convertingPdf'));
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
          setStatus(`${t('processingPage')} ${i}/${totalPages}`);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // High scale for better OCR
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (context) {
            // Cast to any to bypass strict type checking for now as pdfjs-dist types might be mismatched
            await page.render({ canvasContext: context, viewport } as any).promise;
            const imageUrl = canvas.toDataURL('image/png');
            
            setStatus(`${t('recognizingText')} ${i}/${totalPages}`);
            const worker = await createWorker('eng+tur', 1, {
              logger: m => {
                if (m.status === 'recognizing text') {
                  setProgress(Math.round(m.progress * 100));
                }
              }
            });
            
            const { data: { text: pageText } } = await worker.recognize(imageUrl);
            await worker.terminate();
            
            text += `--- Page ${i} ---\n\n${pageText}\n\n`;
          }
        }
      } else {
        // Image file
        setStatus(t('recognizingText'));
        const imageUrl = URL.createObjectURL(file);
        const worker = await createWorker('eng+tur', 1, {
            logger: m => {
              if (m.status === 'recognizing text') {
                setProgress(Math.round(m.progress * 100));
              }
            }
          });
        const { data: { text: imageText } } = await worker.recognize(imageUrl);
        await worker.terminate();
        text = imageText;
      }

      setExtractedText(text);
      setStatus(t('completed'));
      toast.success(t('success'));
    } catch (error) {
      console.error('OCR error:', error);
      toast.error(t('error'));
      setStatus(t('failed'));
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success(t('copied'));
  };

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr-result-${file?.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
    >
      {!file ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          accept={{ 
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/bmp': ['.bmp'],
            'image/webp': ['.webp']
          }}
          maxFiles={1}
          description={t('dragDropDescription')}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
          {/* Left Side: File Info & Controls */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <ScanText className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-slate-800 truncate" title={file.name}>{file.name}</h3>
                  <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              {!extractedText && (
                <Button 
                  onClick={handleOcr} 
                  disabled={isProcessing} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white mb-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('processing')} {progress > 0 && `(${progress}%)`}
                    </>
                  ) : (
                    t('startOcr')
                  )}
                </Button>
              )}

              {isProcessing && (
                <div className="mb-4">
                  <div className="text-xs text-slate-500 mb-1 flex justify-between">
                    <span>{status}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button 
                variant="outline" 
                onClick={() => { setFile(null); setExtractedText(''); }}
                className="w-full"
                disabled={isProcessing}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('newFile')}
              </Button>
            </div>

            {extractedText && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
                <h3 className="font-semibold text-slate-800">{t('actions')}</h3>
                <Button onClick={handleCopy} variant="outline" className="justify-start">
                  <Copy className="w-4 h-4 mr-2" /> {t('copyText')}
                </Button>
                <Button onClick={handleDownload} variant="outline" className="justify-start">
                  <Download className="w-4 h-4 mr-2" /> {t('downloadText')}
                </Button>
              </div>
            )}
          </div>

          {/* Right Side: Extracted Text */}
          <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">{t('extractedText')}</h3>
              {extractedText && (
                <span className="text-xs text-slate-500">{extractedText.length} {t('chars')}</span>
              )}
            </div>
            <div className="flex-1 p-4 min-h-[500px]">
              {extractedText ? (
                <textarea 
                  className="w-full h-full min-h-[500px] p-4 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none font-mono text-sm"
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  aria-label={t('extractedText')}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <ScanText className="w-12 h-12 mb-4 opacity-20" />
                  <p>{t('waitingForOcr')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
