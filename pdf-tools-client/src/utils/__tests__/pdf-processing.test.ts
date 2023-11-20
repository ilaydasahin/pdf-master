import { describe, it, expect } from 'vitest';
import { mergePDFs } from '../pdf-processing';
import { PDFDocument } from 'pdf-lib';

describe('pdf-processing', () => {
  const createMockPdfFile = async (name: string) => {
    const doc = await PDFDocument.create();
    doc.addPage();
    const pdfBytes = await doc.save();
    const file = new File([pdfBytes], name, { type: 'application/pdf' });
    Object.defineProperty(file, 'arrayBuffer', {
      value: async () => pdfBytes.buffer
    });
    return file;
  };

  describe('mergePDFs', () => {
    it('should merge multiple PDFs into one', async () => {
      const file1 = await createMockPdfFile('file1.pdf');
      const file2 = await createMockPdfFile('file2.pdf');

      const mergedPdfBytes = await mergePDFs([file1, file2]);
      
      const mergedDoc = await PDFDocument.load(mergedPdfBytes);
      expect(mergedDoc.getPageCount()).toBe(2);
    });
  });
});
