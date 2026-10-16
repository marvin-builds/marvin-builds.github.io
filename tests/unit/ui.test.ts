import { describe, expect, it } from 'vitest';
import { assembleAddress, encodeAddress } from '../../src/lib/email';
import { filterCommands, groupCommands, type Command } from '../../src/lib/palette';
import { shortcutLabel } from '../../src/lib/shortcut';

describe('e-mail address', () => {
  it('is stored as reversed parts that never contain the address', () => {
    const parts = encodeAddress('hello@example.com');
    expect(parts.join('')).not.toContain('hello');
    expect(parts.join('')).not.toContain('example.com');
  });

  it('is assembled back from its parts', () => {
    expect(assembleAddress(encodeAddress('first.last@mail.example.org'))).toBe('first.last@mail.example.org');
  });
});

describe('palette', () => {
  const cmds: Command[] = [
    { id: 'go-exp', group: { en: 'Go to', de: 'Gehe zu' }, name: { en: 'Experience', de: 'Berufserfahrung' } },
    { id: 'go-contact', group: { en: 'Go to', de: 'Gehe zu' }, name: { en: 'Contact', de: 'Kontakt' } },
    { id: 'lang-de', group: { en: 'Language', de: 'Sprache' }, name: { en: 'Deutsch', de: 'Deutsch' } },
  ];

  it('shows everything for an empty query', () => {
    expect(filterCommands(cmds, '  ', 'en')).toHaveLength(3);
  });

  it('matches the localized name, the group and the English name', () => {
    expect(filterCommands(cmds, 'kontakt', 'de').map((c) => c.id)).toEqual(['go-contact']);
    expect(filterCommands(cmds, 'gehe', 'de').map((c) => c.id)).toEqual(['go-exp', 'go-contact']);
    expect(filterCommands(cmds, 'experience', 'de').map((c) => c.id)).toEqual(['go-exp']);
    expect(filterCommands(cmds, 'kontakt', 'en')).toEqual([]);
  });

  it('groups commands under their localized header, in order', () => {
    expect(groupCommands(cmds, 'de')).toEqual([
      { header: 'Gehe zu', items: [cmds[0], cmds[1]] },
      { header: 'Sprache', items: [cmds[2]] },
    ]);
  });
});

describe('shortcutLabel', () => {
  it('shows the command key on Apple platforms', () => {
    expect(shortcutLabel('MacIntel', 'en')).toBe('⌘K');
    expect(shortcutLabel('iPad', 'de')).toBe('⌘K');
  });

  it('shows Ctrl or Strg elsewhere', () => {
    expect(shortcutLabel('Win32', 'en')).toBe('Ctrl K');
    expect(shortcutLabel('Linux x86_64', 'de')).toBe('Strg K');
  });
});

