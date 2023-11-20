'use client';

import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input'; // Assuming we'll create this or use standard input
import { Label } from './ui/Label'; // Assuming we'll create this
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs'; // Assuming we'll create these

interface SplitOptionsPanelProps {
  mode: 'range' | 'extract';
  onModeChange: (mode: 'range' | 'extract') => void;
  ranges: string;
  onRangesChange: (ranges: string) => void;
  onSplit: () => void;
  isProcessing: boolean;
}

export const SplitOptionsPanel: React.FC<SplitOptionsPanelProps> = ({
  mode,
  onModeChange,
  ranges,
  onRangesChange,
  onSplit,
  isProcessing
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex space-x-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => onModeChange('range')}
          className={`pb-2 px-4 text-sm font-medium transition-colors relative ${
            mode === 'range' 
              ? 'text-[#E53935] border-b-2 border-[#E53935]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Aralıklara Göre Böl
        </button>
        <button
          onClick={() => onModeChange('extract')}
          className={`pb-2 px-4 text-sm font-medium transition-colors relative ${
            mode === 'extract' 
              ? 'text-[#E53935] border-b-2 border-[#E53935]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sayfaları Çıkar
        </button>
      </div>

      {mode === 'range' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sayfa Aralıkları
            </label>
            <input
              type="text"
              value={ranges}
              onChange={(e) => onRangesChange(e.target.value)}
              placeholder="Örn: 1-5, 8-10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            />
            <p className="mt-1 text-xs text-gray-500">
              Virgülle ayırarak birden fazla aralık girebilirsiniz.
            </p>
          </div>
        </div>
      )}

      {mode === 'extract' && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Soldaki önizleme panelinden çıkarmak istediğiniz sayfaları seçin.
        </div>
      )}

      <Button
        onClick={onSplit}
        disabled={isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? 'İşleniyor...' : 'PDF\'i Böl'}
      </Button>
    </div>
  );
};
