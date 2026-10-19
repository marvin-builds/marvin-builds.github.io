## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project rules

- Personal portfolio site for Marvin Mai, deployed to GitHub Pages as `marvin-builds/marvin-builds.github.io`. Plan and phases: see `docs/` once written.
- Git workflow: pull requests
- **Public repo.** Content is written fresh and anonymised: no customer or colleague names, ticket keys, internal links, salary or contract details. Employer names (Element Logic, Dürr Systems) are fine.
- `.denylist` is local and gitignored; `npm run check:privacy` scans `src`, `public` and `dist` against it, and the pre-push hook (`git config core.hooksPath .githooks`) runs it.
- Content exists in DE/EN × professional/personal tone; keep all four variants in sync. Exception: Experience, How I work and the photo credit have one (formal) tone, DE/EN only.
- Test-first: Vitest for logic (`tests/unit`), Playwright for behaviour (`tests/e2e`).
