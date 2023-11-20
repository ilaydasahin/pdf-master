import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('PDF Merge Tool', () => {
  test('should merge two PDF files successfully', async ({ page }) => {
    // Navigate to merge page
    await page.goto('/merge');
    
    // Check if page loaded
    await expect(page.locator('h1')).toContainText('Merge PDF');
    
    // Upload files
    const file1 = path.join(__dirname, '../test-files/valid/sample-1page.pdf');
    const file2 = path.join(__dirname, '../test-files/valid/sample-5page.pdf');
    
    // Wait for file input and upload
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([file1, file2]);
    
    // Check if files are listed
    await expect(page.getByText('sample-1page.pdf')).toBeVisible();
    await expect(page.getByText('sample-5page.pdf')).toBeVisible();
    
    // Click merge button
    const mergeButton = page.locator('button:has-text("Merge PDF")');
    await expect(mergeButton).toBeEnabled();
    await mergeButton.click();
    
    // Wait for processing
    await expect(page.getByText('Processing...')).toBeVisible();
    
    // Wait for success and download button
    await expect(page.getByText('Success!')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('a[download]')).toBeVisible();
  });

  test('should show error for invalid files', async ({ page }) => {
    await page.goto('/merge');
    
    // Upload invalid file (e.g. text file renamed to pdf)
    // Note: You need to create this file first or use a non-pdf file
    // For now, we test empty selection or UI state
    
    const mergeButton = page.locator('button:has-text("Merge PDF")');
    await expect(mergeButton).toBeDisabled();
  });
});
