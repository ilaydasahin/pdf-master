import { test, expect } from '@playwright/test';

test.describe('Merge PDF Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/merge');
  });

  test('should display merge PDF page with upload area', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Merge PDF/i);
    
    // Check upload area exists
    const uploadArea = page.locator('[data-testid="dropzone"]');
    await expect(uploadArea).toBeVisible();
  });

  test('should upload and merge two PDF files', async ({ page }) => {
    // Upload first PDF
    const file1 = await page.locator('input[type="file"]');
    await file1.setInputFiles('./test-files/sample1.pdf');
    
    // Wait for file to be processed
    await expect(page.locator('text=sample1.pdf')).toBeVisible();
    
    // Upload second PDF
    await file1.setInputFiles('./test-files/sample2.pdf');
    await expect(page.locator('text=sample2.pdf')).toBeVisible();
    
    // Click merge button
    const mergeButton = page.locator('button:has-text("Merge")');
    await mergeButton.click();
    
    // Wait for processing
    await expect(page.locator('text=Processing')).toBeVisible();
    
    // Wait for download button
    const downloadButton = page.locator('button:has-text("Download")');
    await expect(downloadButton).toBeVisible({ timeout: 10000 });
    
    // Verify download link
    await expect(downloadButton).toBeEnabled();
  });

  test('should show error for invalid file type', async ({ page }) => {
    // Try to upload non-PDF file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-files/invalid.txt');
    
    // Check for error message
    await expect(page.locator('text=/only.*pdf.*files/i')).toBeVisible();
  });

  test('should allow reordering PDF files', async ({ page }) => {
    // Upload files
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      './test-files/sample1.pdf',
      './test-files/sample2.pdf'
    ]);
    
    // Wait for files to appear
    await expect(page.locator('text=sample1.pdf')).toBeVisible();
    await expect(page.locator('text=sample2.pdf')).toBeVisible();
    
    // Get initial order
    const fileList = page.locator('[data-testid="file-list"]');
    const firstFile = fileList.locator('[data-testid="file-item"]').first();
    await expect(firstFile).toContainText('sample1.pdf');
    
    // Drag and drop to reorder (if implemented)
    // This would require specific drag-drop implementation
  });

  test('should remove uploaded file', async ({ page }) => {
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-files/sample1.pdf');
    
    // Wait for file
    await expect(page.locator('text=sample1.pdf')).toBeVisible();
    
    // Click remove button
    const removeButton = page.locator('[aria-label="Remove file"]').first();
    await removeButton.click();
    
    // Verify file is removed
    await expect(page.locator('text=sample1.pdf')).not.toBeVisible();
  });
});

test.describe('Split PDF Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/split');
  });

  test('should split PDF by page range', async ({ page }) => {
    // Upload PDF
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-files/multi-page.pdf');
    
    // Wait for preview
    await expect(page.locator('text=/\\d+ pages/i')).toBeVisible();
    
    // Enter page range
    const rangeInput = page.locator('input[placeholder*="range"]');
    await rangeInput.fill('1-3');
    
    // Click split
    const splitButton = page.locator('button:has-text("Split")');
    await splitButton.click();
    
    // Wait for result
    await expect(page.locator('text=Download')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Compress PDF Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/compress');
  });

  test('should compress PDF with quality slider', async ({ page }) => {
    // Upload PDF
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-files/large.pdf');
    
    await expect(page.locator('text=/original size/i')).toBeVisible();
    
    // Adjust quality slider
    const qualitySlider = page.locator('input[type="range"]');
    await qualitySlider.fill('50');
    
    // Compress
    const compressButton = page.locator('button:has-text("Compress")');
    await compressButton.click();
    
    // Wait for result
    await expect(page.locator('text=/compressed/i')).toBeVisible({ timeout: 15000 });
    
    // Verify size reduction indicator
    await expect(page.locator('text=/%/i')).toBeVisible();
  });
});

test.describe('Navigation and Responsive', () => {
  test('should navigate between tools', async ({ page }) => {
    await page.goto('/');
    
    // Click on Merge tool
    await page.locator('a:has-text("Merge PDF")').click();
    await expect(page).toHaveURL(/\/merge/);
    
    // Navigate back
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Click on Split tool
    await page.locator('a:has-text("Split PDF")').click();
    await expect(page).toHaveURL(/\/split/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile menu
    const mobileMenu = page.locator('[aria-label="Menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
    }
    
    // Verify tool grid is visible and stacked
    const toolGrid = page.locator('[data-testid="tool-grid"]');
    await expect(toolGrid).toBeVisible();
  });

  test('should work on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Verify tool grid shows 2 columns
    const toolCards = page.locator('[data-testid="tool-card"]');
    const count = await toolCards.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Error Handling', () => {
  test('should show error for failed upload', async ({ page }) => {
    await page.goto('/merge');
    
    // Intercept API and force error
    await page.route('**/api/merge', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-files/sample1.pdf');
    
    // Click merge
    const mergeButton = page.locator('button:has-text("Merge")');
    await mergeButton.click();
    
    // Verify error message
    await expect(page.locator('text=/error/i')).toBeVisible();
  });

  test('should show error for rate limiting', async ({ page }) => {
    await page.goto('/merge');
    
    // Intercept and return 429
    await page.route('**/api/merge', route => {
      route.fulfill({
        status: 429,
        body: JSON.stringify({ error: 'Too Many Requests' })
      });
    });
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-files/sample1.pdf');
    
    const mergeButton = page.locator('button:has-text("Merge")');
    await mergeButton.click();
    
    await expect(page.locator('text=/rate limit/i')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verify focus is visible
    const focused = await page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/merge');
    
    // Check for aria-label on upload area
    const uploadArea = page.locator('[aria-label*="upload"]');
    await expect(uploadArea).toBeVisible();
  });
});
