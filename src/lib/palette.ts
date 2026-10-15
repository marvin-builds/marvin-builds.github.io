// Matching and grouping for the command palette (spec §15).
import type { Lang } from './experience';
import type { Localized } from './schemas';

export interface Command {
  id: string;
  group: Localized;
  name: Localized;
}

/** Substring match on the localized group and name and on the English name. */
export function filterCommands<C extends Command>(cmds: C[], query: string, lang: Lang): C[] {
  const q = query.trim().toLowerCase();
  if (!q) return cmds;
  return cmds.filter((c) => `${c.group[lang]} ${c.name[lang]} ${c.name.en}`.toLowerCase().includes(q));
}

export function groupCommands<C extends Command>(cmds: C[], lang: Lang): { header: string; items: C[] }[] {
  const groups: { header: string; items: C[] }[] = [];
  for (const c of cmds) {
    const header = c.group[lang];
    const g = groups.find((x) => x.header === header);
    if (g) g.items.push(c);
    else groups.push({ header, items: [c] });
  }
  return groups;
}
