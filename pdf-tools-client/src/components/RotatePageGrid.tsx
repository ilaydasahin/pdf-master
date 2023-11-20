'use client';

import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Image from 'next/image';
import { RotateControls } from './RotateControls';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface RotatePageGridProps {
  file: File;
  rotations: { [pageNum: number]: number };
  onRotate: (pageNum: number, direction: 'left' | 'right') => void;
  onLoad?: (totalPages: number) => void;
}

export const RotatePageGrid: React.FC<RotatePageGridProps> = ({ file, rotations, onRotate, onLoad }) => {
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
        const rotation = rotations[pageNum] || 0;

        return (
          <div key={pageNum} className="relative group flex flex-col items-center space-y-2">
            <div className="relative w-full aspect-[3/4] flex items-center justify-center bg-gray-200 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all">
              <Image
                src={thumb}
                alt={`Page ${pageNum}`}
                width={200}
                height={260}
                style={{ transform: `rotate(${rotation}deg)` }}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                unoptimized
              />
              {/* Overlay Controls */}
              <RotateControls pageNum={pageNum} onRotate={onRotate} />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
              Sayfa {pageNum}
            </span>
          </div>
        );
      })}
    </div>
  );
};
