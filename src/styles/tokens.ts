// The four colour palettes (design spec §2), sampled from the two atmosphere photographs. paletteCss() writes the
// blocks for day, the system's night preference and the night override from this one object, so they cannot drift.
type Palette = Record<string, string>;

const proLight: Palette = {
  bg: '#f1e6d2', 'bg-2': '#e8d6ba', ink: '#0a1f33', 'ink-2': '#2d4558', accent: '#0a4f86', ember: '#8a3d12',
  lamp: '#fff1dc', leak: 'rgba(255, 190, 130, .5)', 'leak-pos': '50% 52%', grade: 'rgba(0, 0, 0, 0)',
  line: 'rgba(10, 31, 51, .18)', 'sel-bg': '#0a1f33', 'sel-ink': '#f3d9b4',
  // light-only page colours: hero ground, text bars, skill pane, clearing seam, ground pool, unanswered sky
  'a-top': '#2f76a0', 'a-sky': '#8fb6ce', 'a-warm': '#ecd6b8', 'a-halo': '#f4ece0', 'a-panel': '#f7f0e3',
  'a-seam': '#b7cedd', 'a-pool': '#d9c3a3', 'a-n1': '#7fa9c4', 'a-n2': '#e7c9a0',
};

const perLight: Palette = {
  bg: '#e4e2b4', 'bg-2': '#d3dba0', ink: '#19260f', 'ink-2': '#3c4a22', accent: '#365f0b', ember: '#8f3e17',
  lamp: '#fff4d6', leak: 'rgba(255, 214, 140, .4)', 'leak-pos': '92% -10%', grade: 'rgba(0, 0, 0, 0)',
  line: 'rgba(25, 38, 15, .2)', 'sel-bg': '#19260f', 'sel-ink': '#e4e2b4',
  'a-top': '#c3d6e8', 'a-sky': '#dde8ea', 'a-warm': '#d9d49a', 'a-halo': '#f3f1dc', 'a-panel': '#efedcf',
  'a-seam': '#dfe4dc', 'a-pool': '#c9cf92',
};

const proDark: Palette = {
  bg: '#08111c', 'bg-2': '#0e1a28', ink: '#e3eaf0', 'ink-2': '#9fb0c0', accent: '#8fc0ea', ember: '#eea66e',
  lamp: '#f2c48c', leak: 'rgba(238, 166, 110, .20)', grade: 'rgba(8, 17, 28, .44)', line: 'rgba(227, 234, 240, .14)',
  'sel-bg': '#8fc0ea', 'sel-ink': '#08111c',
};

const perDark: Palette = {
  bg: '#0c180c', 'bg-2': '#122412', ink: '#e8eedb', 'ink-2': '#a5b39a', accent: '#acd37f', ember: '#e2c06c',
  lamp: '#e3b85c', leak: 'rgba(226, 178, 84, .22)', grade: 'rgba(12, 24, 12, .52)', line: 'rgba(232, 238, 219, .14)',
  'sel-bg': '#acd37f', 'sel-ink': '#0c180c',
};

export const palettes = { proLight, perLight, proDark, perDark };

const block = (selector: string, p: Palette, scheme?: 'light' | 'dark') =>
  `${selector} {\n${scheme ? `  color-scheme: ${scheme};\n` : ''}${Object.entries(p)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n')}\n}`;

export function paletteCss(): string {
  const night = (root: string) => [block(root, proDark, 'dark'), block(`${root}[data-culture="personal"]`, perDark)].join('\n');
  return [
    block(':root', proLight, 'light'),
    block(':root[data-culture="personal"]', perLight),
    `@media (prefers-color-scheme: dark) {\n${night(':root:not([data-scheme="light"])')}\n}`,
    night(':root[data-scheme="dark"]'),
  ].join('\n');
}
