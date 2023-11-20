import React from 'react';
import { Button } from './ui/Button';
import { RotateCw, RotateCcw } from 'lucide-react';

interface RotateControlsProps {
  pageNum: number;
  onRotate: (pageNum: number, direction: 'left' | 'right') => void;
}

export const RotateControls: React.FC<RotateControlsProps> = ({ pageNum, onRotate }) => {
  return (
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onRotate(pageNum, 'left')}
        className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white text-gray-800"
        title="Sola Döndür"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onRotate(pageNum, 'right')}
        className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white text-gray-800"
        title="Sağa Döndür"
      >
        <RotateCw className="w-5 h-5" />
      </Button>
    </div>
  );
};
