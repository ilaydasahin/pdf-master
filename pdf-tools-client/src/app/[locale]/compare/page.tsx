'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, Loader2, GitCompare } from 'lucide-react';

export default function ComparePage() {
  const t = useTranslations('Compare');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file1 || !file2) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file1', file1);
      formData.append('file2', file2);

      const response = await fetch('http://localhost:5000/api/Compare', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Comparison failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'comparison_result.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(t('error'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
          {t('title')}
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          {t('description')}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File 1 Upload */}
            <div className="flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 hover:bg-slate-50 transition-colors">
              <div className="text-center">
                {file1 ? (
                  <div className="flex flex-col items-center">
                    <FileText className="mx-auto h-12 w-12 text-pink-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-slate-600">
                      <span className="font-semibold text-pink-600">{file1.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile1(null)}
                      className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
                    >
                      {t('removeFile')}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto h-12 w-12 text-slate-300 flex items-center justify-center border-2 border-slate-200 rounded-full">
                      <span className="text-lg font-bold text-slate-400">1</span>
                    </div>
                    <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                      <label
                        htmlFor="file1-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-pink-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-600 focus-within:ring-offset-2 hover:text-pink-500"
                      >
                        <span>{t('uploadFile')}</span>
                        <input
                          id="file1-upload"
                          name="file1-upload"
                          type="file"
                          accept=".pdf"
                          className="sr-only"
                          onChange={(e) => handleFileChange(e, setFile1)}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* File 2 Upload */}
            <div className="flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 hover:bg-slate-50 transition-colors">
              <div className="text-center">
                {file2 ? (
                  <div className="flex flex-col items-center">
                    <FileText className="mx-auto h-12 w-12 text-pink-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-slate-600">
                      <span className="font-semibold text-pink-600">{file2.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile2(null)}
                      className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
                    >
                      {t('removeFile')}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto h-12 w-12 text-slate-300 flex items-center justify-center border-2 border-slate-200 rounded-full">
                      <span className="text-lg font-bold text-slate-400">2</span>
                    </div>
                    <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                      <label
                        htmlFor="file2-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-pink-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-600 focus-within:ring-offset-2 hover:text-pink-500"
                      >
                        <span>{t('uploadFile')}</span>
                        <input
                          id="file2-upload"
                          name="file2-upload"
                          type="file"
                          accept=".pdf"
                          className="sr-only"
                          onChange={(e) => handleFileChange(e, setFile2)}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!file1 || !file2 || isLoading}
            className="flex w-full justify-center items-center gap-2 rounded-md bg-pink-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('comparing')}
              </>
            ) : (
              <>
                {t('compareButton')}
                <GitCompare className="h-5 w-5" />
              </>
            )}
          </button>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
