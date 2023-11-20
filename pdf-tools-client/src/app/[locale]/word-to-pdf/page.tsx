'use client';

import React, { useState } from 'react';
import { FileText, Loader2, FileText as WordIcon } from 'lucide-react';

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const response = await fetch('http://localhost:5000/api/OfficeConversion/word', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = file.name.replace(/\.(docx?|doc)$/i, '.pdf');
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError('Word dosyası PDF\'e dönüştürülemedi. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
          Word'den PDF'e
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          Word belgelerinizi PDF dosyasına dönüştürün
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 hover:bg-slate-50 transition-colors">
            <div className="text-center">
              {file ? (
                <div className="flex flex-col items-center">
                  <FileText className="mx-auto h-12 w-12 text-blue-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600">
                    <span className="font-semibold text-blue-600">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
                  >
                    Kaldır
                  </button>
                </div>
              ) : (
                <>
                  <WordIcon className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Word dosyası yükle</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".docx,.doc"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">veya sürükle-bırak</p>
                  </div>
                  <p className="text-xs leading-5 text-slate-600 mt-2">.docx, .doc dosyaları</p>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!file || isLoading}
            className="flex w-full justify-center items-center gap-2 rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Dönüştürülüyor...
              </>
            ) : (
              <>
                <WordIcon className="h-5 w-5" />
                PDF'e Dönüştür
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
