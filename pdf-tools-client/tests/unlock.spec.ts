import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const testPdfPath = path.join(__dirname, 'test-files', 'sample.pdf');

test.describe('Unlock PDF', () => {
  test('should upload and unlock a PDF file', async ({ page }) => {
    await page.goto('/unlock');
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testPdfPath);

    // Wait for password input to appear
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('password123');

    // Click Unlock button
    const unlockButton = page.locator('button').filter({ hasText: /Kilidi Aç|Unlock|Şifre Kaldır/i }).first();
    await unlockButton.click();
    
    // Wait for download link
    const downloadLink = page.locator('a[download]');
    await expect(downloadLink).toBeVisible({ timeout: 10000 });
  });
});
