import { expect, test } from '@playwright/test';

test.describe('holding page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('introduces me by name and role', async ({ page }) => {
    await expect(page).toHaveTitle('Marvin Mai');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Marvin Mai');
    await expect(page.getByText('Software engineer · Kotlin, Java, Spring')).toBeVisible();
  });

  test('says the site is in progress, in English and German', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('This site is being built.')).toBeVisible();
    await expect(page.locator('[lang="de"]')).toContainText('Diese Seite entsteht gerade.');
  });

  test('links to my GitHub profile', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/marvinmai');
  });

  test('keeps search engines away until the real site is live', async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });
});
