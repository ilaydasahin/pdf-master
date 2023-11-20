import { test, expect } from '@playwright/test';

test('PDF Merge Flow', async ({ page }) => {
  await page.goto('/tr/merge');
  
  // Verify page title contains expected text
  await expect(page).toHaveTitle(/PDF Birleştir/);
  
  // Verify dropzone exists
  const fileInput = page.locator('input[type="file"]');
  await expect(fileInput).toBeAttached();
  
  // Note: For full E2E test, you would:
  // 1. Upload actual PDF files using setInputFiles
  // 2. Verify files appear in the list
  // 3. Click merge button
  // 4. Verify download or success message
});
