'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropzoneAreaProps {
    onFilesDrop: (files: File[]) => void;
    className?: string;
}

export const DropzoneArea: React.FC<DropzoneAreaProps> = ({ onFilesDrop, className }) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles?.length > 0) {
                onFilesDrop(acceptedFiles);
            }
        },
        [onFilesDrop]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden bg-white',
                isDragActive
                    ? 'border-[#E53935] bg-red-50 scale-[1.02] shadow-lg'
                    : 'border-gray-300 hover:border-[#E53935] hover:bg-gray-50',
                className
            )}
        >
            <input {...getInputProps()} />

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/50 pointer-events-none" />

            <div className="z-10 flex flex-col items-center space-y-4 text-center p-6">
                <div className={cn(
                    "p-4 rounded-full transition-colors duration-300",
                    isDragActive ? "bg-red-100 text-[#E53935]" : "bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-[#E53935]"
                )}>
                    {isDragActive ? (
                        <FilePlus className="w-10 h-10 animate-bounce" />
                    ) : (
                        <UploadCloud className="w-10 h-10" />
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-xl font-semibold text-gray-700 group-hover:text-gray-900">
                        {isDragActive ? 'Dosyaları buraya bırakın' : 'PDF dosyalarını seçin'}
                    </p>
                    <p className="text-sm text-gray-500">
                        veya buraya sürükleyip bırakın
                    </p>
                </div>
            </div>
        </div>
    );
};
