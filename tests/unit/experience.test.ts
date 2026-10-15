import { describe, expect, it } from 'vitest';
import { buildSkillIndex, readout, skillKey, yearSpan } from '../../src/lib/experience';

const el = { id: 'el', org: 'Element Logic', from: '2024-03', to: null, tech: ['Kotlin', 'Java', 'Oracle', { en: 'AI-assisted development', de: 'KI-gestützte Entwicklung' }] };
const de = { id: 'de', org: 'Dürr Systems', from: '2018-10', to: '2021-04', tech: ['Java', 'Oracle', 'Vue.js'] };
const ds = { id: 'ds', org: 'Dürr Systems', from: '2015-10', to: '2018-09', tech: ['C#', 'OPC UA'] };

describe('yearSpan', () => {
  it('shows whole years of a closed station', () => {
    expect(yearSpan(de)).toEqual({ from: '2018', to: '2021' });
  });

  it('leaves the end open for the current station', () => {
    expect(yearSpan(el)).toEqual({ from: '2024', to: null });
  });
});

describe('skillKey', () => {
  it('turns a label into a stable key', () => {
    expect(skillKey('Vue.js')).toBe('vue-js');
    expect(skillKey('C#')).toBe('c-sharp');
    expect(skillKey('C')).toBe('c');
    expect(skillKey({ en: 'AI-assisted development', de: 'KI-gestützte Entwicklung' })).toBe('ai-assisted-development');
  });
});

describe('buildSkillIndex', () => {
  const index = buildSkillIndex([el, de, ds]);

  it('lists each technology once with the stations that used it', () => {
    const java = index.find((s) => s.key === 'java');
    expect(java?.stations).toEqual(['el', 'de']);
    expect(index.filter((s) => s.key === 'java')).toHaveLength(1);
  });

  it('sorts by how many stations used it, then by name', () => {
    expect(index.map((s) => s.key)).toEqual(['java', 'oracle', 'ai-assisted-development', 'c-sharp', 'kotlin', 'opc-ua', 'vue-js']);
  });

  it('keeps the localized label of a phrase', () => {
    expect(index.find((s) => s.key === 'ai-assisted-development')?.label).toEqual({ en: 'AI-assisted development', de: 'KI-gestützte Entwicklung' });
    expect(index.find((s) => s.key === 'java')?.label).toEqual({ en: 'Java', de: 'Java' });
  });
});

describe('readout', () => {
  it('names the stations that used a technology, in English', () => {
    expect(readout('Java', [el, de], 'en')).toBe('Java: used at Element Logic (2024–today) and Dürr Systems (2018–2021).');
  });

  it('names them in German', () => {
    expect(readout('Java', [el, de], 'de')).toBe('Java: genutzt bei Element Logic (2024–heute) und Dürr Systems (2018–2021).');
  });

  it('lists three stations with commas', () => {
    expect(readout('X', [el, de, ds], 'en')).toBe('X: used at Element Logic (2024–today), Dürr Systems (2018–2021) and Dürr Systems (2015–2018).');
  });
});
