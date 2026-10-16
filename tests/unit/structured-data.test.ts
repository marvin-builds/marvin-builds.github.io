import { describe, expect, it } from 'vitest';
import { personJsonLd } from '../../src/lib/structured-data';

const el = { id: 'el', org: 'Element Logic', from: '2024-03', to: null, tech: ['Kotlin', 'Java', { en: 'AI-assisted development', de: 'KI-gestützte Entwicklung' }] };
const de = { id: 'de', org: 'Dürr Systems', from: '2018-10', to: '2021-04', tech: ['Java', 'Vue.js'] };

describe('structured data for search engines', () => {
  const ld = personJsonLd([el, de], { url: 'https://example.org/', description: 'About me.', sameAs: ['https://github.com/me'] });

  it('describes the owner as a schema.org Person', () => {
    expect(ld).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Marvin Mai',
      jobTitle: 'Backend software engineer',
      url: 'https://example.org/',
      description: 'About me.',
      sameAs: ['https://github.com/me'],
      knowsLanguage: ['de', 'en'],
      homeLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Stuttgart', addressCountry: 'DE' } },
    });
  });

  it('names the current employer only', () => {
    expect(ld.worksFor).toEqual({ '@type': 'Organization', name: 'Element Logic' });
  });

  it('lists every technology once, in English', () => {
    expect(ld.knowsAbout).toEqual(['Java', 'AI-assisted development', 'Kotlin', 'Vue.js']);
  });
});
