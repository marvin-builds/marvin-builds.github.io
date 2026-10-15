# Design spec: personal site of Marvin Mai (round 2, final)

This is the authoritative design spec for the Astro implementation. The working
reference is `docs/design/mock.html`; open it over `file://` in Chromium. It loads
the photographs from `docs/design/photos/`. Screenshots of every state are in
`docs/design/round-2/final-shots/`. Where this spec and the mock disagree, this
spec wins.

Round 1 (this file and the mock in git history, commit `f2b01da`) stays the
reference for behaviour that is not restated here. Its look is retired.

Base: the round-2 proposal **image-atmosphere**
(`docs/design/round-2/proposals/image-atmosphere/`), with the owner's grafts and
fixes. See §19 for every decision and where it came from.

---

## 1. Concept

**A programmer's page that happens to stand inside his own photograph.**

- The type leads: a very large name, directly under it a role line in the
  display family ("Software engineer · Kotlin, Java, Spring"), a one-sentence
  lede, the current role, then experience. A recruiter reads who, what level, which stack and the
  proof in the first viewport.
- Atmosphere comes from one of Marvin's own landscape photographs per culture,
  split into **three slots read from sky to ground**, each showing its own part
  of the picture: a full-bleed plane of sky and horizon behind the whole hero
  (A), a wide detail between Experience and How I work (B), and the ground under
  Contact and the footer (C). All three use the same language: full width,
  vertical fades only, the photograph dissolving into the page colour, so it
  never reads as a box or a pane.
- Professional is a **dusk footbridge** (symmetrical, a lone cyclist on the
  axis). Personal is a **sunlit upland meadow** (old gnarled trees, spruce,
  windswept grass).
- **One hero structure for both cultures.** Professional and personal
  use the same grid and the same horizon line (one shared constant), the same
  placement of name, role, lede, side column, portrait and credit. Only palette, type register, tone of the copy, portrait and photograph
  change.
- **The unanswered page is a neutral first screen**: only the name, the role
  line and the hero question, in the formal register on the plain page colour.
  No header, photograph, portrait, lede or sections. Hovering an answer tints
  the cursor lamp with the culture it leads to. Answering reveals the whole page
  in that culture through a feathered diagonal wipe (§ The hero question).
- **Signature interaction: light.** The cursor is a soft lamp over the whole
  page, one layer with one strength everywhere; it fades out where it was when
  the pointer rests or leaves. Nothing competes with it.

The portraits are shown once each, modestly, as a plain print in the hero's
text grid (right column, level with the lede), on the photograph's faded tail,
never on its subject. They are never a backdrop, texture, wash or repeated decoration and
carry no caption.

---

## 2. Colour tokens (ready to paste)

All tokens are sampled from the photographs, then adjusted for AA. One accent per
culture. `--ember` (the bridge's burnt-sand horizon, the meadow's terracotta) is
the second, warm voice: in the light scheme it colours the year numerals, the
skill counts and a station's marker; the dark scheme keeps it in reserve.

```css
@property --p { syntax: '<percentage>'; inherits: false; initial-value: 0%; }

:root {
  /* professional, light. Also the unanswered ("neutral") state. */
  color-scheme: light;
  --bg:     #f1e6d2;   /* the pale warm sky the cyclist rides towards (photo ≈ #f4ece0), a touch deeper */
  --bg-2:   #e8d6ba;   /* the same light nearer the horizon, turning to peach: How I work, Contact */
  --ink:    #0a1f33;   /* navy from the sky's shadows */
  --ink-2:  #2d4558;
  --accent: #0a4f86;   /* the photo's cerulean, deepened for text */
  --ember:  #8a3d12;   /* the thin horizon, burnt sand: year numerals */
  --lamp:   #fff1dc;   /* globe street lamp = cursor light */
  --leak:   rgba(255, 190, 130, .5);  --leak-pos: 50% 52%;   /* warm glow at the vanishing point, full strength */
  --grade:  rgba(0, 0, 0, 0);          /* the photograph is not toned at all */
  --line:   rgba(10, 31, 51, .18);
  --sel-bg: #0a1f33; --sel-ink: #f3d9b4;
  /* light-only page colours, used by the light-scheme rules below */
  --a-top: #2f76a0;  --a-sky: #8fb6ce;  --a-warm: #ecd6b8;   /* hero ground: header sky → upper sky → warm horizon → --bg */
  --a-halo: #f4ece0; /* the text bars */   --a-panel: #f7f0e3; /* skill aside */
  --a-seam: #b7cedd; /* clearing photo's top rows */   --a-pool: #d9c3a3; /* ground under slot C */
  --a-n1: #7fa9c4;  --a-n2: #e7c9a0;   /* unanswered page: dusk sky over a thin warm horizon */
  /* type register: narrow, tall, dense */
  --d-wdth: 75%;  --d-wght: 620; --d-track: -.028em; --d-size: clamp(4.4rem, min(12.6vw, 20svh), 12.5rem);
  --h-wdth: 78%;  --h-wght: 560; --h-size: clamp(2.5rem, 6vw, 5.75rem);
  --t-wdth: 96%;  --t-wght: 430;  --c-wdth: 112%;
  /* stage constants shared by both cultures (§6) */
  --dP: clamp(4.4rem, min(12.6vw, 20svh), 12.5rem);
  --r-size: clamp(1.125rem, .7rem + 1.9vw, 2.5rem);
}
:root[data-culture="personal"] {
  /* personal, light: the meadow at midday, sunlit straw leaning to the meadow's green-gold */
  --bg:     #e4e2b4;   /* sunlit straw */
  --bg-2:   #d3dba0;   /* straw going green */
  --ink:    #19260f;   /* spruce */
  --ink-2:  #3c4a22;
  --accent: #365f0b;   /* fresh grass in shade */
  --ember:  #8f3e17;   /* terracotta */
  --lamp:   #fff4d6;   /* sun */
  --leak:   rgba(255, 214, 140, .4);  --leak-pos: 92% -10%;  /* sun from the top right */
  --grade:  rgba(0, 0, 0, 0);
  --line:   rgba(25, 38, 15, .2);
  --sel-bg: #19260f; --sel-ink: #e4e2b4;
  --a-top: #c3d6e8;  --a-sky: #dde8ea;  --a-warm: #d9d49a;
  --a-halo: #f3f1dc;  --a-panel: #efedcf;  --a-seam: #dfe4dc;  --a-pool: #c9cf92;
  /* type register: wide, light, open */
  --d-wdth: 125%; --d-wght: 330; --d-track: -.022em; --d-size: clamp(3.6rem, min(10.6vw, 16.8svh), 10.5rem);
  --h-wdth: 122%; --h-wght: 360; --h-size: clamp(2.2rem, 5vw, 4.75rem);
  --t-wdth: 106%; --t-wght: 400;  --c-wdth: 125%;
}

/* professional, dark: the same bridge later in the evening */
--bg: #08111c; --bg-2: #0e1a28; --ink: #e3eaf0; --ink-2: #9fb0c0;
--accent: #8fc0ea; --ember: #eea66e; --lamp: #f2c48c;
--leak: rgba(238, 166, 110, .20); --grade: rgba(8, 17, 28, .44);
--line: rgba(227, 234, 240, .14); --sel-bg: #8fc0ea; --sel-ink: #08111c;

/* personal, dark: the meadow at dusk, a deep pure green (hue 120, L 7.2 %): the earlier spruce-black #0a130d
   made a touch warmer and lighter (owner's pick among four variants, 2026-10-13; a lifted olive was too light) */
--bg: #0c180c; --bg-2: #122412; --ink: #e8eedb; --ink-2: #a5b39a;
--accent: #acd37f; --ember: #e2c06c; --lamp: #e3b85c;
--leak: rgba(226, 178, 84, .22); --grade: rgba(12, 24, 12, .52);
--line: rgba(232, 238, 219, .14); --sel-bg: #acd37f; --sel-ink: #0c180c;
```

- The dark blocks apply under `@media (prefers-color-scheme: dark)` on
  `:root:not([data-scheme="light"])` (plus `[data-culture="personal"]` for the
  personal one). The same blocks also apply under `:root[data-scheme="dark"]`,
  set by the header's day/night switch (§5) and in the mock by the debug
  override; production needs both, the media query and the override. Generate all four blocks from one token object in
  `src/styles/tokens.ts` so they cannot drift.
- The mock also defines `--p-*` tokens per palette for the procedural fallback
  plane (§7).
- The boot script sets `html.dark` from the effective scheme before first
  paint (and JS keeps it in sync). It is used for the rules that cannot be
  expressed through tokens: light-field blend and strength, the credit's ink
  over the darkened sky, and the light-scheme rules below, which are all
  scoped `html:not(.dark)`.

### Light scheme: "daylight, photo-led" (owner's pick, 2026-10-14)

Chosen from five light directions (variant A; the mock's section 11 is the
reference). The photograph carries the hero at full strength and the page
continues its light:

- **Formal:** the deep blue sky behind the header (pale header words over a
  soft navy wash until scrolled: `rgba(8,45,80)` at .46 → .36 @50% → .17 @72%
  → .05 @88% → 0; tablets in portrait .54 → .43 → .20 → .06, because the
  square file puts brighter sky under the controls), then from the fade under the hero the pale
  warm light the cyclist rides towards (`--bg`), peach (`--bg-2`) for How I
  work and Contact. **Casual:** the bright sky, then sunlit straw.
