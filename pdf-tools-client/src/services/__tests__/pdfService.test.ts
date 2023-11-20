import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pdfService } from '../pdfService';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('pdfService', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
  const mockBlob = new Blob(['processed content'], { type: 'application/pdf' });

  describe('mergePdfs', () => {
    it('should send files to /merge endpoint and return a blob', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const result = await pdfService.mergePdfs([mockFile, mockFile]);

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/merge'), {
        method: 'POST',
        body: expect.any(FormData),
      });
      expect(result).toEqual(mockBlob);
    });

    it('should throw an error when API fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ Detailed: 'Merge failed' }),
      });

      await expect(pdfService.mergePdfs([mockFile])).rejects.toThrow('Merge failed');
    });
  });

  describe('splitPdf', () => {
    it('should send file and ranges to /split endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const result = await pdfService.splitPdf(mockFile, 'range', '1-5');

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/split'), {
        method: 'POST',
        body: expect.any(FormData),
      });
      expect(result).toEqual(mockBlob);
    });
  });

  describe('rotatePdf', () => {
    it('should send file and rotations to /Rotate endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const result = await pdfService.rotatePdf(mockFile, { 1: 90 });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/Rotate'), {
        method: 'POST',
        body: expect.any(FormData),
      });
      expect(result).toEqual(mockBlob);
    });
  });

  describe('deletePages', () => {
    it('should send file and pages to delete to /Delete endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const result = await pdfService.deletePages(mockFile, [1, 2]);

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/Delete'), {
        method: 'POST',
        body: expect.any(FormData),
      });
      expect(result).toEqual(mockBlob);
    });
  });

  describe('compressPdf', () => {
    it('should send file and compression level to /Compress endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const result = await pdfService.compressPdf(mockFile, 'Medium');

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/Compress'), {
        method: 'POST',
        body: expect.any(FormData),
      });
      expect(result).toEqual(mockBlob);
    });
  });
});
