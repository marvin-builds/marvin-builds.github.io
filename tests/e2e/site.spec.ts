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
test.beforeEach(async ({ page }) => {
  errors.length = 0;
  // never count test runs; the analytics test installs its own stub
  await page.route('**/gc.zgo.at/**', (r) => r.fulfill({ contentType: 'text/javascript', body: '' }));
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
    await expect(page.locator('.role')).toHaveText('Backend software engineer', { useInnerText: true });
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /^Marvin Mai, backend software engineer\. /);
    await expect(page.getByText('How should I introduce myself?')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeHidden();
    await expect(page.locator('#experience')).toBeHidden();
    await expect(page.locator('#culture-ctl')).toBeHidden();
    await expect(page.getByRole('group', { name: 'Language' })).toBeVisible();
  });

  test('centres the question in the first screen, but never above the horizon', async ({ page }) => {
    const place = async (width: number, height: number) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: 'reduce' }); // measure the words where they rest, not mid-entrance
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('#gate')).toBeVisible();
      return page.evaluate(() => {
        const glyphs = (el: Node) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); };
        const probe = document.createElement('div');
        probe.style.cssText = 'position:absolute;top:var(--hz)';
        document.querySelector('.hero')!.append(probe);
        const g = document.querySelector('#gate')!.getBoundingClientRect();
        const words = [...document.querySelectorAll('.name .ln > span'), document.querySelector('.role')!].map(glyphs);
        // the smallest distance from the question to any word of the name or role line, along whichever axis separates them
        const gap = Math.min(...words.map((w) => Math.max(w.left - g.right, g.left - w.right, w.top - g.bottom, g.top - w.bottom)));
        return { mid: (g.top + g.bottom) / 2, top: g.top, hz: probe.getBoundingClientRect().top, gap };
      });
    };
    // the centre lies below the horizon (phones, tall windows): the true centre of the screen
    for (const [w, h] of [[2560, 1440], [390, 844], [768, 1024]]) {
      const p = await place(w, h);
      expect(Math.abs(p.mid - h / 2), `${w}×${h} centred`).toBeLessThan(2);
      expect(p.gap, `${w}×${h} clear`).toBeGreaterThanOrEqual(24);
    }
    // the centre is level with the horizon (desktops, short phones): as close to it as it can be, just under the horizon
    for (const [w, h] of [[1024, 768], [1280, 720], [1280, 800], [1440, 900], [1920, 1080], [360, 640]]) {
      const p = await place(w, h);
      expect(p.top - p.hz, `${w}×${h} under the horizon`).toBeGreaterThanOrEqual(8);
      expect(p.top - p.hz, `${w}×${h} close to it`).toBeLessThanOrEqual(28);
      expect(p.gap, `${w}×${h} clear`).toBeGreaterThanOrEqual(24);
    }
  });

  test('answering casually reveals the page in that tone and remembers it', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Casually' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-culture', 'personal');
    await expect(page.locator('#experience')).toBeVisible();
    await expect(page.getByText('How should I introduce myself?')).toBeHidden();
    await expect(page.locator('#culture-ctl [data-set-culture="personal"]')).toBeFocused();
    await expect(page.locator('.hero .next')).toContainText('Say hi');
    await expect(page.locator('.hero a[href*="github.com"]')).toHaveCount(0); // GitHub sits only in contact and footer
    await expect(page.locator('#contact a[href*="github.com"]')).toHaveCount(2);
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
    await expect(p.locator('.role')).toHaveText('Backend-Softwareentwickler', { useInnerText: true });
    await ctx.close();
  });
});

test.describe('analytics', () => {
  test('counts the chosen tone as an event, once per answer', async ({ page }) => {
    await page.route('**/gc.zgo.at/**', (r) =>
      r.fulfill({ contentType: 'text/javascript', body: 'window.__gc = []; window.goatcounter = { count: (o) => window.__gc.push(o) };' }));
    await page.goto('/');
    await page.getByRole('button', { name: 'Casually' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-culture', 'personal');
    await page.locator('#culture-ctl [data-set-culture="professional"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-culture', 'professional');
    expect(await page.evaluate(() => (window as unknown as { __gc: { path: string; event: boolean }[] }).__gc)).toEqual([
      expect.objectContaining({ path: 'tone-personal', event: true }),
      expect.objectContaining({ path: 'tone-professional', event: true }),
    ]);
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
    await page.getByRole('button', { name: 'Day', exact: true }).click();
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => localStorage.getItem('mm-scheme'))).toBe('light');
    await page.getByRole('button', { name: 'Night', exact: true }).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => localStorage.getItem('mm-scheme'))).toBe('dark');
  });

  test('starts at night, even on a light system, until a choice is made', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await expect(page.getByRole('button', { name: 'Night', exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
    expect(await page.evaluate(() => localStorage.getItem('mm-scheme'))).toBeNull();
  });

  test('the palette can follow the system setting instead', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.locator('#open-palette').click();
    await page.getByRole('combobox').fill('system');
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => localStorage.getItem('mm-scheme'))).toBe('auto');
    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
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

  test('says where I am based and which languages I speak', async ({ page }) => {
    await expect(page.locator('#contact .contact-facts')).toHaveText('Stuttgart, Germany · German (native), English (fluent)', { useInnerText: true });
    await page.getByRole('button', { name: 'Deutsch' }).click();
    await expect(page.locator('#contact .contact-facts')).toHaveText('Stuttgart · Deutsch (Muttersprache), Englisch (fließend)', { useInnerText: true });
  });

  test('contact links and header controls are easy to hit', async ({ page }) => {
    for (const el of await page.locator('.reach a, .reach button').all()) expect((await el.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    for (const el of await page.locator('.site-header button, .site-header .nav a').all()) expect((await el.boundingBox())!.height).toBeGreaterThanOrEqual(24);
  });

  test('can be found by search engines', async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });

  test('loads the GoatCounter script for the site', async ({ page }) => {
    await expect(page.locator('script[data-goatcounter]')).toHaveAttribute('data-goatcounter', 'https://marvin-builds.goatcounter.com/count');
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
