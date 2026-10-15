import { expect, test, type Page } from '@playwright/test';
import { assembleAddress } from '../../src/lib/email';
import { SITE } from '../../src/site';

const answered = (page: Page, culture: 'professional' | 'personal', lang = 'en') =>
  page.addInitScript(
    ([c, l]) => {
      if (!sessionStorage.getItem('seeded')) {
        localStorage.setItem('mm-culture', c);
        localStorage.setItem('mm-lang', l);
        sessionStorage.setItem('seeded', '1');
      }
    },
    [culture, lang],
  );

const errors: string[] = [];
test.beforeEach(({ page }) => {
  errors.length = 0;
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
});
test.afterEach(() => expect(errors).toEqual([]));

test.describe('first visit', () => {
  test.use({ locale: 'en-GB' });

  test('shows only the name, role line and the question', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-culture', 'neutral');
    await expect(page).toHaveTitle('Marvin Mai');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Marvin\s*Mai/);
    await expect(page.locator('.role')).toContainText('Software engineer · Kotlin, Java, Spring', { useInnerText: true });
    await expect(page.getByText('How should I introduce myself?')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeHidden();
    await expect(page.locator('#experience')).toBeHidden();
    await expect(page.locator('#culture-ctl')).toBeHidden();
    await expect(page.getByRole('group', { name: 'Language' })).toBeVisible();
  });

  test('answering casually reveals the page in that tone and remembers it', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Casually' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-culture', 'personal');
    await expect(page.locator('#experience')).toBeVisible();
    await expect(page.getByText('How should I introduce myself?')).toBeHidden();
    await expect(page.locator('#culture-ctl [data-set-culture="personal"]')).toBeFocused();
    await expect(page.locator('.hero .next')).toContainText('Say hi');
    expect(await page.evaluate(() => localStorage.getItem('mm-culture'))).toBe('personal');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-culture', 'personal');
  });

  test('picks German from the browser language', async ({ browser }) => {
    const ctx = await browser.newContext({ locale: 'de-DE' });
    const p = await ctx.newPage();
    await p.goto('/');
    await expect(p.locator('html')).toHaveAttribute('lang', 'de');
    await expect(p.getByText('Wie soll ich mich vorstellen?')).toBeVisible();
    await ctx.close();
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('shows the whole page in the formal tone', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#experience')).toBeVisible();
    await expect(page.getByText('Work-study student, Mechatronics')).toBeVisible();
    await expect(page.locator('.hero .lede')).toContainText('I build backend systems');
  });
});

test.describe('answered, formal', () => {
  test.beforeEach(async ({ page }) => {
    await answered(page, 'professional');
    await page.goto('/');
  });

  test('renders the stations from the content files', async ({ page }) => {
    const stations = page.locator('.station');
    await expect(stations).toHaveCount(3);
    await expect(stations.nth(0)).toContainText('Element Logic');
    await expect(stations.nth(0).locator('.st-years')).toContainText('2024–today');
    await expect(stations.nth(1)).toContainText('Official title: Development Engineer MES & IIoT');
    await expect(stations.nth(2)).toContainText('B.Eng. Mechatronics, DHBW Stuttgart, 2018');
  });

  test('expands and collapses a station', async ({ page }) => {
    const first = page.locator('.station').nth(0).locator('button.st-head');
    const second = page.locator('.station').nth(1).locator('button.st-head');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByText('Connecting automated storage systems')).toBeVisible();
    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByText('Knowledge transfer')).toBeVisible();
    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByText('Connecting automated storage systems')).toBeHidden();
  });

  test('the technology filter lights the stations that used it', async ({ page }) => {
    await page.locator('#skill-list [data-skill="java"]').click();
    await expect(page.locator('.station.lit')).toHaveCount(2);
    await expect(page.locator('.station.dim')).toHaveCount(1);
    await expect(page.locator('#skill-out')).toContainText('Java: used at Element Logic (2024–today) and Dürr Systems (2018–2021).');
    await page.keyboard.press('Escape');
    await expect(page.locator('.station.lit')).toHaveCount(0);
  });

  test('shows the How I work items', async ({ page }) => {
    await expect(page.locator('#how li')).toHaveCount(6);
    await expect(page.locator('#how')).toContainText("Clean where it counts, pragmatic where it doesn't.");
  });

  test('switches tone from the header', async ({ page }) => {
    await page.locator('#culture-ctl [data-set-culture="personal"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-culture', 'personal');
    await expect(page.locator('#contact h2')).toContainText('Say hello');
  });

  test('switches language', async ({ page }) => {
    await page.getByRole('button', { name: 'Deutsch' }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('#h-exp')).toHaveText('Berufserfahrung', { useInnerText: true });
    await expect(page.locator('.portrait img.pp')).toHaveAttribute('alt', /Porträt von Marvin Mai/);
    expect(await page.evaluate(() => localStorage.getItem('mm-lang'))).toBe('de');
  });

  test('switches between day and night', async ({ page }) => {
    await page.getByRole('button', { name: 'Night', exact: true }).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => localStorage.getItem('mm-scheme'))).toBe('dark');
    await page.getByRole('button', { name: 'Day', exact: true }).click();
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });

  test('reveals the e-mail address only on demand', async ({ page }) => {
    expect(await page.content()).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
    await page.getByRole('button', { name: 'Show e-mail address' }).click();
    await expect(page.locator('#mail-link')).toHaveAttribute('href', `mailto:${assembleAddress(SITE.emailParts)}`);
    await expect(page.locator('#mail-link')).toBeFocused();
  });

  test('the palette jumps to a section and returns focus', async ({ page }) => {
    await page.keyboard.press('Control+k');
    const input = page.getByRole('combobox');
    await expect(input).toBeFocused();
    await input.fill('contact');
    await expect(page.getByRole('option').first()).toHaveText('Contact');
    await page.keyboard.press('Enter');
    await expect(page.locator('dialog.palette')).not.toHaveAttribute('open');
    await expect(page.locator('#contact')).toBeFocused();
  });

  test('the palette switches the tone and closes with Escape', async ({ page }) => {
    const opener = page.locator('#open-palette');
    await opener.click();
    await page.getByRole('combobox').fill('casually');
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-culture', 'personal');
    await opener.click();
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  });

  test('contact links and header controls are easy to hit', async ({ page }) => {
    for (const el of await page.locator('.reach a, .reach button').all()) expect((await el.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    for (const el of await page.locator('.site-header button, .site-header .nav a').all()) expect((await el.boundingBox())!.height).toBeGreaterThanOrEqual(24);
  });

  test('serves optimised photographs', async ({ page }) => {
    const src = await page.locator('.hero .band img.crop').first().evaluate((i: HTMLImageElement) => i.currentSrc);
    expect(src).toMatch(/\.(avif|webp)/);
  });
});

for (const culture of ['professional', 'personal'] as const) {
  test(`no horizontal overflow at 360px in German, ${culture}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await answered(page, culture, 'de');
    await page.goto('/');
    for (const y of [0, 900, 1800, 2700, 3600, 99999]) {
      await page.evaluate((top) => scrollTo(0, top), y);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    }
  });
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('uses native scrolling and no lamp', async ({ page }) => {
    await answered(page, 'professional');
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/\brm\b/);
    await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
    await expect(page.locator('.light')).toBeHidden();
  });
});