- **Hero mask:** the plane is whole from the header (`--m-hdr: 1`) and fades
  slowly under the horizon (`--m-b1..4`: .94/.74/.36/.10; phones
  .92/.62/.26/.06). No haze band; full-strength leak in formal (.6 casual); a
  soft-light lift behind the formal name and a multiply polariser on the casual
  upper sky. Formal also keeps a thin pool of `--a-halo` behind the name only
  (the night pool's geometry, centred at stage × .42, 62% → 50% at 45% → 0),
  because a lamp globe or the railing passes beneath the name at some widths
  (tablets, 1024 × 768, 2560 px); with it the name stays ≥ 4.2:1.
- **Text over the photograph sits on bars**, like a selection: the role line,
  lede, now-line and the two hero links each get `--a-halo` at 86% behind every
  line (`box-decoration-break: clone`, padding .1em .32em, pulled left by .32em
  so the text stays on the grid). No text-shadow glow. The owner chose
  bars over the halo (2026-10-14: the glow made the text harder to read).
- **The page below:** year numerals, skill counts and station markers in
  `--ember`; a lit position's years in `--accent`; the skill aside on an
  `--a-panel` pane (≥ 768px). Beside the stations (≥ 1100px) it is painted
  with a 22px spread shadow; stacked above them (768–1099px) it takes real
  padding (22px inline, pulled back onto the grid by a negative margin) and
  margins (12px above, 28px below), so it never touches the headline or the
  first station on short landscape screens; the clearing (slot B) rises from `--bg` through
  `--a-seam`; slot C rises out of `--a-pool`.
- **The hero photograph stops 8px above its masked edge** (`.band .img {
  bottom: 8px; overflow: clip }`): mask and photograph are separate compositor
  layers (parallax), and during Android's overscroll stretch they round
  differently, so a photo row poked out below the mask as a bright hairline
  across the hero (owner, Galaxy Tab S7+, 2026-10-15; ending the mask 4px
  early did not help).
- **Photo fades, kept short** (owner, 2026-10-15: the long fades veiled the
  middle and bottom photographs; applied to day first, then to night). Slots B
  and C use the same masks in both tones and both schemes. Slot B: mask
  `0 → .06 @3% → .2 @7% → .45 @12% → .75 @17% → .94 @21% → 1 @25%`, full to
  90%, then `→ 0` (still eased, so the first rows draw no line). Slot C: mask
  `0 → .3 @8% → .7 @18% → 1 @28%`; in daylight it rises over `--a-pool`, which
  is reached at 28%. The footer veil is `--bg` at 76% from mid height and 86%
  at the bottom (was 88% / 95%); the colophon keeps about its old contrast in
  daylight and stays above 4.6:1 at night.

### Contrast (WCAG 2.x, computed from the tokens)

| pair | pro-light | pro-dark | per-light | per-dark |
|---|---|---|---|---|
| ink / bg | 13.52 | 15.62 | 11.95 | 15.90 |
| ink / bg-2 | 11.74 | 14.45 | 10.87 | 14.65 |
| ink-2 / bg | 8.08 | 8.53 | 7.22 | 8.56 |
| ink-2 / bg-2 | 7.02 | 7.89 | 6.57 | 7.88 |
| accent / bg | 6.86 | 9.84 | 5.66 | 11.13 |
| accent / bg-2 | 5.96 | 9.10 | 5.15 | 10.26 |
| ember / bg | 6.16 | 9.32 | 5.52 | 10.78 |
| sel-ink / sel-bg (palette row) | 12.25 | 9.84 | 11.95 | 11.13 |
| ink-2 / text bar over black (worst case) | 6.20 | – | 6.09 | – |

**Text over photographs** is guaranteed by layout plus a rendered audit, not by
tokens. The audit (2026-10-15) renders every text on or near a photograph in
all four palettes at 360–2560px, removes the text, and measures the
background behind the glyphs only (3px around each glyph pixel), 2nd
percentile; 4.5:1 for body text, 3:1 for the name. At night the now-line uses
`--ink-2` mixed halfway with `--ink`, since plain `--ink-2` fell to 3.8:1 over
the lit sky behind the cyclist.

1. The hero photograph is a full-bleed plane; the name and role sit in it
   behind a local haze. Under the horizon the plane falls to 74% within 14px,
   45% at 56px and dissolves over the next ~250px (25% / 9% at fade × .4 / .7),
   so the lede, side column and question sit on its tail, never on its full
   strength. These are the dark-scheme values (2026-10-14: lightened from
   .55/.26/.12/.04, which read too dark into Experience).
2. Dark scheme: the haze is a radial pool of `--bg` (88% → 0) behind the name
   and role only (phones: a left-to-right linear haze). Light scheme: no haze;
   the hero text sits on bars of `--a-halo` (above). There is no full-photo wash.
3. The credit sits on the picture in `--ink`, without a halo: its anchors keep
   it on calm sky or meadow, where it reads without one (owner, 2026-10-14).
   Exception, casual daylight: the dark green words blended into the busy
   meadow and were easy to miss (owner, 2026-10-15), so there they sit on a
   bar like the hero text (`--a-halo` at 86%, padding .14em .5em, pulled out
   by .5em so the words keep their anchor). Formal night gets the same bar in
   `--bg` at 72%: the pale words sat on the lit sky between the globes at
   3.1:1. The other two palettes measure ≥ 5.7:1 without one.
4. Slots B and C carry no text except the footer, which has its own `--bg`
   gradient.

**Rendered audit result (polish pass):** neutral, professional and personal ×
light and dark × 1440 and 390, every scroll position (80% viewport steps), the
skill filter on and the palette open: **0 real failures** (three flagged runs
were checked by hand: a palette group header clipped out of the scroll box, and
one years label sampled mid-scroll that measures ≈ 8:1 when settled). See §17.

---

## 3. Typography

**One family: Mona Sans** (GitHub, SIL OFL 1.1), variable axes `wdth 75–125`,
`wght 200–900`; only the upright is loaded.

- **Source:** `github.com/github/mona-sans` (variable TTF/woff2). The mock loads it
  from Google Fonts for convenience only.
- **Production:** self-host one subset variable `woff2` (Latin + German: U+0000–00FF,
  U+2013–2014, U+2018–201E, U+2026, U+2190–2197; about 60–90 KB) through
  `@fontsource-variable/mona-sans` or a local file in `src/assets/fonts`. Preload
  it. `font-display: swap` plus a metric-matched fallback face to keep CLS ≤ 0.1:

  ```css
  @font-face { font-family: 'Mona Sans Fallback'; src: local('Arial');
    size-adjust: 97%; ascent-override: 92%; descent-override: 24%; line-gap-override: 0%; }
  /* tune the four values with fontaine or capsize against the real woff2 */
  body { font-family: 'Mona Sans', 'Mona Sans Fallback', system-ui, sans-serif; }
  ```
- No italic anywhere (the credit is roman now).

The culture switch changes the **register of the same voice** through the axes:

| Role | professional | personal |
|---|---|---|
| Display (name, once) | `wdth 75%`, `wght 620`, tracking −.028em, `clamp(4.4rem, 12.6vw, 12.5rem)`, line-height .84 | `wdth 125%`, `wght 330`, tracking −.022em, `clamp(3.6rem, 10.6vw, 10.5rem)` |
| Section heads | `wdth 78%`, `wght 560`, `clamp(2.5rem, 6vw, 5.75rem)`, line-height .92 | `wdth 122%`, `wght 360`, `clamp(2.2rem, 5vw, 4.75rem)` |
| Text | `wdth 96%`, `wght 430` | `wdth 106%`, `wght 400` |
| Role line (under the name) | heading width/weight, `--r-size` (shared) | heading width/weight, `--r-size` |
| Credit | roman, text width, `.75rem` | same |
| Gate answers (at rest) | "Formally": `wdth 75%`, `wght 660` | "Casually": `wdth 125%`, `wght 380` |

**Scale** (deliberately extreme, little in the middle):

| token | size / line-height | use |
|---|---|---|
| display | see above (≈ 180px at 1440) | the name |
| section | see above (≈ 86px at 1440) | Experience, How I work, Contact |
| role line | `clamp(1.125rem, .7rem + 1.9vw, 2.5rem)` / 1.2 (≈ `--h-size × .45`) | under the name |
| years | `max(1.5rem, --h-size × .55)` / 1, `wght 380`, tabular, `--ink-2` | station years |
| statement | `--h-size × .4` / 1.15, heading width/weight | How I work claims |
| answer | `clamp(1.5rem, 1.1rem + 1vw, 2.125rem)` / 1.1 | Formally / Casually |
| lede | `clamp(1.1875rem, 1rem + .5vw, 1.4375rem)` / 1.42 | hero lede, contact lead |
| role | `clamp(1.25rem, 1.05rem + .6vw, 1.625rem)` / 1.2, `wght 560` | station role |
| contact links | `clamp(1.0625rem, 1rem + .25vw, 1.25rem)`, `wght 540` | e-mail, GitHub |
| body | `clamp(1.0625rem, .98rem + .3vw, 1.1875rem)` / 1.55 | everything else |
| small | 1rem / .9375rem / .875rem / .75rem | now-line, org, tech line, task lines, footer / credit, palette headers |

Rules: sentence case everywhere; `text-wrap: balance` on headings and `pretty` on
paragraphs; years in `tabular-nums lining-nums` of the text face (never mono);
no gradient text, no italic accent words, no eyebrows.

---

## 4. Grid, spacing, breakpoints

- **Gutter:** `clamp(16px, 3.9vw, 60px)` (16 at 360, 30 at 768, 56 at 1440).
- **Column gap:** `clamp(12px, 1.7vw, 28px)`; a 12-column grid in the hero and
  in Experience.
- **Header height:** 64px; `scroll-padding-top: 80px`.
- **Breakpoints:** phone `< 768`, tablet `768–1099`, desktop `≥ 1100`.
- **Spacing:** tight inside groups (4–22px), generous and varied between
  sections (64–200px); no uniform 8px rhythm.
- **Art direction of the professional photograph:** `(min-aspect-ratio: 1/1)` →
  the landscape file `atmosphere-professional-wide.jpg` (1920×1280); otherwise
  (portrait-shaped viewports, i.e. phones and portrait tablets) the square
  `atmosphere-professional.jpg` (2400×2400), **in all three slots**, so A, B
  and C always show the same file at the same scale (§7). The same media query
  switches the shared scale variables and the slot crops.

| | 1440 desktop | 768 tablet | 360–390 phone |
|---|---|---|---|
| Hero | name + role cols 1–9 (stage row); below the horizon: lede cols 1–5, side cols 6–9, portrait cols 10–12 | same columns | name + role; then lede beside a 92px portrait; side column full width |
| Experience | stations cols 1–8, sticky filter panel cols 10–12 aligned with the first station | collapsed "Filter by technology" above the stations | same as tablet; years above the role |
| How I work | two-column grid, hairlines, no numbering (≥ 1100) | one column | one column |
| Header | nav left (brand fades in after the name), tools right, ⌘K label | same | nav hidden; DE, "→ Casual", search glyph |
| Parallax | band + slot B | same | off |

No horizontal overflow at 360 in German in any culture (tested).

---

## 5. Header

- Fixed, 64px, **no bar and no border**. Legibility comes from a local gradient
  scrim of `--bg` (80% → 0, extending 36px below). Once the hero name has
  scrolled under the header (`.name` bottom < 72px → `html.scrolled`), a denser
  scrim fades in (320ms): solid `--bg` over the full 64px, so nothing scrolling
  beneath (text, the skill pane) ghosts through behind the controls, then 78%
  at +12px, 35% at +28px and gone at +44px.
- **Brand only after the name has gone.** "Marvin Mai" (`wght 620`, width 100%
  in both cultures, never condensed) is absolutely placed at the gutter and
  fades in with `html.scrolled`; the nav leads at the gutter and slides right by
  the measured brand width (`--bw`, 320ms) when the brand appears. There is
  never a tiny second copy of the giant name on screen.
- Nav: Experience (both tones; DE "Erfahrung"), How I work, [Projects if any], Contact.
- Right: `DE EN` toggle, the culture control (only once answered) and the
  palette button, labelled with its shortcut: `⌘K` on Apple platforms,
  `Ctrl K` / `Strg K` elsewhere (`--ink-2`, `--ink` on hover; accessible name
  "Open search and commands (Ctrl or Cmd + K)"). On coarse pointers and phones
  the label is a 18px magnifier glyph instead.
- **Day / night switch (owner, 2026-10-14; in the mock):** between the culture
  control and the palette button, shown in every state (also unanswered). Built
  like the culture control: a `role="group"` labelled "Colour scheme" /
  "Farbschema" with two `aria-pressed` buttons "Day ☀ | Night ☾" / "Tag ☀ |
  Nacht ☾". Each word is followed by its sign, an inline SVG of 14px
  (sun: circle and eight rays; moon: crescent), stroke 1.4px `currentColor`,
  `aria-hidden`; the underline runs under the word only. Until it is used the
  page follows the system and the switch marks the scheme in effect; a click
  stores `mm-scheme` and sets `html[data-scheme]` (the boot script restores it
  and sets `html.dark` before first paint, so no flash). The palette gets an
  "Appearance / Darstellung" group: "Day (light)", "Night (dark)" and "Follow
  system setting", the last one clears the choice. A change cross-fades the
  root with a View Transition (300ms; instant under reduced motion).
- Every control is text (the day/night signs only accompany their words). Active state: underline 1.5px, offset .4em. Targets
  ≥ 24px tall (the palette button 44px).
- **Culture control:** `role="group"` labelled "Tone of introduction" / "Ton der
  Vorstellung"; two `aria-pressed` buttons "Formal | Casual" / "Förmlich |
  Locker". Clicking the inactive one runs the wipe (§9).
- **Phone (< 768): one switch per concern.** Each toggle hides its pressed
  button, so the header reads `DE   → Casual   Night ☾   [search glyph]`:
  language shows only the language you can switch to, culture shows "→ Casual"
  / "→ Formal", the scheme the one you can switch to ("Night ☾" / "Day ☀"),
  18px gaps; fits at 360px. No more five-control toolbar.

---

## 6. Hero (slot A)

The hero is the same composition in all three states: grafted from
light-and-depth's opening view (name in the sky, the question on the ground),
with image-atmosphere's photographs. Programmer first: the name is followed by
a **role line in the display family**, and the photograph is a full-bleed
plane behind the whole hero (owner, round 3: the earlier thin band with faded
outer thirds did not fit the A/B/C split), treated like B and C: full width,
vertical fades only.

### Geometry (CSS variables on `.hero`)

```css
:root {
  /* shared by both cultures, so nothing but the name moves in the wipe */
  --dP: clamp(4.4rem, min(12.6vw, 20svh), 12.5rem);      /* the formal name size reserves the stage */
  --r-size: clamp(1.125rem, .7rem + 1.9vw, 2.5rem);       /* role line, about --h-size × .45 */
}
.hero {
  --top: clamp(84px, 11svh, 116px);
  --stage: calc(var(--dP) * 1.68 + var(--r-size) * 1.2 + 14px);   /* name (2 lines) + role */
  --hz: calc(var(--top) + var(--stage) + 24px);                    /* the horizon line */
  --fade: clamp(200px, 32svh, 320px);                              /* the plane's dissolve below the horizon */
  /* slot-A crop at the shared photo scale --ps (§7): source row --rh on the horizon, column --cx on the page centre */
  --rh: 470; --cx: 932;                                            /* professional, wide file: the cyclist on the centre */
  --ix: clamp(calc(100% - var(--psw) * var(--ps)), calc(50% - var(--cx) * var(--ps)), 0px);   /* image left edge */
  grid-template-rows: var(--stage) auto; row-gap: 72px;            /* row 2 starts at hz + 48px */
}
html[data-culture="personal"] .hero { --rh: 640; --cx: 1200; --kx: 1210; --ky: 540; --kxa: 1998; --kya: 630; }
@media (max-aspect-ratio: 1/1) { html:not([data-culture="personal"]) .hero { --rh: 880; --cx: 1185; --kx: 1502; --ky: 682; --kxa: 1185; --kya: 790; } }
@media (max-width: 767px) {
  .hero { --top: 84px; --stage: calc(var(--dP) * 1.68 + var(--r-size) * 2.4 + 12px); row-gap: 64px; }
  html[data-culture="personal"] .hero { --cx: 1850; }
}
@media (max-width: 767px) and (max-aspect-ratio: 1/1) { html:not([data-culture="personal"]) .hero { --rh: 820; } }
.band .crop { width: calc(var(--psw) * var(--ps)); height: calc(var(--psh) * var(--ps)); left: var(--ix); top: calc(var(--hz) - var(--rh) * var(--ps)); }
```

- `--hz` no longer depends on the culture's `--d-size` (it used to move about
  50px between cultures). The stage is reserved by the formal size; the name and
  role are **bottom-aligned** in it, so in the wipe only the name's size and
  register change; horizon, photograph, role, lede, question and portrait stay
  put. Both display sizes are also capped by height (`20svh` / `16.8svh`).
