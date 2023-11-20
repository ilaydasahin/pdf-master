import { test, expect } from '@playwright/test';
import path from 'path';

const testPdfPath = path.join(__dirname, 'test-files', 'sample.pdf');

test.describe('Protect PDF', () => {
  test('should upload and protect a PDF file', async ({ page }) => {
    await page.goto('/protect');
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testPdfPath);

    // Wait for password input to appear (indicates file is selected)
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('password123');

    // Click Protect button
    // Look for button with Lock icon or text
    const protectButton = page.locator('button').filter({ hasText: /Kilitle|Protect|Şifrele/i }).first();
    await protectButton.click();
    
    // Wait for download link
    const downloadLink = page.locator('a[download]');
    await expect(downloadLink).toBeVisible({ timeout: 10000 });
  });
});
