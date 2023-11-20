'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Globe, Loader2, Download } from 'lucide-react';

export default function HtmlToPdfPage() {
  const t = useTranslations('HtmlToPdf');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/HtmlToPdf?url=${encodeURIComponent(url)}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'webpage.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError('Web sayfası PDF\'e dönüştürülemedi. URL\'yi kontrol edin.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
          HTML'den PDF'e
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          Web sayfalarını PDF dosyasına dönüştürün
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-2">
              Web Sayfası URL'si
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Web sayfasının tam URL'sini girin (http:// veya https:// ile başlamalı)
            </p>
          </div>

          <button
            type="submit"
            disabled={!url || isLoading}
            className="flex w-full justify-center items-center gap-2 rounded-md bg-emerald-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Dönüştürülüyor...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
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