- **Fold:** the answers end at 627px on 1280×720 (limit `100svh − 48px` = 672),
  648 on 1366×768, 698 on 1536×864, 620 on 1024×768, 630 on 390×844.

### Layers, back to front

1. **Band** (`.band`, `aria-hidden`): absolute, full width, height
   `hz + fade`; the plane (photo, `--grade`, `--leak`) and the haze.
   - **Full bleed, vertical fades only** (the language of B and C; no side
     fades): mask `transparent 0 → .22 at the header line (64px) → .7 at
     top + stage × .2 → opaque from top + stage × .45 until hz − 20px → .74 at
     hz + 14px → .45 at hz + 56px → .25 at hz + fade × .4 → .09 at hz + fade × .7 →
     transparent at the bottom`. The sky rises out of the page under the header;
     under the horizon the picture lets go quickly, then dissolves softly.
   - **Crop**: the photograph is drawn at the **shared photo scale `--ps`**
     (§7), the same as slots B and C, so the three slots are windows onto one
     continuous picture. Source row `--rh` (the photograph's horizon) sits on
     `--hz`; source column `--cx` sits on the page centre (clamped so the image
     always covers both side edges). Narrowing the window crops equally from
     both sides; the scale never depends on the width (it follows the viewport
     height, like B and C).
   - **Professional**: sky, both lamp globes and the cyclist's head and
     shoulders at the horizon, the rest of him cut by the fade. **The cyclist
     (the bridge's symmetry axis) is on the page centre at every width**
     (owner): `--cx` 932 of the wide file, 1185 of the square (object-position
     ≈ 48.5% / 49.4%, because he stands slightly left of the files' centres);
     measured offset 0.0px at 1920, 1440, 1100, 768 and 390. Wide `--rh 470`;
     square `--rh 880` (tablets) / `820` (phones, where the shared scale makes
     him large, so only head and shoulders rise above the horizon; the big
     globes fall outside the phone's 555 source columns).
   - **Personal**: a bright soft sky, the treeline with the crowns at the role
     line and the distant hill low in the frame, the trunks and meadow fading
     under the text; `--rh 640`, `--cx 1200` (phones `1850`: the forest edge
     and hill). B and C then continue the same picture downwards: trees and
     mid-meadow, then grass.
   - Haze, **behind the name and role only**: `radial-gradient(min(64vw,1040px)
     (stage × .78) at (gutter + min(20vw,330px)) (top + stage × .62) in oklab,
     bg 88% 0, bg 80% 40%, bg 42% 72%, transparent)`; phones a left-to-right
     linear haze (88% → 74% → 0).
   - Under the band the hero's own background runs `bg → bg-2 (at hz + 10px) →
     bg (hz + 260px)`.
   - Intro: the plane settles `scale 1.06 → 1`. The plane has no CSS
     `translate` (the image is placed with `left`/`width`), so the end state
     cannot be shifted by GSAP's transform bookkeeping: verified full-bleed
     mid-intro, settled, after pointer movement and after scroll at 390, 1440
     and 1920, with overlay and with classic 15px scrollbars.
2. **Identity** (`.ident`, cols 1–9, row 1, `align-self: end`):
   - **Name** (`h1`): two lines, "Mai" indented `.52em` on ≥ 768.
   - **Role line** (`p.role`), the culture's heading width and weight at
     `--r-size`: "Software engineer · Kotlin, Java, Spring" (DE
     "Softwareentwickler · Kotlin, Java, Spring"); the stack in `--ink-2` on ≥ 768. Phones: two
     lines, stack in `--ink` (contrast over the photograph).
3. ~~Credit~~: moved to slot B (§8).
4. Row 2, **below the horizon** (`hz + 48px`), on the plane's faint tail:
   - **Lede** (cols 1–5, lede size, max 34ch): one plain sentence, no bold.
   - **Side column** (cols 6–9): the now-line (`1rem`, `--ink-2`, no bold), then
     the question until answered; afterwards an **onward row** in the same
     place (§ below).
   - **Portrait** (cols 10–12, `justify-self: end`, top-aligned with the lede):
     `width: clamp(104px, min(15vw, 26svh), 232px)` (92px on phones), 4:5, no
     border, shadow, sheen or contact shadow; a plain print on the page. Crops:
     professional `50% 24%`, personal `48% 34%`. Unanswered: `grayscale(1)
     contrast(.96)`.
   - Tablet (768–1099): the same columns; the lede drops to 1.125rem.
   - Phone: grid `[1fr | 92px]`: lede + portrait side by side, side column full
     width below.

### Copy (EN; DE in the mock)

| | professional | personal |
|---|---|---|
| Role line | Software engineer · Kotlin, Java, Spring (DE Softwareentwickler · Kotlin, Java, Spring) | same |
| Lede | I build backend systems where many interfaces meet: test-first, with an eye for detail and code that stays easy to read. | I like the parts where systems meet, and I care about the small things: code should still be easy to read in two years. |
| Now-line | Now software engineer at Element Logic, before that at Dürr Systems, where I also did my dual studies. Looking for a senior engineer role. | Right now at Element Logic, before that at Dürr Systems, where I also did my dual studies. Next up for me: a senior engineer role. |
| Onward row (answered) | Get in touch · github.com/marvin-builds ↗ | Say hi · github.com/marvin-builds ↗ |

The unanswered state uses the professional copy. Logistics and manufacturing
appear only in the experience rows.

**One tone for Experience and How I work (owner, 2026-10-14):** both sections,
including their headings, the nav label and the skill-map lead, use the formal
copy in both cultures; only the hero, contact and the footer change tone (the
photo credit is the same in both). A casual How I work read as too much. German copy in these sections
avoids both "Sie" and "du".

**Copy rules (owner, 2026-10-14):** the site is **not AI-focused**. Marvin
learned software engineering before AI tools; that is a selling point, but it
is never stated, it shows through the emphasis on craft. His strengths to
carry: **an eye for detail** and **clean, easy-to-read code** (plus test-first
and reviews). AI appears only as a disciplined tool: one How I work item
(AI-assisted development held to the same standards) and the skill
"AI-assisted development" (DE "KI-gestützte Entwicklung") at Element Logic,
never a product name such as Claude Code (he uses several tools). Never claim
he set up or led how his team works with AI, and no AI section, workspace,
agent or migration-guide items. The platform gateway: **shared
responsibility for its engineering and API** (DE "mitverantwortlich"),
not "together with a colleague"; never "lead developer" or "led". **No tech lead**: he does not
want that responsibility, so the site names senior engineer roles only. **Stations describe areas of work and
his role in them**, not single tasks, ticket-like items or version numbers:
the reader should get the topics he worked on and what part he played. **Job
titles:** both positions carry one functional title, "Software Engineer" (DE
"Softwareentwickler"); the contract title follows small (`.875rem`, `--ink-2`)
under the employer line, "Official title: …" / "Offizielle Bezeichnung: …",
only where it differs (Dürr Systems: Development Engineer MES & IIoT), so the
site matches references and certificates. Element Logic's reference already
calls him "Software Engineer", so that station has no extra line (owner,
2026-10-14). **No "bold claim + grey sentence" in the
hero, the stations or anywhere else except How I work** (§12).

### The hero question (gate)

- Under the now-line: "How should I introduce myself?" / "Wie soll ich mich
  vorstellen?" (`1.0625rem`, `--ink-2`), then **Formally** or **Casually**
  (DE **Förmlich** oder **Locker**), `clamp(1.5rem, 1.1rem + 1vw, 2.125rem)`.
- `div role="group" aria-labelledby` the question; each answer a `<button>`;
  "or" plain `--ink-2`, `aria-hidden`. Each answer is set **at rest** in the
  register it leads to. Underline 1.5px, 3px on hover/focus. Magnetic pull ≤ 6px
  (fine pointer, motion allowed).
- **Neutral first screen** (JS only: the boot script sets `html.js`; without JS
  the full page shows in the professional default, for crawlers and no-JS
  visitors). While `html.js[data-answered="false"]`: the nav, the search
  button, the header's backdrop band, slot A, lede, now-line, portrait
  and every section after the hero are `display: none`. The **DE/EN switch
  stays** in the header. Name and role line keep **exactly** their answered
  position (same padding, stage and horizon; verified identical before and
  after answering at 360–1920 px, EN and DE). The hero is at least `100svh`.
- **The question is centred** in the first screen, horizontally and
  vertically (`.side` absolutely positioned with `grid-area: auto`, so it
  resolves against the hero, not its grid cell; `left: 50%; top: 50svh;
  translate: -50% -50%`; text and answers centred). `placeGate()` (on start,
  resize, language change, reset) checks whether it would come within 24px of
  the name or role line glyphs; if so (`html.gate-low`, e.g. 1024–1440 px wide,
  where the role line reaches past the centre) it sits centred horizontally
  just below the horizon (`top: --hz + clamp(24px, 6svh, 64px)`).
- **Lamp tint on hover**: pointer-entering an answer (mouse only) sets
  `html[data-hover="professional|personal"]`; the lamp's colour `--glow`
  (a registered `<color>`, transition 600ms) eases to a light tint of that
  culture (light: `#86b8ec` / `#cdd98a`, laid on with `mix-blend-mode: normal`
  at opacity .42, since soft-light barely shifts the pale page; dark: `#8fc0ea`
  / `#acd37f`, screen at .32). Leaving the answer, or answering, clears it and
  the lamp eases back to the current culture's `--lamp`. The magnetic pull
  stays.

**Answering** (`themeTo(c, fromGate = true)`): decode the target slot-A image
(max 400ms), then the wipe (§9). Only **the chosen word** travels: it carries
`view-transition-name: pick` in the old state, its header twin carries it in the
new state; the images keep their natural size (no bitmap scaling), the big word
fades out in 260ms while moving, the small one fades in on arrival (300ms after
460ms). The rest of the question (`gate-rest`) fades out in place in 200ms.
Focus moves to the pressed header option. On phones, where the pressed header
option is hidden, the word simply fades.

**Answered state:** the question's place becomes the **onward row**
(`.next`, .9375rem): "Get in touch" (underlined, to `#contact`) and
"github.com/marvin-builds ↗" in `--ink-2`. The hero's bottom padding drops to
`clamp(28px, 4.5svh, 48px)` and Experience's top padding to `clamp(24px, 3svh,
40px)`, so there is no dead quadrant before Experience.

---

## 7. Atmosphere slots (owner photography)

Each slot shows **its own part** of the photograph; read down the page it is one
story from sky to ground. Professional: **A** sky, lamps and the cyclist's head
and shoulders → **B** the cyclist himself on the crest → **C** his reflection.
Personal: **A** sky over the treeline → **B** the gnarled trees and mid-meadow
→ **C** the grass. The professional file is the wide one on wide viewports and
the square one on portrait-shaped ones, **in all three slots**.

**One scale for all three slots** (owner, round 3): A, B and C draw the
photograph at the same size, so they read as three windows onto one continuous
photograph, not three differently zoomed crops. The reference is slot C's
scaling (the owner's favourite): its plane, `--gh = clamp(320px, 56svh, 640px)`
high, shows the lowest 28% (professional) / 34% (personal) of the file.

```css
:root { --gh: clamp(320px, 56svh, 640px); --psw: 1920; --psh: 1280; --pk: .28;
  --ps: max(calc(var(--gh) / var(--pk) / var(--psh)), calc(100vw / var(--psw))); }   /* cover floor: never narrower than the page */
@media (max-aspect-ratio: 1/1) { :root { --psw: 2400; --psh: 2400; } }
:root[data-culture="personal"] { --psw: 2400; --psh: 1600; --pk: .34; }
.plane .crop { position: absolute; max-width: none; width: calc(var(--psw) * var(--ps)); height: calc(var(--psh) * var(--ps)); }
```

Each slot then only pins one source row to one of its edges and one column to
the page centre. Measured rendered image size, identical in A, B and C:

| viewport | professional | personal |
|---|---|---|
| 1920×1080 | 3240×2160 (wide) | 2668×1779 |
| 1920×900, 1440×900, 1100×900 | 2700×1800 (wide) | 2224×1482 |
| 768×900 | 1800×1800 (square) | 2224×1482 |
| 390×844 | 1688×1688 (square) | 2085×1390 |

| Slot | Where | Professional (dusk footbridge) | Personal (upland meadow) |
|---|---|---|---|
| **A** | full-bleed plane behind the hero (§6); row `--rh` on the horizon, cyclist / column 1200 on the centre | **sky, both lamp globes and the cyclist's head and shoulders**, the rest of him cut by the fade | **bright sky, the treeline low in the frame**, the distant hill |
| **B** | clearing between Experience and How I work, no text; `clamp(320px, 56svh, 600px)` in both cultures (professional was 40svh: at the shared scale that showed only 256 rows, too few for the whole cyclist); source row `--rb` on its bottom edge, column `--bx` on the centre | **the cyclist on the crest with the warm glow**, the small lamps and the converging railings, the big globes fading in at the top: `--rb 728`, `--bx 932` (wide) / `1240`, `1185` (square); mask: the short eased fade shared by both tones and schemes (see §2, photo fades), so no edge shows above the globes | **the gnarled trees and the mid-meadow**, the crowns fading at the top: `--rb 1104`, `--bx 1104` |
| **C** | ground under Contact; footer overlays its bottom; `--gh`; the photograph's bottom edge on its bottom, centred (the scale reference) | **the puddle reflection**: the lowest 28% of the wide file (≥ 1:1) or of the square | **the wind-blown grass close-up**: the lowest 34% of the meadow |

**Pinned crops** (`img.crop`, all at `--ps`):

```css
.band .crop     { top: calc(var(--hz) - var(--rh) * var(--ps)); left: clamp(calc(100% - var(--psw) * var(--ps)), calc(50% - var(--cx) * var(--ps)), 0px); }
.clearing .crop { top: calc(100% - var(--rb) * var(--ps));       left: clamp(calc(100% - var(--psw) * var(--ps)), calc(50% - var(--bx) * var(--ps)), 0px); }
.ground .crop   { bottom: 0; left: calc(50% - var(--psw) * var(--ps) / 2); }
.clearing .ph-pro .crop { --rb: 728; --bx: 932; }
@media (max-aspect-ratio: 1/1) { .clearing .ph-pro .crop { --rb: 1240; --bx: 1185; } }
.clearing .ph-per.crop { --rb: 1104; --bx: 1104; }
```

In production, cut these crops at build time instead (§ production images).

**Treatment:** no border, radius or caption; masks dissolve into `--bg`;
`--grade` (professional light **.08**, personal light .10, dark .44 / .56);
`--leak` screen-blended; a fixed static grain (opacity **.07** light, .05 dark).
Unanswered: `grayscale(1) contrast(.96)` and no leak. Parallax: A and B only;
C is anchored to the ground and does not move.

**Procedural plane** (`svg.proc`) for any slot without a photograph, as before
("photos: off" debug button).

**Production images** (`astro:assets`, sources in `src/assets/photos/`):

- Because all three slots share one scale, production can serve **one
  responsive image per culture and breakpoint** (bridge wide 1920×1280 and
  square 2400×2400, meadow 2400×1600) to all three slots, or pre-cut row bands
  at that scale (A: rows above the horizon; B: the cyclist / the trees; C: the
  lowest 28% / 34%),
  C-pro (reflection, 2000×700 from the square), C-per (grass, 2000×700).
- `<Picture>` with AVIF + WebP, `widths=[640, 1024, 1440, 1920, 2400]`,
  `sizes="100vw"`; slot A `fetchpriority="high"`; B and C `loading="lazy"`.
  Art direction for A, B and C via `<source media="(min-aspect-ratio: 1/1)">`.
- The inactive culture's images are `display:none` and lazy; prefetch after
  `load` + idle.

---

## 8. Photo credit (atmosphere photographs only)

The credit lives **in the middle photograph (slot B)**, pinned to one feature
of it with a short hairline, so it unmistakably belongs to the photography and
never to a portrait (owner, 2026-10-14: "the photo credit hint should be in the
second, middle photo section"). The hero carries no credit.

- "Photography: Marvin Mai" / "Fotografie: Marvin Mai" in **both tones**
  (owner, 2026-10-14; the casual "Shot this one myself" is dropped).
- **Anchor** (source px, through slot B's crop maths: `left: var(--bix) +
  kx × ps`, `top: 100% − (rb − ky) × ps`, with `--bix`, `--rb`, `--bx` set on
  `.clearing`, so it stays on its feature at every width). Never mid-scene
  (owner: "shouldn't be in the middle"), always a few px clear of its feature:
  - professional, wide file: right of the **right lamp post**, above the
    railing (1134/469), words running right;
  - professional, square file on tablets: just left of the **right big globe**
    (1558/706), words running left;
  - professional, phones: above the **right small globe** (1384/970), a 130px
    plumb line so the words clear the cyclist's head; the big globes are
    outside the phone crop;
  - professional, phones held sideways (< 768px, landscape): as wide, but on
    two lines ("Photography:" / "Marvin Mai", the name joined by a no-break
    space) after a 14px hairline, so it fits right of the post from 568px;
  - personal, from 940px and wider than 4:3: right of the **lone tree's trunk** on the right
    (1500/880, a few px clear of the bark at 1280–1920; was 1515, about 20px off, which read as detached on a laptop, owner 2026-10-15), words running right over
    the meadow;
  - personal, below 940px or up to 4:3 (the lone tree leaves the crop or sits
    at its right edge; owner found the overflow on a tablet in portrait): above the crown of
    the **small tree left of the gnarled pair** (969/662), a 24px plumb line.
- It sits **outside the plane's fade mask** (a sibling of `.plane` in
  `.clearing`), so it stays fully opaque where the photograph dissolves. `.clearing`
  has `overflow-x: clip`, so a credit can never widen the page (on Firefox for
  Android that zooms the whole page out), and
  drifts with slot B's parallax (`y ±4 %` of the slot height, the same as the
  image), so it never slides off its feature. `.clearing` is no longer
  `aria-hidden`; the plane is.
- **Form:** a 26px hairline runs from the feature, then the words (right or
  left); in the drop form the words sit above the feature (starting or ending
  14px past the line) and a vertical hairline drops onto it. Hairline
  `currentColor` at .7.
- **Type:** roman, `.75rem`, `--ink` (not `--ink-2`: over the mid-tone meadow
  and railings the softer ink read washed out). No halo or text-shadow (owner,
  2026-10-14: not needed for readability at these anchors). No italic.
- Never on the subject's face or a portrait, never between name and photo;
  clear of the name at 360–1920.
- Hidden while unanswered.
- **Colophon echo** in the footer (unchanged): "The landscape photographs are my
  own; the portraits were taken by someone else." No ©, no EXIF, no place names.

---

## 9. Diagonal wipe (culture switch)

```js
function themeTo(c, fromGate) {
  if (c === html.dataset.culture && html.dataset.answered === 'true') return;
  if (!document.startViewTransition) { apply(c); focusCtl(); return; }   // fallback: instant
  const img = c === 'personal' ? $('.hero .ph-per') : $('.hero .ph-pro img');
  Promise.race([img.decode().catch(() => {}), new Promise(r => setTimeout(r, 400))]).then(() => {
    const mode = reducedMotion() ? 'vt-fade' : 'vt-wipe';
    lenis?.stop();
    const morph = fromGate && mode === 'vt-wipe';
    const pick = $(`.pick[data-pick="${c}"]`), twin = $(`#culture-ctl [data-set-culture="${c}"]`);
    html.classList.add(mode); if (morph) { html.classList.add('vt-gate'); pick.style.viewTransitionName = 'pick'; }
    document.startViewTransition(() => {
      apply(c); focusCtl();
      if (morph) { pick.style.viewTransitionName = ''; if (twin.offsetParent) twin.style.viewTransitionName = 'pick'; }
    }).finished.finally(() => { html.classList.remove(mode, 'vt-gate'); twin.style.viewTransitionName = ''; lenis?.start(); ScrollTrigger?.refresh(); });
  });
}
```

```css
@property --p { syntax: '<percentage>'; inherits: false; initial-value: 0%; }
html.vt-wipe::view-transition-old(root) { animation: none; }
html.vt-wipe::view-transition-new(root) {
  animation: mm-wipe 1050ms cubic-bezier(.65, 0, .35, 1) both; mix-blend-mode: normal;
  mask-image: linear-gradient(118deg, #000 calc(var(--p) - 2.5%), transparent var(--p));
}
@keyframes mm-wipe { from { --p: 0%; } to { --p: 103%; } }

/* first answer only: the chosen word travels to its header twin; the rest of the question fades in place */
html.vt-gate .gate { view-transition-name: gate-rest; }          /* JS sets view-transition-name: pick on the chosen .pick (old) and its header twin (new) */
::view-transition-old(gate-rest) { animation: mm-out 200ms cubic-bezier(.2, .7, .2, 1) both; }
::view-transition-group(pick) { animation-duration: 760ms; animation-timing-function: cubic-bezier(.65, 0, .35, 1); }
::view-transition-old(pick), ::view-transition-new(pick) { width: auto; height: auto; }   /* natural size: no bitmap scaling */
::view-transition-old(pick) { animation: mm-out 260ms cubic-bezier(.2, .7, .2, 1) both; }
::view-transition-new(pick) { animation: mm-in 300ms 460ms cubic-bezier(.2, .7, .2, 1) both; }

html.vt-fade::view-transition-old(root) { animation: mm-out 200ms ease both; }
html.vt-fade::view-transition-new(root) { animation: mm-in 200ms ease both; }
@keyframes mm-out { to { opacity: 0; } }
@keyframes mm-in { from { opacity: 0; } }
```

- Left → right; the 118° edge leans like the bridge's railings (top ahead of the
  bottom). It is a mask on `::view-transition-new(root)` (the feathered
  successor of round 1's `clip-path: polygon()`); browsers without `@property`
  support for masks still get the VT crossfade.
- Feather 2.5% (≈ 40px at 1440): reads as light crossing, the double-exposure
  band stays narrow (7% was rejected: overlapping text became legible).
- Scope: classes on `html` only during the transition, so other transitions do
  not inherit it.
- Entry points: hero answers, header culture control, palette commands. The
  language switch is instant.
- **Fallbacks:** no View Transitions API → instant. Reduced motion → 200ms
  crossfade. Lenis is paused during the transition so the snapshot cannot jump.
- From unanswered, the wipe literally colours the black-and-white scene
  (`final-shots/wipe-mid-unanswered-to-*.png`).

---

## 10. Depth and light

**Planes** (≥ 768 only, ScrollTrigger `scrub: true`, transforms only): the band
image drifts `y: 0 → +8vh` over the hero scroll; slot B `yPercent −4 → +4`
across its section, its credit with it (`y ±4 %` of the slot height). The portrait and slot C do
not move (the portrait is in the text grid; C is anchored to the ground).

**Light field** (`.light`, fixed, `z-index: 50`: above all content and the
header, below the grain and the debug bar): two radial gradients of `--lamp`
interpolated **in oklab with 5–6 eased stops** (inner 40% → 30 → 19 → 10 → 4 →
0; outer 14 → 8 → 3 → 0), which removes the banding rings; `soft-light` .85 in
light, `screen` .18 in dark, .3 while unanswered (`--lamp-o`); grain .07 in light
breaks any residual steps.

- **One layer, one strength everywhere** (owner, round 3: the lamp used to jump
  in strength between the experience list and the technology filter, because a
  second spotlight layer, `.stations::before`, sat behind the stations and the
  light layer itself sat under `main`). The station spotlight is removed; the
  light layer sits above the content, so its blend is the same over every
  section, photograph and element. Measured at identical offsets from the
  pointer over plain background: stations vs technologies ratio **1.000** in
  light and dark (was 0.70–0.84).
- **Follows** a fine mouse pointer (one rAF loop, lerp .08, stops when settled).
- **Idle:** after **2.8s** without movement it **fades out where it is**
  (700ms, ease-out); also when the pointer leaves the window or the window
  loses focus. The next movement places it at the pointer while invisible and
  **fades in there** (420ms), with no drift from an old position. No resting
  spot.
- Keyboard: focusing a station (`:focus-visible`) lights it the same way, then
  it idles out.
- **Touch / no fine pointer:** no lamp (never lit). **Reduced motion:** no lamp
  (`display: none`).

**WebGL / OGL: not used.**

---

## 11. Experience: stations and skill map

- **Head:** section heading only ("Experience" / "Where I've worked").
- **Three stations**, separated by a 1px `--line` hairline:
  Element Logic 2024– *today* Software Engineer (R&D, intralogistics);
  Dürr Systems 2018–2021 (last day 30 April 2021; months, where shown: 04/2021)
  Development Engineer MES & IIoT (Manufacturing IT);
  Dürr Systems 2015–2018 Dual student, Mechatronics (Industrial
  communication) with the line **"B.Eng. Mechatronics, DHBW Stuttgart, 2018"**
  under its org line. There is no separate degree row.
- **Row:** `[years | role / org · area (/ degree) | + sign]`, then the gist.
  - **Years** at `max(1.5rem, --h-size × .55)` (≈ 47px formal, 40px casual at
    1440), `wght 380`, the heading width, tabular lining figures, `--ink-2`
    (`--accent` when lit). The open end is "2024–" followed by a small
    "today" / "heute" label (.9375rem, raised .35em), never "–now". The role
    (`wght 560`, 20–26px, `--ink`) is now the strongest element of the row.
  - Column width measured by JS to the widest year + 4px, at every width, and
    stored relative to the numerals (`calc(var(--yf) * ratio)`), so it grows
    with them during a live resize instead of lagging behind the debounce
    (the title briefly overlapped the years otherwise; fixed 2026-10-14).
- **Expand in place** (unchanged mechanics): `<button aria-expanded>` in an `h3`;
  `grid-template-rows 0fr → 1fr`. Body: 3–5 items, each **task on top**
  (`.9375rem`, `--ink-2`) and the **outcome on its own line in `--ink`**,
  regular weight, no bold; then the plain tech line.
- **Technology filter:**
  - **≥ 1100:** a panel in cols 10–12, sticky, its **top aligned with the first
    station's years** (same grid row, same top padding). Heading "Technologies",
    one lead line, then the terms as wrapped text buttons, each with a **resting
    1px `--line` underline** (full colour on hover, 2px `--accent` when pressed)
    and, when used at more than one station, a count in `--ink-2`
    (`Java ×2`, `Oracle ×2`; sorted by count, then name).
  - **< 1100:** the same panel is a `<details>` disclosure **above the stations,
    collapsed**: summary "Filter by technology" / "Nach Technologie filtern"
    with a chevron and the active term appended (": Java"). Stations come first
    in reading order; tooling never precedes roles on a phone. (JS keeps it
    open on wide screens.)
  - Selecting: matching stations get a **2px `--accent` rule on the left** (in
    the gutter, scaling in over 420ms) and accent years; non-matching stations
    fade to **opacity .62** as a whole; the matching term in open tech lines is
    underlined in `--accent`. Readout (`aria-live`): "Java: used at Element
    Logic (2024–today) and Dürr Systems (2018–2021)." + "clear". Esc clears.

---

## 12. How I work

The **only** place that keeps the claim + explanation pattern, and it is set as
a system rather than inline bold: a **two-column grid at ≥ 1100** (one column below; an odd last item spans both columns),
each item with a hairline `--line` on top and **no numbering** (owner, round 3),
the claim at `--h-size × .4` in the
culture's heading width and weight, and the explanation underneath in body
size, `--ink-2`, max 46ch. Section bottom padding 96px. Topics
(an eye for detail, code that is easy to read, test first, reviews, AI tools
held to the same standards), DE/EN in the **formal tone only** (the same in
both cultures, see §6); **no technology or product
names** (copy rules, §6).

## 13. Side projects

Rendered from a content collection. With an empty list the section is `hidden`
and has no nav link and no palette command. Entries use the How-I-work statement
pattern: bold title, one-line outcome, a plain tech line, a repo link (↗).

---

## 14. Contact and footer

- **Heading:** "Contact" / "Say hello" (DE "Kontakt" / "Sag hallo").
- **Lead** (lede size, max 42ch): professional "Open to senior engineer
  roles in backend development. The fastest way to reach me is
  e-mail."; personal "Hiring, or building something with lots of moving
  systems? Write me."
- **Links: modest and in proportion** (owner fix). One row (`ul.reach`, wraps),
  gap 36px, contact-link size (17–20px), `wght 540`, underline 1px offset .3em,
  each with a **44px hit area**:
  - "Show e-mail address" / "Show my e-mail": assembles the address from reversed
    parts on click, never in the HTML, and turns in place into `mailto:` link +
    "copy" button. "copy" reads "copied" for 1.8s (plus an `aria-live` status);
    no toast. **Placeholder `hello@example.com`; the owner supplies the real
    address.**
  - `github.com/marvin-builds ↗`, `rel="me noopener"`, new tab with an sr-only note.
    The underline is on an inner `span.u`; the arrow is a separate
    `inline-block` with `text-decoration: none`, so it never gets its own broken
    underline.
  - No label/value pairs, no display-size lines.
- Section top padding `clamp(32px, 6svh, 72px)` after How I work's 96px bottom
  padding.
- **Ground** (slot C) follows; the **footer** lies over its bottom with a `--bg`
  gradient: one colophon line in the culture's tone ("No cookies. Page views are
  counted anonymously with GoatCounter." + the photo echo, §8) and "Source on
  GitHub ↗".

---

## 15. Command palette

- `<dialog>` opened with `showModal()` by the header's **⌘K / Ctrl K** button, ⌘K or Ctrl+K (toggles).
  `data-lenis-prevent`; Lenis is stopped while it is open.
- An input with `role="combobox"`, `aria-controls`, `aria-expanded`,
  `aria-activedescendant`; a `role="listbox"` of `role="option"` rows.
- Commands (localized): Go to Top / Experience / How I work / Contact
  (+ Projects if any); Introduce yourself formally / casually (runs the wipe);
  Deutsch / English; Copy e-mail address; Open GitHub.
- Substring match on group, localized name and English name. ↑/↓ cycle, ↵ runs,
  Esc or a backdrop click closes; focus returns to the opener.
- Rows are grouped under **section headers** (`.75rem`, uppercase tracking
  .06em, `--ink-2`): Go to, Tone, Language, Contact. Markup: `role="group"`
  items labelled by their header inside the `listbox`.
- Surface: solid `--bg-2`, `0 40px 120px −20px rgba(0,0,0,.35)` plus a 1px
  `--line` ring; backdrop `--bg` at 55%. **Selection: a 2px `--accent` rail on
  the left** (`inset box-shadow`) and a 5% accent tint, no filled bar. No glass.

---

## 16. Motion choreography and reduced motion

| Moment | Motion | Reduced motion |
|---|---|---|
| First paint (after `document.fonts.ready`) | slot-A plane settles `scale 1.06 → 1` (1.6s `expo.out`); the name's two lines rise from a mask (`yPercent 110 → 0`, 1.1s `expo.out`, stagger .08), once | static |
| Scroll | slot-A (with its credit) and slot-B parallax (≥ 768); section heads and statements fade in with native `animation-timeline: view()` (`opacity`, `translate 28px`, range `entry 0% cover 22%`) inside `@supports`; `@media print` disables it | none, content visible |
| Smooth scroll | Lenis `lerp .1`, `anchors: false`, on the GSAP ticker (`lagSmoothing(0)`); anchor clicks call `lenis.scrollTo(target, { offset: −80 })` and move focus to the target | Lenis never created; native scroll |
| Answer / re-switch | feathered wipe 1050ms; the chosen word travels to the header (760ms, crossfaded at natural size), the rest of the question fades in place 200ms | 200ms crossfade |
| No View Transitions | instant | instant |
| Gate | magnetic ≤ 6px | none |
| Station | 480 / 420ms rows, 360ms sign | instant |
| Credit hover | colour `--ink-2 → --ink`, 160ms | instant |
| Light idle / leave | fades out in place after 2.8s still or on leaving the window (700ms ease-out); fades in at the pointer on the next move (420ms) | no lamp |
| Brand | fades in (and the nav slides) when the name scrolls away, 320ms | instant |
| Technology filter | accent rule scales in 420ms; others fade to .62 | instant |
| Routine UI | 160ms `cubic-bezier(.2,.7,.2,1)` | `transition-duration: 0s` on everything |

Nothing loops. No pinning, no scroll-jacking: keyboard, anchors and the palette
work in every mode. A runtime change of the reduced-motion preference reverts the
GSAP context (0 ScrollTriggers left), destroys Lenis and switches the lamp off. A
safety timeout (2.5s) removes the intro class so the name can never stay hidden.

---

## 17. Libraries, performance, accessibility, verification

### Libraries (pinned; npm dependencies in Astro)

| Package | Version | gzipped (measured) | Use |
|---|---|---|---|
| `gsap` | 3.13.0 | 28.1 KB | core, ticker |
| `gsap/ScrollTrigger` | 3.13.0 (same package) | 17.8 KB | scrubbed parallax |
| `lenis` | 1.3.4 | 4.7 KB | smooth scroll |
| own code | | ≈ 7 KB in production (10.1 KB in the mock, which includes the content data and debug code that Astro renders to HTML) | culture, wipe, stations, skill map, palette, light |

`npm i gsap@3.13.0 lenis@1.3.4`. Import in one client module
(`src/scripts/motion.ts`), loaded with `<script>` in the layout so Vite bundles
it; **dynamically import** GSAP, ScrollTrigger and Lenis only when
`prefers-reduced-motion` is not `reduce`, so reduced-motion visitors download
about 10 KB of JS in total. Core interactions (culture, wipe, stations, skill
map, palette, e-mail) live in a separate small module with no dependencies.
Self-host the font (§3). No CDN at runtime.

**Budget:** total page JS ≈ 58 KB gzipped (limit 90). CSS ≈ 9 KB gzipped. LCP
image (slot A) ≤ 260 KB AVIF. CLS ≤ 0.1 (font fallback, explicit
`width`/`height` on every image, portrait and band sized by CSS before load).
60fps: only transforms and opacity animate; one fixed light layer driven by two
CSS variables; no live `filter: blur` or `backdrop-filter`; `will-change` only
on the plane image wrappers; `content-visibility: auto` on sections below the
fold.

### Accessibility rules

- Landmarks: skip link (visible on focus), header, `main#main` (`tabindex=-1`),
  sections labelled by their headings (`tabindex=-1` so anchors can focus them).
- Language: real `lang` on every variant span; `html[lang]` switches. Tone
  variants `.t-pro` / `.t-per` are `display:none` when inactive (out of the
  a11y tree). JS-set strings (aria-labels, alt, palette placeholder) update on
  language change. Production may render `/` and `/de/` separately with Astro
  i18n; tone variants stay in the page.
- Images: atmosphere planes are `aria-hidden` with `alt=""`; portraits get
  localized alt text from the active language; inactive portrait `alt` is moot
  because it is `display:none`.
- Focus: 2px `--accent` outline, offset 4px, everywhere; never removed. After
  answering, focus goes to the pressed header option. Palette returns focus.
- Targets ≥ 24px (header), 44px (contact links).
- Contrast: AA for every text run on its real rendered background, in all four
  palettes and the neutral state.
- Motion: §16. Nothing flashes; the wipe is a single 1s sweep.

### Verification (port into `tests/e2e`)

**Round 3 (owner feedback):** Playwright scripts (session scratchpad `fix1/`):
`full.cjs` fold checks (answers end at 627 on 1280×720, 648 on 1366×768, 620
on 1024×768, 630/643 on 390×844 EN/DE, 639/664 on 360×740, 770 on 1920×1080;
no horizontal overflow) and the rendered contrast audit below over every
scroll position, unanswered + both cultures × light/dark × EN/DE × 1440/390:
**4,880 runs, 0 failures**, lowest 3.24 (role line over the treeline, large
text). That audit ran while the credit still had a halo; the glyph-based
audit of 2026-10-15 (§2, contrast) covers the credit as it is now.
`light.cjs`: lamp gain at identical offsets over the stations vs the
technology panel, ratio 1.000–1.001 in light and dark; idle fade-out starts at
2.8s and is gone by 3.5s, the next move re-lights it at the pointer (no drift);
leaving the window → 0; touch → 0; reduced motion → none. `edges.cjs`: slot A
covers both side edges in 64 checks (mid-intro, settled, after pointer, after
scroll; 390/1440/1920; both cultures; overlay and classic scrollbars).
`sweep.cjs`: identical rendered image size in A, B and C at 1920×1080,
1920/1440/1100/768×900 and 390×844, cyclist axis on the page centre (0.0px).
No console or page errors.

**Polish pass (art-director critique, round 2):** a Playwright script
(session scratchpad `verify.cjs`) ran fold checks at 1280×720, 1366×768,
1536×864, 1024×768, 390×844 and 1920×1080 (answers end above `100svh − 48px`
everywhere), the full click-through (both answers, both wipe directions, header
re-switch, stations, Java filter, e-mail reveal, palette) in light and dark at
1440 and 390, reduced motion at both widths (no Lenis, crossfade, parked light),
the rendered contrast audit below, and **no console errors or page errors**.
Screenshots: `docs/design/round-2/final-shots/`.

Earlier pass:

The mock was verified with Playwright scripts (session scratchpad,
`final2/`): `behave.cjs`, `contrast.cjs`, `shots.cjs`.

- **Behaviour (34 checks, all pass, no console errors):** starts neutral; header
  culture control hidden before the answer; question visible; nav anchor scrolls
  and focuses while unanswered; answering Casually → personal + stored; question
  collapses into the header; focus on the header option; personal photo shown;
  header re-switch; DE applied; alt localized; station expand and collapse; skill
  map lights 2 stations with readout; Esc clears; Ctrl+K opens with focus in the
  input; palette switches culture; palette jump focuses Contact; e-mail
  assembled on demand; Esc returns focus; reset choice restores the question;
  photos off → procedural planes; contact links 16–22px with a 44px hit area;
  header targets ≥ 24px; no overflow at 1440, 390 and 360 (DE, both cultures);
  reduced motion → no Lenis and crossfade; no-VT → instant; portrait black and
  white while unanswered, colour after.
- **Rendered contrast audit:** for each state × scheme × language × width, step
  through the page, collect every visible text run, hide all text
  (`color: transparent`), screenshot, and compare each run's colour with the
  10th-percentile background pixel behind it (body ≥ 4.5, large ≥ 3).
  Result: 9,318 runs, 0 failures. Lowest per state: neutral light 6.86 /
  dark 6.21, professional light 6.85 / dark 6.05, personal light 6.25 /
  dark 6.37.
- Add in production: a CLS assertion (≤ 0.1 at 390 and 1440), and axe on
  every state.

---

## 18. State, storage, debug

- Head script before first paint (all storage in try/catch): culture
  (`mm-culture` = `professional|personal`; absent → `data-culture="neutral"`,
  `data-answered="false"`), language (`mm-lang`, else `navigator.language`),
  motion class (`rm` or `intro`).
- `data-culture` on `html`: `neutral | professional | personal`. Neutral uses the
  professional tokens and copy, black-and-white imagery, no credit, the gate
  shown.
- **Debug (mock only, never shipped):** reset choice, scheme (auto → light →
  dark), motion (auto → reduced → full), photos (on/off). Hidden in screenshots
  through `html.shot`.

---

## 19. Decisions and rationale

**Owner's verdict (binding).**

1. **Base = image-atmosphere**, including the photograph split into three slots
   over the whole page (A hero, B clearing, C ground).
2. **The opening view comes from light-and-depth:** name in the sky top-left,
   lede, question and portrait in a row on the ground below. image-atmosphere's professional hero (a pane from
   43vw with the portrait overlapping its fading edge, a dead band under the
   intro, a stray disc at the fold) is replaced.
3. **The same hero structure for every culture.** One set of geometry
   variables and one shared horizon; each photograph declares only its aspect
   ratio and horizon (`--ar`, `--hzf`). Formal and casual differ in palette, type
   register, tone, portrait and photograph, nothing else.
4. **Programmer first, photographer second.** light-and-depth leaned on a
   full-height photograph. Here the photograph is a horizon **band** that thins
   out at the edges and stops before the text row; the name and the lede sit on
   calm colour. The photography shows as a credit and the B/C slots, a personal
   touch rather than the subject.
5. **Contact links modest:** 17–20px in one row with 44px hit areas, replacing
   image-atmosphere's 82px lines.
6. **cinematic-scroll's choreography is not adopted** (it measured about 9× the
   main-thread cost). Borrowed only the light details listed below.
7. **Professional photograph art direction:** landscape file for wide
   viewports, the square for portrait-shaped ones, via `<picture>` and the same
   aspect-ratio media query in CSS.

**Owner feedback, round 3 (binding; supersedes the items marked "superseded" below).**

1. **Slot A is a full-bleed plane** behind the hero, treated like B and C
   (vertical fades only, dissolving into the page), not a short strip with
   faded outer thirds, which did not fit the three-way split (§6).
2. **Slot A scales with the viewport height only**, cover-style around a focal
   column, like B and C: narrowing the window crops from the sides instead of
   shrinking the picture (§6).
3. **Professional storyline:** A sky, lamps and the cyclist's head and
   shoulders (cut by the fade); B the cyclist on the crest with the warm glow,
   lamps and converging railings; C the reflection (unchanged). Wide file on
   wide viewports, square on narrow ones, for A and B (§7).
4. **Personal storyline:** A bright sky with the treeline low in the frame
   (more sky than round 2, a little more scenery than image-atmosphere's
   original); B the gnarled trees and mid-meadow up close; C the grass (§7).
5. **Credit in the scene,** pinned to a tree crown / a lamp globe with a
   hairline, away from the portraits (§8).
6. **One light, one strength everywhere;** it fades out in place after 2.8s
   still or on leaving the window and fades back in at the pointer; no resting
   spot; none on touch or with reduced motion (§10).
7. **Role line** "Software engineer · Kotlin, Java, Spring" (DE
   "Softwareentwickler · Kotlin, Java, Spring") in both cultures.
8. **Palette button** keeps the shortcut label: ⌘K on macOS, otherwise "Ctrl K"
   (EN) / "Strg K" (DE); on phones the search glyph (unchanged).
9. **How I work** loses its 01–04 numbering (grid and hairlines stay). The "×2"
   counts on the technology filter stay.
10. **Full-bleed regression check:** the photo must reach both side edges at
   all times, during and after the intro, after pointer movement and scroll.
11. **The formal photograph stays centred:** the cyclist (symmetry axis) on the
   page centre at every width, wide and square file; resizing crops equally
   from both sides (§6).
12. **One scale for all three slots,** slot C's as the reference, so A, B and C
   read as windows onto one continuous photograph (§7). Consequences: slot B is
   `56svh` high in both cultures (the professional 40svh showed too few rows),
   slot C professional uses the wide file on wide viewports, and on phones the
   professional A shows sky and the cyclist's head and shoulders but not the
   big globes (they lie outside the phone's crop at that scale).

**Grafts from the judges (where they did not contradict the owner).**

- Unanswered "ungraded take" includes the **portrait in black and white**
  (recruiter, cinematic-scroll), so answering colours everything at once.
- **Gate answers set in their register at rest**, and a plain muted "or" instead
  of the orange italic one (recruiter, trope detector).
- ~~Bold role first in the lede; axis credit with an ember plumb line; portrait
  lit as a print on the horizon~~: superseded by the polish pass below.
- **No milky full-photo wash:** the light-scheme grade is .08 (professional)
  and .10 (personal); legibility comes from layout (band + haze).
- **Header target sizes ≥ 24px** and **footer colophon** honest about who took
  which photos (light-and-depth).
- **Each slot shows its own part of the photograph** (§7).
- **Decode before the wipe**, so the incoming snapshot never shows an empty band
  (found in the mid-wipe screenshots).
- **Production hygiene from the a11y/perf judge:** self-hosted font with a
  metric fallback (their CLS finding of 0.207 came from the Google Fonts swap),
  pre-cut AVIF/WebP crops, the corrected JS budget (ScrollTrigger is 17.8 KB),
  zero ScrollTriggers under reduced motion, contrast audit over all scroll
  positions.

**Rejected.**

- cinematic-scroll's rack focus (blurred text fails WCAG 1.4.3 by design),
  dolly/push-in, the 7,460px film length, and its "From machines to backend
  systems." headline (frames him by his origin story, contrary to the
  positioning).
- WebGL/OGL: no visible gain over CSS light on top of real photographs.
- ~~Full-bleed hero photograph or a photo pane~~: superseded, round 3 (owner):
  slot A is a full-bleed plane again; the type, haze and quick fade under the
  horizon keep it "programmer first".

**Polish pass (art-director critique, all 20 items applied).**

1. Question above the fold on laptops (still holds; the band cap is superseded, round 3): band height capped at `62svh`, display
   sizes capped by height, horizon from a shared stage constant (§6).
2. Programmer first: a role line in the display family under the name (band
   parts superseded, round 3); band
   cut by about a third; outer thirds of the band at 15%.
3. Portrait off the photograph, into the text grid (cols 10–12, level with the
   lede); no sheen, no contact shadow.
4. Superseded, round 3 (credit in the scene, §8). Was: credit roman `.75rem` `--ink-2` on the band's fade line, right gutter (left
   on phones); no rule, no italic.
