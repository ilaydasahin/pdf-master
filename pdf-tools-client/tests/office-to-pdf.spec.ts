import { test, expect } from '@playwright/test';

test('Office to PDF Page Loads', async ({ page }) => {
  await page.goto('/tr/office-to-pdf');
  
  // Verify page title contains expected text
  // Note: Title might vary based on translation, but "PDF" should be there.
  await expect(page).toHaveTitle(/PDF/);
  
  // Verify dropzone exists
  const fileInput = page.locator('input[type="file"]');
  await expect(fileInput).toBeAttached();
  
  // Verify acceptance of office formats
  const acceptAttribute = await fileInput.getAttribute('accept');
  expect(acceptAttribute).toContain('.docx');
  expect(acceptAttribute).toContain('.xlsx');
  expect(acceptAttribute).toContain('.pptx');
});
