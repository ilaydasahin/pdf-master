'use client';

import React from 'react';
import { Button } from './ui/Button';
import { RotateCw, RotateCcw, RefreshCw } from 'lucide-react';

interface RotationControlsProps {
  onRotateAllLeft: () => void;
  onRotateAllRight: () => void;
  onReset: () => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export const RotationControls: React.FC<RotationControlsProps> = ({
  onRotateAllLeft,
  onRotateAllRight,
  onReset,
  onProcess,
  isProcessing
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={onRotateAllLeft}
          className="flex-1 sm:flex-none gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Tümünü Sola
        </Button>
        <Button
          variant="outline"
          onClick={onRotateAllRight}
          className="flex-1 sm:flex-none gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Tümünü Sağa
        </Button>
        <Button
          variant="ghost"
          onClick={onReset}
          className="text-gray-500 hover:text-red-600"
          title="Sıfırla"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <Button
        onClick={onProcess}
        disabled={isProcessing}
        size="lg"
        className="w-full sm:w-auto min-w-[200px]"
      >
        {isProcessing ? 'İşleniyor...' : 'PDF\'i Döndür'}
      </Button>
    </div>
  );
};
