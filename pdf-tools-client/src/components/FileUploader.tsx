'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  description?: string;
  multiple?: boolean;
}

export default function FileUploader({ 
  onFilesSelected, 
  accept = { 'application/pdf': ['.pdf'] },
  maxFiles = 0, // 0 = unlimited
  description = "PDF dosyalarını buraya sürükleyin veya seçin",
  multiple = true
}: FileUploaderProps) {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles > 0 ? maxFiles : undefined,
    multiple
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative cursor-pointer rounded-3xl border-4 border-dashed p-12 text-center transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]
          ${isDragActive 
            ? 'border-indigo-500 bg-indigo-50/50 scale-105' 
            : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={`
            p-6 rounded-full transition-colors duration-300
            ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}
          `}>
            <Upload className="h-12 w-12" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-700">
              {isDragActive ? 'Dosyaları Bırakın' : 'Dosyaları Seçin'}
            </h3>
            <p className="text-slate-500 text-lg">
              {description}
            </p>
          </div>
          
          <button className="mt-4 rounded-full bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 hover:shadow-indigo-300">
            Dosya Seç
          </button>
        </div>
      </div>
    </div>
  );
}
