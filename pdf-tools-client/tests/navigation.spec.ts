import { test, expect } from '@playwright/test';

const tools = [
  'merge',
  'split',
  'compress',
  'word-to-pdf',
  'powerpoint-to-pdf',
  'excel-to-pdf',
  'edit-pdf',
  'pdf-to-jpg',
  'jpg-to-pdf',
  'watermark',
  'rotate',
  'unlock',
  'protect',
  'delete',
  'page-number',
  'ocr',
  'html-to-pdf',
  'pdf-to-pdfa',
  'repair',
  'compare',
  'redact',
  'crop',
  'workflows'
];

test.describe('Navigation', () => {
  test('should navigate to all tool pages', async ({ page }) => {
    for (const tool of tools) {
      await page.goto(`/${tool}`);
      // Expect some content related to the tool
      // We can check if the main heading exists or if the URL is correct
      await expect(page).toHaveURL(new RegExp(`/${tool}`));
      
      // Check for a heading. Most pages should have an h1.
      // Some might be localized, but usually there's an h1.
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should navigate from home page to a tool', async ({ page }) => {
    await page.goto('/');
    
    // Click on "PDF Birleştir" (Merge PDF) inside the tools section
    // We target the link inside the tool grid to avoid navbar/footer links
    await page.locator('#tools a[href*="/merge"]').first().click();
    await expect(page).toHaveURL(/\/merge/);
  });
});
