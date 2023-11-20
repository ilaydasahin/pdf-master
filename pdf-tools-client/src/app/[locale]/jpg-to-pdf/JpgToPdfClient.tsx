'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { X, ArrowRight, Download, Settings2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { imagesToPDF } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';

interface ImageFile extends File {
  id: string;
  preview: string;
}

export default function JpgToPdfClient() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  // Settings
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('fit');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'big'>('none');

  const handleFilesSelected = (newFiles: File[]) => {
    const imageFiles = newFiles.map(file => Object.assign(file, {
      id: Math.random().toString(36).substring(7),
      preview: URL.createObjectURL(file)
    })) as ImageFile[];
    
    setFiles(prev => [...prev, ...imageFiles]);
    setDownloadUrl(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
    setDownloadUrl(null);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFiles(items);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const pdfBytes = await imagesToPDF(files, { pageSize, orientation, margin });
      const blob = new Blob([pdfBytes] as BlobPart[], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success('PDF başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Dönüştürme sırasında bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout 
      title="JPG'den PDF'e" 
      description="JPG ve PNG görsellerinizi saniyeler içinde PDF dosyasına dönüştürün. Sayfa boyutunu ve kenar boşluklarını ayarlayın."
    >
      {files.length === 0 ? (
        <FileUploader 
          onFilesSelected={handleFilesSelected} 
          accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
          description="JPG veya PNG dosyalarını buraya sürükleyin"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: File List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                Görseller ({files.length})
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => setFiles([])}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Tümünü Temizle
              </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="images" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-wrap gap-4 min-h-[200px]"
                  >
                    <AnimatePresence>
                      {files.map((file, index) => (
                        <Draggable key={file.id} draggableId={file.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="relative group w-32 aspect-[3/4] bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                            >
                              <img 
                                src={file.preview} 
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              
                              <button
                                onClick={() => removeFile(index)}
                                title="Görseli kaldır"
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              
                              <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {index + 1}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                    
                    {/* Add More Button */}
                    <div className="w-32 aspect-[3/4] border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer">
                      <FileUploader 
                        onFilesSelected={handleFilesSelected}
                        accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
                        description=""
                      />
                      <span className="text-xs font-medium mt-2">Ekle +</span>
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Right Side: Settings & Action */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center gap-2 text-slate-800 font-semibold border-b border-slate-100 pb-4">
                  <Settings2 className="w-5 h-5 text-indigo-600" />
                  PDF Ayarları
                </div>

                {/* Page Size */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Sayfa Boyutu</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['fit', 'a4', 'letter'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setPageSize(size)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          pageSize === size
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {size === 'fit' ? 'Otomatik' : size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orientation */}
                {pageSize !== 'fit' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Yönlendirme</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['portrait', 'landscape'] as const).map((o) => (
                        <button
                          key={o}
                          onClick={() => setOrientation(o)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                            orientation === o
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {o === 'portrait' ? 'Dikey' : 'Yatay'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Margin */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Kenar Boşluğu</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['none', 'small', 'big'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMargin(m)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          margin === m
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {m === 'none' ? 'Yok' : m === 'small' ? 'Küçük' : 'Büyük'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {downloadUrl ? (
                  <a
                    href={downloadUrl}
                    download="images.pdf"
                    className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                  >
                    <Download className="w-5 h-5" />
                    PDF İndir
                  </a>
                ) : (
                  <Button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="w-full py-6 text-lg"
                  >
                    {isProcessing ? 'Dönüştürülüyor...' : 'PDF\'e Dönüştür'}
                    {!isProcessing && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