5. Professional light keeps its dusk: grade .08, haze only behind the name, the
   band dissolves into `--bg-2`.
6. Superseded, round 3 (§7 storyline). Was: slots A sky/lamps/cyclist, B dusk sky with the lamp globes, C the reflection
   (always the square file); personal A sky/treeline, B gnarled trees, C grass.
   **Deviation:** the critique proposed B = the horizon strip at
   `object-position 50% 58%`; every horizon crop of this photograph contains the
   cyclist (he sits on the axis at the horizon), so B became the sky-and-globes
   strip above him instead, which repeats nothing.
7. Bold claim + grey sentence kept only in How I work; lede and now-line plain;
   station items task (small, `--ink-2`) over outcome (`--ink`).
8. How I work: 2 × 2 grid with hairlines (the 01–04 index was removed, round 3).
9. Light field: oklab multi-stop gradients, inner 40%, grain .07 (resting spot superseded, round 3: it fades out in place); rests over the
   name and drifts home on leave / 2s idle.
10. ~~One shared spotlight layer behind the stations~~: removed, round 3 (it
   made the lamp stronger over the stations than over the filter).
11. Answered state: an onward row (Get in touch · GitHub) replaces the question;
   hero and Experience paddings reduced.
12. Filter: resting underlines, counts (×2), top aligned with the first station,
   accent rule on lit stations, real dimming. **Deviation:** dim opacity is
   **.62, not .38**, so dimmed rows stay AA (ink-2 at .38 measured ≈ 2:1).
