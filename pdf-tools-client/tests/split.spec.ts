import { test, expect } from '@playwright/test';

test('PDF Split Flow', async ({ page }) => {
  await page.goto('/tr/split');
  
  // Verify page title contains expected text
  await expect(page).toHaveTitle(/PDF Böl/);
  
  // Verify dropzone exists
  const fileInput = page.locator('input[type="file"]');
  await expect(fileInput).toBeAttached();
  
  // Note: For full E2E test, you would:
  // 1. Upload a PDF file using setInputFiles
  // 2. Select split mode (range or extract)
  // 3. Enter range or select pages
  // 4. Click split button
  // 5. Verify download or success message
});
