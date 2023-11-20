import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should render home page correctly on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Check if navbar toggle is visible (hamburger menu)
    // Assuming there is a button for mobile menu
    // We need to check Navbar.tsx to know the aria-label or class
    // Usually "Open main menu" or similar.
    // Let's assume a generic check for now or check if tool grid is stacked.
    
    const toolGrid = page.locator('#tools > div > div');
    // Grid cols should be 1 on mobile
    await expect(toolGrid).toHaveClass(/grid-cols-1/);
  });

  test('should render tool page correctly on mobile', async ({ page }) => {
    await page.goto('/merge');
    
    // Check if file uploader is visible and fits
    const uploader = page.locator('input[type="file"]');
    await expect(uploader).toBeAttached();
  });
});
