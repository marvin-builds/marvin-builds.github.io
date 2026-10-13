import { describe, expect, it } from 'vitest';
import { findHits, parseDenylist } from '../../scripts/check-privacy.mjs';

describe('parseDenylist', () => {
  it('drops comments and blank lines and trims terms', () => {
    expect(parseDenylist('# comment\n\n  Acme  \nGlobex\n')).toEqual(['Acme', 'Globex']);
  });
});

describe('findHits', () => {
  const files = [
    { path: 'a.md', text: 'Worked for a fashion retailer.\nShipped it.' },
    { path: 'b.yaml', text: 'customer: ACME Corp\n' },
  ];

  it('returns nothing when no term occurs', () => {
    expect(findHits(['Globex'], files)).toEqual([]);
  });

  it('matches case-insensitively and reports file, line and term', () => {
    expect(findHits(['acme'], files)).toEqual([{ path: 'b.yaml', line: 1, term: 'acme' }]);
  });

  it('treats /pattern/flags lines as regular expressions', () => {
    const regexFiles = [{ path: 'c.md', text: 'ABCD load\nsee XYZ-12 and ABC' }];
    expect(findHits(['/\\bABC\\b/', '/\\bXYZ-\\d+/'], regexFiles)).toEqual([
      { path: 'c.md', line: 2, term: '/\\bABC\\b/' },
      { path: 'c.md', line: 2, term: '/\\bXYZ-\\d+/' },
    ]);
  });

  it('ignores an empty term list', () => {
    expect(findHits([], files)).toEqual([]);
  });
});
