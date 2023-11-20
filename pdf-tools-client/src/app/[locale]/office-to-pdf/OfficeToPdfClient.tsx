'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { FileText, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function OfficeToPdfClient() {
  const t = useTranslations('OfficeToPdf');
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

    const formData = new FormData();
    formData.append('file', file);

    let endpoint = '';
    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      endpoint = 'word-to-pdf';
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      endpoint = 'excel-to-pdf';
    } else if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) {
      endpoint = 'ppt-to-pdf';
    } else {
      toast.error(t('unsupportedFile'));
      setIsProcessing(false);
      return;
    }

    try {
      // Assuming the API is running on localhost:5001 or similar. 
      // In production, this should be an environment variable.
      // For now, we'll use a relative path if proxied, or absolute if not.
      // Let's assume standard .NET API port 5001 for HTTPS.
      const apiUrl = `https://localhost:7137/api/OfficeConversion/${endpoint}`; 
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(t('success'));
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error(t('error'));
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
          accept={{ 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'application/vnd.ms-powerpoint': ['.ppt']
          }}
          maxFiles={1}
          description={t('dragDropDescription')}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">{file.name}</h3>
          <p className="text-slate-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

          {!downloadUrl ? (
            <Button 
              onClick={handleConvert} 
              disabled={isProcessing} 
              className="bg-red-600 hover:bg-red-700 text-white w-full max-w-xs"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                t('convert')
              )}
            </Button>
          ) : (
            <a
              href={downloadUrl}
              download={`converted-${file.name}.pdf`}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full max-w-xs"
            >
              <Download className="w-5 h-5" />
              {t('download')}
            </a>
          )}
          
          <button 
            onClick={() => { setFile(null); setDownloadUrl(null); }}
            className="mt-4 text-slate-500 hover:text-slate-700 text-sm underline"
          >
            {t('convertAnother')}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