13. Phones: stations first, the filter collapsed in a disclosure above them.
14. Years at `--h-size × .55`, "2024– today", the degree folded into the
   2015–2018 station.
15. Gate morph: only the chosen word travels, at natural size; the rest fades.
16. Horizon independent of the culture.
17. Header brand hidden until the name scrolls away, 100% width.
18. Palette button labelled ⌘K / Ctrl K; accent rail selection; group headers.
19. Phone header: DE, "→ Casual", search glyph.
20. Contact arrow outside the underline; How I work bottom padding 96px; print
   fallback for scroll reveals.

**Trope check** (research Part B): no eyebrows, cards, bento, glass, blobs,
gradient text, mono "tech" type, status-dot pill, CTA pairs, toasts, icon tiles,
hover lifts, logo walls, count-ups, fake terminals, preloader, custom cursor,
marquee or loops. Three earlier "no" items are now used deliberately and
quietly, on the critique's request: "×2" counts on two filter terms and the
⌘K label as plain text (no badge box). (The 01–04 index in How I work was
removed in round 3.) One family through its axes; one signature interaction (light).

### Open points for the owner

- Confirm every work item and outcome line (anonymised round-1 placeholders).
- Supply the real e-mail address.
- Optional separate photographs for slots B and C per culture; without them the
  slot-A photograph is read from sky to ground, which already works.
- Confirm the cyclist silhouette is fine as atmosphere.
- ~~Slot B (professional)~~ and ~~the role line wording~~ and ~~the ⌘K label~~:
  decided, round 3 (B shows the cyclist; "Software engineer"; shortcut label).
