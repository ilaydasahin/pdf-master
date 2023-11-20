import { PDFDocument, PageSizes, degrees, rgb } from 'pdf-lib';
import JSZip from 'jszip';

export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const fileBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(fileBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

export async function splitPDF(
    file: File, 
    mode: 'range' | 'extract', 
    ranges: string, 
    selectedPages: number[]
): Promise<Blob> {
    const fileBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(fileBuffer);
    const totalPages = pdf.getPageCount();
    const zip = new JSZip();
    
    if (mode === 'extract') {
        // Seçili sayfaları tek tek çıkar
        for (const pageNum of selectedPages) {
            // pageNum is 1-indexed from UI
            const pageIndex = pageNum - 1;
            if (pageIndex >= 0 && pageIndex < totalPages) {
                const newPdf = await PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(pdf, [pageIndex]);
                newPdf.addPage(copiedPage);
                const pdfBytes = await newPdf.save();
                zip.file(`${file.name.replace('.pdf', '')}_page_${pageNum}.pdf`, pdfBytes);
            }
        }
    } else if (mode === 'range') {
        // Aralıkları işle (örn: "1-3, 5, 7-9")
        const rangeParts = ranges.split(',').map(r => r.trim());
        
        for (const part of rangeParts) {
            const newPdf = await PDFDocument.create();
            const pageIndices: number[] = [];
            
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n));
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= totalPages) {
                            pageIndices.push(i - 1);
                        }
                    }
                }
            } else {
                const pageNum = parseInt(part);
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                    pageIndices.push(pageNum - 1);
                }
            }
            
            if (pageIndices.length > 0) {
                const copiedPages = await newPdf.copyPages(pdf, pageIndices);
                copiedPages.forEach(page => newPdf.addPage(page));
                const pdfBytes = await newPdf.save();
                zip.file(`${file.name.replace('.pdf', '')}_range_${part}.pdf`, pdfBytes);
            }
        }
    }
    
    // Eğer sadece 1 dosya varsa direkt PDF döndür, yoksa ZIP döndür
    const files = Object.keys(zip.files);
    if (files.length === 1) {
        const content = await zip.file(files[0])?.async('uint8array');
        if (content) {
            return new Blob([content] as BlobPart[], { type: 'application/pdf' });
        }
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    return content;
}

interface PageOptions {
    pageSize: 'a4' | 'letter' | 'fit';
    orientation: 'portrait' | 'landscape';
    margin: 'none' | 'small' | 'big';
}

export async function imagesToPDF(images: File[], options: PageOptions = { pageSize: 'fit', orientation: 'portrait', margin: 'none' }): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();

    // Margin values in points (1 inch = 72 points)
    const marginMap = {
        'none': 0,
        'small': 36, // 0.5 inch
        'big': 72    // 1 inch
    };
    const margin = marginMap[options.margin];

    for (const image of images) {
        const imageBuffer = await image.arrayBuffer();
        let pdfImage;
        
        try {
            if (image.type === 'image/jpeg' || image.type === 'image/jpg') {
                pdfImage = await pdfDoc.embedJpg(imageBuffer);
            } else if (image.type === 'image/png') {
                pdfImage = await pdfDoc.embedPng(imageBuffer);
            } else {
                continue;
            }
        } catch (e) {
            console.error('Image embed error:', e);
            continue;
        }

        let pageWidth, pageHeight;

        if (options.pageSize === 'fit') {
            pageWidth = pdfImage.width;
            pageHeight = pdfImage.height;
        } else {
            const size = options.pageSize === 'a4' ? PageSizes.A4 : PageSizes.Letter;
            if (options.orientation === 'landscape') {
                pageWidth = size[1];
                pageHeight = size[0];
            } else {
                pageWidth = size[0];
                pageHeight = size[1];
            }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        
        if (options.pageSize === 'fit') {
            page.drawImage(pdfImage, {
                x: 0,
                y: 0,
                width: pdfImage.width,
                height: pdfImage.height,
            });
        } else {
            // Calculate dimensions to fit within margins while maintaining aspect ratio
            const availableWidth = pageWidth - (margin * 2);
            const availableHeight = pageHeight - (margin * 2);
            
            const scale = Math.min(
                availableWidth / pdfImage.width,
                availableHeight / pdfImage.height
            );
            
            const drawnWidth = pdfImage.width * scale;
            const drawnHeight = pdfImage.height * scale;
            
            // Center image
            const x = margin + (availableWidth - drawnWidth) / 2;
            const y = margin + (availableHeight - drawnHeight) / 2;

            page.drawImage(pdfImage, {
                x,
                y,
                width: drawnWidth,
                height: drawnHeight,
            });
        }
    }

    return await pdfDoc.save();
}

export async function rotatePDF(file: File, rotation: number, pageIndices?: number[]): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    pages.forEach((page, index) => {
        if (!pageIndices || pageIndices.includes(index)) {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + rotation));
        }
    });

    return await pdfDoc.save();
}

export async function compressPDF(file: File, quality: number = 0.7): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const totalPages = pdf.numPages;
    
    const newPdfDoc = await PDFDocument.create();

    for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: context, viewport } as any).promise;
        
        const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
        const imgBytes = await fetch(imgDataUrl).then(res => res.arrayBuffer());
        
        const embeddedImage = await newPdfDoc.embedJpg(imgBytes);
        const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
        
        newPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
        });
    }

    return await newPdfDoc.save();
}

