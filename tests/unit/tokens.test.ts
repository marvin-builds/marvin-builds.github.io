import { describe, expect, it } from 'vitest';
import { paletteCss, palettes } from '../../src/styles/tokens';

describe('palette CSS', () => {
  const css = paletteCss();

  it('puts the formal day palette on the root', () => {
    expect(css).toMatch(/:root \{[^}]*--bg: #f1e6d2;/);
  });

  it('puts the casual day palette on the personal culture', () => {
    expect(css).toMatch(/:root\[data-culture="personal"\] \{[^}]*--bg: #e4e2b4;/);
  });

  it('applies the night palettes for the system preference unless day is chosen', () => {
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-scheme="light"\]\) \{[^}]*--bg: #08111c;/);
    expect(css).toMatch(/:root:not\(\[data-scheme="light"\]\)\[data-culture="personal"\] \{[^}]*--bg: #0c180c;/);
  });

  it('applies the same night palettes when night is chosen', () => {
    expect(css).toMatch(/:root\[data-scheme="dark"\] \{[^}]*--bg: #08111c;/);
    expect(css).toMatch(/:root\[data-scheme="dark"\]\[data-culture="personal"\] \{[^}]*--bg: #0c180c;/);
  });

  it('writes every night token in both night blocks', () => {
    const count = (re: RegExp) => (css.match(re) ?? []).length;
    for (const key of Object.keys(palettes.proDark)) expect(count(new RegExp(`--${key}:`, 'g'))).toBeGreaterThanOrEqual(4);
  });

  it('sets the colour scheme of the night blocks', () => {
    expect(css).toMatch(/:root\[data-scheme="dark"\] \{\s*color-scheme: dark;/);
  });
});
