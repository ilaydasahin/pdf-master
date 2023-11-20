'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { Lock, Download, Eye, EyeOff } from 'lucide-react';
import { protectPDF } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function ProtectClient() {
  const t = useTranslations('Protect');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
      setPassword('');
    }
  };

  const handleProtect = async () => {
    if (!file || !password) return;

    setIsProcessing(true);
    try {
      const pdfBytes = await protectPDF(file, password);
      const blob = new Blob([pdfBytes] as BlobPart[], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(t('success'));
    } catch (error) {
      console.error('Protection error:', error);
      toast.error('Şifreleme sırasında bir hata oluştu.');
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
        <div className="max-w-md mx-auto space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
              {t('setPassTitle')}
            </h3>
            <p className="text-slate-500 mb-6 text-center text-sm">
              {file.name}
            </p>

            {!downloadUrl ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enterPass')}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <Button
                  onClick={handleProtect}
                  disabled={isProcessing || !password}
                  className="w-full h-12 text-lg bg-red-600 hover:bg-red-700"
                >
                  {isProcessing ? 'Şifreleniyor...' : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      {t('protectBtn')}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex gap-4 w-full justify-center">
                    <Button variant="outline" onClick={() => { setFile(null); setDownloadUrl(null); }}>
                        {t('newOperation')}
                    </Button>
                    <a
                        href={downloadUrl}
                        download={`protected-${file.name}`}
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
