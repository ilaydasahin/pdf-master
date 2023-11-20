'use client';

import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import AdPlaceholder from '@/components/AdPlaceholder';
import { ArrowRight, FileText, X, GripVertical, Download, RefreshCw, CheckCircle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { mergePDFs } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function MergeClient() {
  const t = useTranslations('Merge');
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Cleanup effect to revoke object URLs and prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (downloadUrl) {
        window.URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const handleFilesSelected = (newFiles: File[]) => {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
    
    let currentTotalSize = files.reduce((acc, file) => acc + file.size, 0);
    const validFiles: File[] = [];

    for (const file of newFiles) {
      if (file.type !== 'application/pdf') {
        toast.error(t('errorInvalidFileType'));
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(t('errorFileTooLarge', { size: 50 }));
        continue;
      }

      if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
        toast.error(t('errorTotalSizeExceeded'));
        break;
      }

      currentTotalSize += file.size;
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFiles(items);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error(t('alertMinFiles'));
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdfBytes = await mergePDFs(files);
      const blob = new Blob([mergedPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      toast.success(t('successMessage'));
    } catch (error) {
      console.error('Merge error:', error);
      toast.error(t('errorMessage'));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFiles([]);
    setDownloadUrl(null);
  };

  if (downloadUrl) {
    return (
      <ToolLayout
        title={t('title')}
        description={t('description')}
      >
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <AdPlaceholder slotId="merge-success-top" className="mb-8" />
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('downloadReady')}</h2>
            <p className="text-slate-600 mb-8">{t('successMessage')}</p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a 
                href={downloadUrl} 
                download="merged-document.pdf"
                className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                <Download className="w-5 h-5 mr-2" />
                {t('downloadYourFile')}
              </a>
              
              <Button 
                onClick={resetTool}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {t('mergeAnother')}
              </Button>
            </div>
          </div>

          <AdPlaceholder slotId="merge-success-bottom" format="rectangle" className="mx-auto" />
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
    >
      <div className="space-y-8">
        <AdPlaceholder slotId="merge-top" className="mb-8" />
        
        <FileUploader
          onFilesSelected={handleFilesSelected}
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={true}
          description={t('dragDropDescription')}
        />

        {files.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">{t('selectedFiles')} ({files.length})</h3>
              <Button
                onClick={() => setFiles([])}
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                {t('clearAll')}
              </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="files">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {files.map((file, index) => (
                      <Draggable key={`${file.name}-${index}`} draggableId={`${file.name}-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 group hover:border-blue-300 transition-colors"
                          >
                            <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-red-500">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-700 truncate">{file.name}</p>
                              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5" />
                              <span className="sr-only">{t('delete')}</span>
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleMerge}
                disabled={isProcessing || files.length < 2}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {isProcessing ? t('processing') : t('mergeButton')}
                {!isProcessing && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        )}

        <AdPlaceholder slotId="merge-bottom" className="mt-8" />
      </div>
    </ToolLayout>
  );
}