export async function pdfToJpg(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const totalPages = pdf.numPages;
    const zip = new JSZip();

    for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: context, viewport } as any).promise;
        
        const imgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Convert Data URL to Blob
        const response = await fetch(imgDataUrl);
        const blob = await response.blob();
        
        zip.file(`${file.name.replace('.pdf', '')}_page_${i}.jpg`, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    return content;
}

export async function protectPDF(file: File, password: string): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pdfDoc as any).encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: false,
            contentAccessibility: false,
            documentAssembly: false,
        },
    });

    return await pdfDoc.save();
}

export async function unlockPDF(file: File, password: string): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    // Load with password
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfDoc = await PDFDocument.load(arrayBuffer, { password } as any);
    
    // To remove password, we need to save it without encryption.
    // However, pdf-lib might preserve encryption metadata.
    // The best way is to copy pages to a new document.
    
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach(page => newPdf.addPage(page));
    
    return await newPdf.save();
}

export async function deletePages(file: File, pagesToDelete: number[]): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();
    
    // Create a new PDF
    const newPdf = await PDFDocument.create();
    
    // Calculate pages to keep (0-indexed)
    // pagesToDelete is 1-indexed from UI
    const pagesToKeep: number[] = [];
    for (let i = 0; i < totalPages; i++) {
        if (!pagesToDelete.includes(i + 1)) {
            pagesToKeep.push(i);
        }
    }
    
    const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
    copiedPages.forEach(page => newPdf.addPage(page));
    
    return await newPdf.save();
}

export interface EditAction {
    id: string;
    type: 'text' | 'image';
    pageIndex: number;
    x: number;
    y: number;
    content: string | File;
    textOptions?: {
        fontSize: number;
        color: string;
    };
    imageOptions?: {
        width: number;
        height: number;
    };
}

export async function editPDF(file: File, actions: EditAction[]): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    for (const action of actions) {
        const page = pages[action.pageIndex];
        if (!page) continue;

        if (action.type === 'text' && typeof action.content === 'string' && action.textOptions) {
            // Convert hex color to RGB
            const hexColor = action.textOptions.color.replace('#', '');
            const r = parseInt(hexColor.substring(0, 2), 16) / 255;
            const g = parseInt(hexColor.substring(2, 4), 16) / 255;
            const b = parseInt(hexColor.substring(4, 6), 16) / 255;


            page.drawText(action.content, {
                x: action.x,
                y: action.y,
                size: action.textOptions.fontSize,
                color: rgb(r, g, b),
            });
        } else if (action.type === 'image' && action.content instanceof File && action.imageOptions) {
            const imageBuffer = await action.content.arrayBuffer();
            let pdfImage;

            try {
                if (action.content.type === 'image/jpeg' || action.content.type === 'image/jpg') {
                    pdfImage = await pdfDoc.embedJpg(imageBuffer);
                } else if (action.content.type === 'image/png') {
                    pdfImage = await pdfDoc.embedPng(imageBuffer);
                } else {
                    continue;
                }

                page.drawImage(pdfImage, {
                    x: action.x,
                    y: action.y,
                    width: action.imageOptions.width,
                    height: action.imageOptions.height,
                });
            } catch (e) {
                console.error('Failed to embed image:', e);
            }
        }
    }

    return await pdfDoc.save();
}

export interface WatermarkOptions {
    text: string;
    opacity: number; // 0-100
    position: 'center' | 'diagonal' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    fontSize: number;
}

export async function addWatermark(file: File, options: WatermarkOptions): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    // Convert opacity from 0-100 to 0-1
    const opacity = options.opacity / 100;

    for (const page of pages) {
        const { width, height } = page.getSize();

        let x, y, rotation = 0;

        // Calculate position
        if (options.position === 'center') {
            x = width / 2;
            y = height / 2;
        } else if (options.position === 'diagonal') {
            x = width / 2;
            y = height / 2;
            rotation = -45;
        } else if (options.position === 'top-right') {
            x = width - 50;
            y = height - 50;
        } else if (options.position === 'top-left') {
            x = 50;
            y = height - 50;
        } else if (options.position === 'bottom-right') {
            x = width - 50;
            y = 50;
        } else { // bottom-left
            x = 50;
            y = 50;
        }


        page.drawText(options.text, {
            x,
            y,
            size: options.fontSize,
            color: rgb(0.5, 0.5, 0.5),
            opacity,
            rotate: degrees(rotation),
        });
    }

    return await pdfDoc.save();
}

export interface PageNumberOptions {
    text: string; // e.g., "{n}", "{n}/{total}"
    position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    startFrom: number;
    fontSize: number;
}

export async function addPageNumbers(file: File, options: PageNumberOptions): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNumber = index + options.startFrom;
        
        // Format the page number text
        const text = options.text
            .replace('{n}', pageNumber.toString())
            .replace('{total}', totalPages.toString());

        let x, y;

        // Calculate position
        if (options.position === 'top-left') {
            x = 50;
            y = height - 50;
        } else if (options.position === 'top-center') {
            x = width / 2;
            y = height - 50;
        } else if (options.position === 'top-right') {
            x = width - 50;
            y = height - 50;
        } else if (options.position === 'bottom-left') {
            x = 50;
            y = 50;
        } else if (options.position === 'bottom-center') {
            x = width / 2;
            y = 50;
        } else { // bottom-right
            x = width - 50;
            y = 50;
        }


        page.drawText(text, {
            x,
            y,
            size: options.fontSize,
            color: rgb(0, 0, 0),
        });
    });

    return await pdfDoc.save();
}
