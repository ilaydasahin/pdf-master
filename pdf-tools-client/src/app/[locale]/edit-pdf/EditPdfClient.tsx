'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/Button';
import { Type, Image as ImageIcon, Download, Save, Trash2, Move } from 'lucide-react';
import { editPDF, EditAction } from '@/utils/pdf-processing';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface UIElement {
  id: string;
  type: 'text' | 'image';
  x: number; // relative to container (pixels)
  y: number; // relative to container (pixels)
  content: string | File; // Text string or Image File
  pageIndex: number;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
}

export default function EditPdfClient() {
  const t = useTranslations('EditPdf');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [elements, setElements] = useState<UIElement[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [pdfDimensions, setPdfDimensions] = useState<{ width: number; height: number } | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
      setElements([]);
      setCurrentPage(1);
    }
  };

  // Load PDF Page
  useEffect(() => {
    if (!file || !canvasRef.current) return;

    const loadPage = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      setTotalPages(pdf.numPages);

      const page = await pdf.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.5 }); // Render at higher quality
      
      // Update canvas dimensions
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Store PDF dimensions for coordinate conversion later
      // We use the viewport width/height as the "display" size reference
      setPdfDimensions({ width: viewport.width, height: viewport.height });
      
      // Calculate scale to fit in container if needed (simplified for now)
      // For now, we just display at 1.5 scale of original PDF point size
      
      // Cast to any to bypass strict type checking for now as pdfjs-dist types might be mismatched
      await page.render({ canvasContext: context, viewport } as any).promise;
    };

    loadPage();
  }, [file, currentPage]);

  const addText = () => {
    const newElement: UIElement = {
      id: Date.now().toString(),
      type: 'text',
      x: 50,
      y: 50,
      content: 'New Text',
      pageIndex: currentPage - 1,
      fontSize: 16,
      color: '#000000'
    };
    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imgFile = e.target.files[0];
      const newElement: UIElement = {
        id: Date.now().toString(),
        type: 'image',
        x: 50,
        y: 50,
        content: imgFile,
        pageIndex: currentPage - 1,
        width: 150,
        height: 150
      };
      setElements([...elements, newElement]);
      setSelectedElementId(newElement.id);
    }
  };

  const updateElement = (id: string, updates: Partial<UIElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElementId(id);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const element = elements.find(el => el.id === id);
    if (!element) return;
    const initialElX = element.x;
    const initialElY = element.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      updateElement(id, { x: initialElX + dx, y: initialElY + dy });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSave = async () => {
    if (!file || !pdfDimensions) return;
    setIsProcessing(true);

    try {
      const renderScale = 1.5; 

      const actions: EditAction[] = elements.map(el => {
        const x = el.x / renderScale;
        let y = 0;
        
        if (el.type === 'text') {
             y = (pdfDimensions.height - el.y) / renderScale - (el.fontSize || 12);
        } else {
             y = (pdfDimensions.height - (el.y + (el.height || 0))) / renderScale;
        }

        return {
          id: el.id,
          type: el.type,
          pageIndex: el.pageIndex,
          x: x,
          y: y,
          content: el.content,
          textOptions: el.type === 'text' ? {
            fontSize: el.fontSize || 12,
            color: el.color || '#000000'
          } : undefined,
          imageOptions: el.type === 'image' ? {
            width: (el.width || 100) / renderScale,
            height: (el.height || 100) / renderScale
          } : undefined
        };
      });

      const pdfBytes = await editPDF(file, actions);
      const blob = new Blob([pdfBytes] as BlobPart[], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(t('success'));
    } catch (error) {
      console.error('Edit PDF error:', error);
      toast.error('Kaydetme sırasında bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
    >
      {!file ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          accept={{ 'application/pdf': ['.pdf'] }}
          maxFiles={1}
          description={t('description')}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Toolbar */}
          <div className="w-full lg:w-64 flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-fit">
            <h3 className="font-semibold text-slate-800">{t('tools')}</h3>
            
            <Button onClick={addText} variant="outline" className="justify-start">
              <Type className="w-4 h-4 mr-2" /> {t('addText')}
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={addImage}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label={t('addImage')}
              />
              <Button variant="outline" className="w-full justify-start">
                <ImageIcon className="w-4 h-4 mr-2" /> {t('addImage')}
              </Button>
            </div>

            <div className="h-px bg-slate-200 my-2" />

            {selectedElementId ? (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-600">{t('properties')}</h4>
                {elements.find(el => el.id === selectedElementId)?.type === 'text' && (
                  <>
                    <div>
                      <label htmlFor="text-content" className="text-xs text-slate-500">{t('text')}</label>
                      <input
                        id="text-content"
                        type="text"
                        value={elements.find(el => el.id === selectedElementId)?.content as string}
                        onChange={(e) => updateElement(selectedElementId, { content: e.target.value })}
                        className="w-full text-sm border rounded p-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="font-size" className="text-xs text-slate-500">{t('fontSize')}</label>
                      <input
                        id="font-size"
                        type="number"
                        value={elements.find(el => el.id === selectedElementId)?.fontSize}
                        onChange={(e) => updateElement(selectedElementId, { fontSize: Number(e.target.value) })}
                        className="w-full text-sm border rounded p-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="text-color" className="text-xs text-slate-500">{t('color')}</label>
                      <input
                        id="text-color"
                        type="color"
                        value={elements.find(el => el.id === selectedElementId)?.color}
                        onChange={(e) => updateElement(selectedElementId, { color: e.target.value })}
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>
                  </>
                )}
                 {elements.find(el => el.id === selectedElementId)?.type === 'image' && (
                  <>
                    <div>
                      <label htmlFor="img-width" className="text-xs text-slate-500">{t('width')}</label>
                      <input
                        id="img-width"
                        type="number"
                        value={elements.find(el => el.id === selectedElementId)?.width}
                        onChange={(e) => updateElement(selectedElementId, { width: Number(e.target.value) })}
                        className="w-full text-sm border rounded p-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="img-height" className="text-xs text-slate-500">{t('height')}</label>
                      <input
                        id="img-height"
                        type="number"
                        value={elements.find(el => el.id === selectedElementId)?.height}
                        onChange={(e) => updateElement(selectedElementId, { height: Number(e.target.value) })}
                        className="w-full text-sm border rounded p-1"
                      />
                    </div>
                  </>
                )}
                <Button 
                  onClick={() => removeElement(selectedElementId)} 
                  variant="ghost" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> {t('delete')}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic text-center py-4">{t('selectElement')}</p>
            )}

            <div className="h-px bg-slate-200 my-2" />
            
            {!downloadUrl ? (
                <Button onClick={handleSave} disabled={isProcessing} className="bg-red-600 hover:bg-red-700 text-white">
                {isProcessing ? t('processing') : (
                    <>
                    <Save className="w-4 h-4 mr-2" /> {t('savePdf')}
                    </>
                )}
                </Button>
            ) : (
                <a
                    href={downloadUrl}
                    download={`edited-${file.name}`}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    {t('download')}
                </a>
            )}
          </div>

          {/* Editor Area */}
          <div className="flex-1 bg-slate-100 p-4 rounded-xl overflow-auto flex flex-col items-center min-h-[600px]">
            {/* Page Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center gap-4 mb-4 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                      Previous
                  </Button>
                  <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
                  <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                      Next
                  </Button>
              </div>
            )}

            <div 
              ref={containerRef}
              className="relative shadow-lg bg-white"
              style={{ width: pdfDimensions ? pdfDimensions.width : 'auto', height: pdfDimensions ? pdfDimensions.height : 'auto' }}
            >
              <canvas ref={canvasRef} className="block" />
              
              {/* Overlay Elements */}
              {elements.filter(el => el.pageIndex === currentPage - 1).map(el => (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleMouseDown(e, el.id)}
                  className={`absolute cursor-move group ${selectedElementId === el.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-blue-300'}`}
                  style={{
                    left: el.x,
                    top: el.y,
                    width: el.type === 'image' ? el.width : 'auto',
                    height: el.type === 'image' ? el.height : 'auto',
                  }}
                >
                  {el.type === 'text' ? (
                    <div 
                      style={{ 
                        fontSize: el.fontSize, 
                        color: el.color,
                        whiteSpace: 'nowrap',
                        userSelect: 'none'
                      }}
                    >
                      {el.content as string}
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={URL.createObjectURL(el.content as File)} 
                      alt="added content"
                      className="w-full h-full object-contain pointer-events-none" 
                    />
                  )}
                  
                  {/* Resize handle (visual only for now) */}
                  {selectedElementId === el.id && (
                     <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
