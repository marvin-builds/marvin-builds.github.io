# personal-site

The personal website of **Marvin Mai**, software engineer (Kotlin, Java,
Spring). It introduces me to future employers and colleagues: where I have
worked, what I built there and how I like to work.

> **Status:** in development. The design is settled and lives as a clickable
> mock in [`docs/design/mock.html`](docs/design/mock.html); the Astro
> implementation follows the [design spec](docs/design-spec.md). Until it is
> done, [marvinmai.github.io](https://marvinmai.github.io) shows a short
> holding page.

## The idea

The site asks one question before it introduces me: **"How should I introduce
myself? Formally or casually?"**

- **Formally** sets the page in a cool, restrained register: a dusk footbridge,
  narrow tall type, a concise CV tone.
- **Casually** switches to a warm, green register: a sunlit upland meadow, wide
  open type, a more personal voice.

The choice changes colours, photographs, typography **and** the wording of
every text. It can be changed at any time; the page then re-renders through a
diagonal wipe. Light and dark follow the system setting until a day/night
switch in the header overrides it, so there are four palettes in total. All atmosphere photographs are my own.

## Features

- **Two tones, two languages:** every text exists in German and English, each
  in a formal and a casual version. Both tones ship in the HTML, so switching
  is instant and works without JavaScript.
- **Experience timeline:** one card per position that expands in place, with
  work areas, one-line outcomes and the technologies used.
- **Skill map:** pick a technology to highlight every position that used it.
- **Command palette:** <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> to jump to a
  section, switch tone or language, or copy the e-mail address.
- **Light as interaction:** the cursor is a soft lamp over the page; on the
  welcome screen it takes on the colour of the answer you are about to pick.
- **Calm motion:** scroll reveals and parallax, all switched off under
  `prefers-reduced-motion`.
- **Privacy-friendly:** no cookies, no tracking banner. Visits are counted with
  cookieless [GoatCounter](https://www.goatcounter.com/); the e-mail address is
  assembled on demand and never appears in the HTML.
- **Accessible:** WCAG AA contrast in all four palettes, full keyboard
  operation, semantic HTML that works without JavaScript.

## Tech stack

| Area | Choice |
|---|---|
| Framework | [Astro](https://astro.build) (static output), TypeScript strict |
| Styling | Plain CSS with custom properties; one variable font ([Mona Sans](https://github.com/github/mona-sans), SIL OFL) |
| Motion | View Transitions API, CSS scroll-driven animations, GSAP + Lenis (optional enhancement) |
| Tests | [Vitest](https://vitest.dev) for logic, [Playwright](https://playwright.dev) for behaviour |
| Hosting | GitHub Pages, deployed by GitHub Actions |

## Getting started

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev        # dev server at http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm test` | Run the unit tests (Vitest) |
| `npm run test:e2e` | Run the browser tests (Playwright) |
| `npm run check` | Type-check the project (`astro check`) |
| `npm run check:privacy` | Scan sources and build output against the local denylist |

To view the design mock, serve `docs/design/` with any static server, for
example `python3 -m http.server 8137 -d docs/design`, and open
`http://localhost:8137/mock.html`. The atmosphere photographs it references are
not part of the repository; the production images live in
`src/assets/photos/`.

## Privacy guard

The texts on this site are written fresh and anonymised: no customer or
colleague names, ticket keys, internal links or contract details. A safety net
makes sure nothing slips through:

1. Copy [`.denylist.example`](.denylist.example) to `.denylist` (gitignored)
   and list the terms that must never be published, one per line. A line of
   the form `/pattern/flags` is a regular expression.
2. `npm run check:privacy` scans `src/`, `public/` and `dist/` and fails on any
   hit.
3. Enable the pre-push hook once with `git config core.hooksPath .githooks`; it
   builds the site and runs the check before every push.

The denylist itself never enters the repository.

## Project structure

```text
.
├── .github/workflows/      deploy to GitHub Pages on every push to main
├── docs/
│   ├── design-spec.md      the binding design: tokens, layout, motion, copy rules
│   └── design/mock.html    clickable reference mock
├── public/                 static files served as-is (favicon)
├── scripts/
│   └── check-privacy.mjs   denylist scanner used by the pre-push hook
├── src/
│   ├── assets/photos/      portraits and atmosphere photographs (metadata stripped)
│   └── pages/              Astro routes
├── tests/unit/             Vitest tests
├── tests/e2e/              Playwright tests
└── .githooks/pre-push      build + privacy check before every push
```

## How it is built

This site is developed test-first and with AI assistance: I work with
[Claude Code](https://claude.com/claude-code) as a pair programmer, and
commits made together carry a `Co-Authored-By` trailer. Design, copy and every
decision are reviewed and approved by me.

## Rights

The source code is released under the [MIT License](LICENSE). The
photographs, portraits and texts are not: they are © Marvin Mai and may not be
reused without permission. Mona Sans is licensed under the SIL Open Font
License.

## Contact

- GitHub: [@marvinmai](https://github.com/marvinmai)
- E-mail: via the contact section of the site
