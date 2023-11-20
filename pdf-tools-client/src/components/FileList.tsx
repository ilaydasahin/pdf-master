'use client';

import React from 'react';
import { FileText, X, GripVertical } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import { Button } from './ui/Button';

interface FileListProps {
    files: File[];
    onRemove: (index: number) => void;
    onReorder: (newOrder: File[]) => void;
}

interface FileItemProps {
    file: File;
    onRemove: () => void;
}

const FileItem = ({ file, onRemove }: FileItemProps) => {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={file}
            dragListener={false}
            dragControls={controls}
            className="relative flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm group hover:shadow-md transition-all select-none"
        >
            <div
                onPointerDown={(e) => controls.start(e)}
                className="p-2 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gray-600 touch-none"
            >
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg text-[#E53935]">
                <FileText className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                </p>
                <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            >
                <X className="w-5 h-5" />
            </Button>
        </Reorder.Item>
    );
};

export const FileList: React.FC<FileListProps> = ({ files, onRemove, onReorder }) => {
    if (files.length === 0) return null;

    return (
        <Reorder.Group
            axis="y"
            values={files}
            onReorder={onReorder}
            className="space-y-3 w-full max-w-2xl mx-auto mt-8"
        >
            {files.map((file, index) => (
                // Using file.name + size + lastModified as a key since File objects don't have unique IDs
                <FileItem
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    file={file}
                    onRemove={() => onRemove(index)}
                />
            ))}
        </Reorder.Group>
    );
};
