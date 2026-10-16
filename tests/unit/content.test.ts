import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { contactSchema, footerSchema, heroSchema, howSchema, stationSchema } from '../../src/lib/schemas';

const read = (path: string) => parse(readFileSync(new URL(`../../src/content/${path}`, import.meta.url), 'utf8'));

describe('site copy', () => {
  it('has every hero text in both languages and both tones', () => {
    expect(heroSchema.safeParse(read('sections/hero.yaml')).success).toBe(true);
  });

  it('has the contact, footer and How I work copy complete', () => {
    expect(contactSchema.safeParse(read('sections/contact.yaml')).success).toBe(true);
    expect(footerSchema.safeParse(read('sections/footer.yaml')).success).toBe(true);
    expect(howSchema.safeParse(read('sections/how-i-work.yaml')).success).toBe(true);
  });

  it('has every station complete in both languages', () => {
    const files = readdirSync(new URL('../../src/content/stations/', import.meta.url));
    expect(files.length).toBe(4);
    for (const f of files) {
      const r = stationSchema.safeParse(read(`stations/${f}`));
      expect(r.error?.message ?? 'ok', f).toBe('ok');
    }
  });

  it('rejects a tone variant that lacks a language', () => {
    const hero = read('sections/hero.yaml');
    delete hero.lede.per.de;
    expect(heroSchema.safeParse(hero).success).toBe(false);
  });

  it('rejects a station month in the wrong format', () => {
    const st = read('stations/element-logic.yaml');
    st.from = '2024';
    expect(stationSchema.safeParse(st).success).toBe(false);
  });
});
