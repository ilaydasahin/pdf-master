'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { PenTool, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as pdfjsLib from 'pdfjs-dist';
import toast from 'react-hot-toast';

// Set worker source
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export default function SignClient() {
  const t = useTranslations('Sign');
  const [file, setFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setCurrentPage(1);
    }
  };

  // Load PDF Page
  useEffect(() => {
    if (!file || !canvasRef.current) return;

    const loadPage = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        setTotalPages(pdf.numPages);

        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: context, viewport } as any).promise;
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast.error('PDF yüklenirken bir hata oluştu.');
      }
    };

    loadPage();
  }, [file, currentPage]);

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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Toolbar */}
          <div className="w-full lg:w-64 flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-fit">
            <h3 className="font-semibold text-slate-800">{t('tools')}</h3>
            
            <Button variant="outline" className="justify-start">
              <PenTool className="w-4 h-4 mr-2" /> {t('addSignature')}
            </Button>
            
            <div className="h-px bg-slate-200 my-2" />
            
            <Button 
                onClick={() => { setFile(null); }}
                variant="ghost" 
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                <Trash2 className="w-4 h-4 mr-2" /> {t('removeFile')}
            </Button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 bg-slate-100 p-4 rounded-xl overflow-auto flex flex-col items-center min-h-[600px]">
            {/* Page Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center gap-4 mb-4 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                      Previous
                  </Button>
                  <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
                  <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                      Next
                  </Button>
              </div>
            )}

            <div className="relative shadow-lg bg-white">
              <canvas ref={canvasRef} className="block" />
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
