'use client';

import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PageGridProps {
  file: File;
  selectedPages: number[];
  onPageToggle: (pageNum: number) => void;
}

export const PageGrid: React.FC<PageGridProps> = ({ file, selectedPages, onPageToggle }) => {
  // const [numPages, setNumPages] = useState<number>(0); // Removed unused state
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  useEffect(() => {
    const loadPdf = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      // setNumPages(pdf.numPages); // Removed unused state

      // Generate thumbnails (simplified for demo, ideally should be lazy loaded)
      const thumbs: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport } as any).promise;
          thumbs.push(canvas.toDataURL());
        }
      }
      setThumbnails(thumbs);
    };

    loadPdf();
  }, [file]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 max-h-[600px] overflow-y-auto">
      {thumbnails.map((thumb, index) => {
        const pageNum = index + 1;
        const isSelected = selectedPages.includes(pageNum);

        return (
          <div
            key={pageNum}
            onClick={() => onPageToggle(pageNum)}
            className={cn(
              "relative group cursor-pointer transition-all duration-200",
              isSelected ? "ring-2 ring-[#E53935] scale-95" : "hover:scale-105"
            )}
          >
            <img
              src={thumb}
              alt={`Page ${pageNum}`}
              className="w-full h-auto rounded-lg shadow-sm bg-white"
            />
            
            <div className={cn(
              "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors",
              isSelected ? "bg-[#E53935] text-white" : "bg-gray-200/80 text-transparent group-hover:text-gray-400"
            )}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {pageNum}
            </div>
          </div>
        );
      })}
    </div>
  );
};
