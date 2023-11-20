'use client';

import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Image from 'next/image';
import { Trash2, CheckCircle } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface DeletePageGridProps {
  file: File;
  pagesToDelete: number[];
  onTogglePage: (pageNum: number) => void;
  onLoad?: (totalPages: number) => void;
}

export const DeletePageGrid: React.FC<DeletePageGridProps> = ({ file, pagesToDelete, onTogglePage, onLoad }) => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  useEffect(() => {
    const loadPdf = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      if (onLoad) onLoad(pdf.numPages);

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
  }, [file, onLoad]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200 max-h-[600px] overflow-y-auto">
      {thumbnails.map((thumb, index) => {
        const pageNum = index + 1;
        const isSelected = pagesToDelete.includes(pageNum);

        return (
          <div 
            key={pageNum} 
            className={`relative group flex flex-col items-center space-y-2 cursor-pointer transition-all ${isSelected ? 'opacity-50 scale-95' : 'hover:scale-105'}`}
            onClick={() => onTogglePage(pageNum)}
          >
            <div className={`relative w-full aspect-[3/4] flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-sm border-2 transition-colors ${isSelected ? 'border-red-500' : 'border-transparent group-hover:border-red-200'}`}>
              <Image
                src={thumb}
                alt={`Page ${pageNum}`}
                width={200}
                height={260}
                className="max-w-full max-h-full object-contain"
                unoptimized
              />
              
              {/* Overlay for selected state */}
              {isSelected && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-12 h-12 text-red-600" />
                </div>
              )}

              {/* Hover overlay */}
              {!isSelected && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
              )}
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${isSelected ? 'bg-red-100 text-red-700 border-red-200' : 'bg-white text-gray-500 border-gray-200'}`}>
              Sayfa {pageNum}
            </span>
          </div>
        );
      })}
    </div>
  );
};
