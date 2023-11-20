'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, File as FileIcon, Loader2, Eraser } from 'lucide-react';

export default function RedactPage() {
  const t = useTranslations('Redact');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Simple coordinate inputs for MVP
  const [page, setPage] = useState(1);
  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(50);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const redactions = [
        {
          PageNumber: page,
          X: x,
          Y: y,
          Width: width,
          Height: height
        }
      ];
      
      formData.append('redactionsJson', JSON.stringify(redactions));

      const response = await fetch('http://localhost:5000/api/Redact', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Redaction failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'redacted.pdf';
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
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
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
          <div className="flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 hover:bg-slate-50 transition-colors">
            <div className="text-center">
              {file ? (
                <div className="flex flex-col items-center">
                  <FileIcon className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600">
                    <span className="font-semibold text-slate-600">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
                  >
                    {t('removeFile')}
                  </button>
                </div>
              ) : (
                <>
                  <Eraser className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>{t('uploadFile')}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".pdf"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          {file && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Page Number</label>
                <input type="number" value={page} onChange={e => setPage(Number(e.target.value))} aria-label="Page Number" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">X Coordinate</label>
                <input type="number" value={x} onChange={e => setX(Number(e.target.value))} aria-label="X Coordinate" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Y Coordinate</label>
                <input type="number" value={y} onChange={e => setY(Number(e.target.value))} aria-label="Y Coordinate" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Width</label>
                <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} aria-label="Width" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Height</label>
                <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} aria-label="Height" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || isLoading}
            className="flex w-full justify-center items-center gap-2 rounded-md bg-slate-900 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('redacting')}
              </>
            ) : (
              <>
                {t('redactButton')}
                <ArrowRight className="h-5 w-5" />
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

