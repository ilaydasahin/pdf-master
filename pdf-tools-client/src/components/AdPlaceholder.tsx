import React from 'react';

interface AdPlaceholderProps {
  slotId?: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

export default function AdPlaceholder({ slotId, format = 'horizontal', className = '' }: AdPlaceholderProps) {
  const getDimensions = () => {
    switch (format) {
      case 'horizontal':
        return 'w-full h-[90px]';
      case 'vertical':
        return 'w-[160px] h-[600px]';
      case 'rectangle':
        return 'w-[300px] h-[250px]';
      default:
        return 'w-full h-[90px]';
    }
  };

  return (
    <div 
      className={`bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-sm font-medium ${getDimensions()} ${className}`}
    >
      <div className="text-center">
        <p>Reklam Alanı</p>
        <p className="text-xs opacity-75">{format} - {slotId || 'Auto'}</p>
      </div>
    </div>
  );
}
