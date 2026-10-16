// Pure helpers for the Experience section: year spans, the technology index and the filter's readout (spec §11).
import type { Localized } from './schemas';

export type Lang = 'en' | 'de';
export type Tech = string | Localized;
export interface StationLike {
  id: string;
  org: string | Localized;
  from: string;
  to: string | null;
  tech: Tech[];
}
export interface Skill {
  key: string;
  label: Localized;
  stations: string[];
}

export const yearSpan = (s: Pick<StationLike, 'from' | 'to'>) => ({ from: s.from.slice(0, 4), to: s.to ? s.to.slice(0, 4) : null });

export const labelOf = (t: Tech): Localized => (typeof t === 'string' ? { en: t, de: t } : t);

export function skillKey(t: Tech): string {
  return labelOf(t)
    .en.toLowerCase()
    .replace(/#/g, '-sharp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Each technology once, with the stations that used it; sorted by count, then by English name. */
export function buildSkillIndex(stations: StationLike[]): Skill[] {
  const byKey = new Map<string, Skill>();
  for (const s of stations) {
    for (const t of s.tech) {
      const key = skillKey(t);
      const skill = byKey.get(key) ?? { key, label: labelOf(t), stations: [] };
      if (!skill.stations.includes(s.id)) skill.stations.push(s.id);
      byKey.set(key, skill);
    }
  }
  return [...byKey.values()].sort((a, b) => b.stations.length - a.stations.length || a.label.en.localeCompare(b.label.en, 'en'));
}

const words = {
  en: { today: 'today', used: 'used at', and: 'and' },
  de: { today: 'heute', used: 'genutzt bei', and: 'und' },
};

export function spanText(s: Pick<StationLike, 'from' | 'to'>, lang: Lang): string {
  const y = yearSpan(s);
  return `${y.from}–${y.to ?? words[lang].today}`;
}

/** "Java: used at Element Logic (2024–today) and Dürr Systems (2018–2021)." */
export function readout(label: string, hits: StationLike[], lang: Lang): string {
  const w = words[lang];
  const parts = hits.map((s) => `${labelOf(s.org)[lang]} (${spanText(s, lang)})`);
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} ${w.and} ${parts.at(-1)}` : (parts[0] ?? '');
  return `${label}: ${w.used} ${list}.`;
}
