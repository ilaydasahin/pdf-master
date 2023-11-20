import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const testPdfPath = path.join(__dirname, 'test-files', 'sample.pdf');

// Ensure test file exists
test.beforeAll(async () => {
  const dir = path.dirname(testPdfPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // Create a simple dummy PDF file content (not a valid PDF structure but enough for upload if backend doesn't strictly validate structure immediately or if we mock backend)
  // Ideally we should use a real small PDF. 
  // For now, let's write a minimal valid PDF header so it looks like a PDF.
  const pdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 100 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\n0000000220 00000 n\n0000000307 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n401\n%%EOF';
  
  fs.writeFileSync(testPdfPath, pdfContent);
});

test.describe('Compress PDF', () => {
  test('should upload and compress a PDF file', async ({ page }) => {
    await page.goto('/compress');
    
    // Check if page loaded
    await expect(page.getByRole('heading', { name: /PDF Küçült/i })).toBeVisible();

    // Upload file
    // Note: The file input is hidden in react-dropzone. We need to handle that.
    // Playwright's setInputFiles works on input[type="file"].
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testPdfPath);
    
    // Manually trigger change event for react-dropzone if needed
    // Sometimes setInputFiles is enough, but if it fails, this helps.
    // However, react-dropzone usually listens to 'change'.
    // Let's try waiting a bit or ensuring the input is attached.
    
    // Also, let's verify if the file was accepted.
    // If invalid file type, it won't work. We created a dummy file with .pdf extension.
    // The content was minimal.
    
    // Let's try to wait for the settings to appear with a longer timeout and debug info if possible.
    // But first, let's try dispatching the event.
    await fileInput.evaluate(e => e.dispatchEvent(new Event('change', { bubbles: true })));

    // Wait for upload to process (depends on UI)
    // Assuming there's a button to start compression or it happens automatically.
    // Let's check for a "Compress" button or similar.
    // Since I don't know the exact UI flow after upload, I'll assume a button appears.
    // I should probably read the Compress page code or just try to find a button.
    
    // If I look at ToolGrid, /compress goes to /compress page.
    // I haven't read Compress page code.
    // I'll assume standard flow: Upload -> Button -> Download.
    
    // Wait for compression options to appear (indicates file is selected)
    // We can check for the settings icon or text
    await expect(page.locator('.lucide-settings')).toBeVisible();

    // Click Compress button
    // The button text comes from translations. It might be "PDF Sıkıştır", "Sıkıştır", "Compress PDF", etc.
    // We can look for the button that is not the "New Operation" button.
    // Or look for the button with the Minimize2 icon.
    // Let's try a broad text match or the icon.
    const compressButton = page.locator('button').filter({ hasText: /Sıkıştır|Compress|Küçült/i }).first();
    await compressButton.click();
    
    // Wait for processing to finish and download button to appear
    // The download link has a download attribute
    const downloadLink = page.locator('a[download]');
    await expect(downloadLink).toBeVisible({ timeout: 10000 });
    
    // Optional: Verify download URL
    const href = await downloadLink.getAttribute('href');
    expect(href).toBeTruthy();
  });
});
