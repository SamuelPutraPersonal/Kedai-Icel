# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Kedai Icel — a static one-page marketing site for a home catering business
(Terbanggi Besar, Lampung Tengah, Indonesia). The site itself is plain
HTML/CSS/JS with no build step, no framework, and no runtime dependencies.
A Node/Playwright toolchain exists alongside it purely for E2E testing and
CI — it never touches how the site is authored or served.

## Files

Production site lives under `src/`; everything else (config, tests, CI,
docs) stays at the repo root — this split is deliberate, keep new files on
the correct side of it.

- `src/index.html` — all page structure and content (hero, about, services
  grid, filterable menu, quote-builder modal, lightbox, ordering steps,
  testimonials, contact). Also carries OG/Twitter meta tags and a
  `CateringService` JSON-LD block — update `og:*`/`twitter:*`/JSON-LD `url`
  and `image` fields once the site has a real deployed domain (currently a
  placeholder, flagged with a `TODO` comment in the `<head>`).
- `src/style.css` — all styling via CSS custom properties in `:root`
  (single fixed light/warm theme — no dark-mode variant).
- `src/script.js` — a single IIFE covering: the WhatsApp deep link, menu
  category filters (fade transition), the WhatsApp quote-builder modal, and
  the image lightbox.
- `src/images/` — photo assets used as `<img>`/CSS `background-image`s
  (hero, about photo, service cards, menu thumbnails). See
  `src/images/README.md` for expected filenames. Every spot that references
  one has a CSS color fallback, so a missing file never shows as a broken
  image.
- `Dockerfile` — serves `src/` via `nginx:alpine` (`COPY src/ ...` — if you
  add another top-level production directory, it needs its own `COPY` line
  too).
- `README.md` — end-user setup instructions (Live Server, Docker, IntelliJ,
  Playwright).
- `package.json` / `package-lock.json` — **test-only** dependencies
  (`@playwright/test`, `http-server`). Not needed to author or serve the
  site; `main` points at `src/script.js` for tooling that reads it, but
  nothing in this project actually `require()`s it.
- `playwright.config.js`, `tests/` — Playwright E2E config and specs. The
  `webServer` block runs `npx http-server ./src -p 8080` — if `src/` is
  ever renamed or split further, update that command (and `Dockerfile`'s
  `COPY`, and `deploy.yml`'s `path`) together.
- `.github/workflows/ci.yml` — on every PR into `main`: `npm ci`, install
  Playwright browsers, `npm run test:e2e`, upload the HTML report as an
  artifact.
- `.github/workflows/deploy.yml` — on every push to `main`: publishes
  `src/` (via `upload-pages-artifact`'s `path: './src'`) to GitHub Pages.
  No build step, so anything committed under `src/` is published as-is —
  keep secrets and non-public files out of `src/`.

## Working in this repo

- No build step for the site itself. Edits to `src/index.html`,
  `src/style.css`, or `src/script.js` take effect on browser refresh — no
  need to run anything.
- Keep everything working with `file://` opened directly, not just via a
  server — avoid `fetch`, ES modules, or anything requiring CORS/origin.
- `src/script.js` is loaded as a plain classic script (no `type="module"`,
  no bundler). Keep it in that style — `var`/function declarations, no
  imports. (`playwright.config.js` at the repo root is a separate, ESM
  Node config file for the test tooling only — that ESM style doesn't apply
  to anything under `src/`.)
- Don't introduce a framework, CSS preprocessor, or build tool for the site
  itself unless explicitly asked. (The Playwright toolchain is test-only and
  doesn't change this.)

## Conventions

- Colors, fonts, spacing are theme tokens in `src/style.css`'s `:root` block
  (`--accent`, `--accent-dark`, `--gold`, `--bg`, `--heading`, etc.). Add new
  colors as tokens there rather than hardcoding hex values in rules — a few
  low-opacity `rgba(...)` glows/shadows are hardcoded to match the current
  accent/gold values since CSS custom properties can't be used inside
  `rgba()`; update those by hand if the accent or gold hex changes.
- Menu items live in `src/index.html` as `.menu-item[data-category="..."]`
  blocks inside `#menu-list`; filter buttons (`.menu-filter[data-filter="..."]`)
  must use one of the categories a `.menu-item` actually has (`nasibox`,
  `lauk`, `snack`), or `semua` to show everything. No price tags on cards —
  pricing is quote-only, via the WhatsApp modal.
- Every dish's `.menu-select-btn` needs a `data-dish` attribute with the
  exact same text as its `.menu-item-name` — `src/script.js` builds the quote
  modal's checklist from `data-dish` values (first occurrence wins if a
  name repeats), and matches card clicks back to that checklist by string
  equality. A typo or mismatch silently breaks the "pre-check this dish"
  behavior.
- The WhatsApp number and prefilled message are the two variables at the top
  of `src/script.js` (`waNumber`, `waMessage`) — update there, not per-link in
  HTML. Links get their `href` set at runtime by
  `document.querySelectorAll('.hero-wa-btn, #nav-wa-btn, #float-wa')`, so any
  new WhatsApp CTA button must use one of those existing classes/ids (or be
  added to that selector) to get its link wired.
- Section `id`s (`#tentang`, `#menu`, `#cara-pesan`, `#kontak`) are targeted
  by the nav links in the header — keep them in sync if renaming. Note
  `#menu` is the "Layanan Catering" image-card grid; the filterable,
  quote-builder-driven menu right below it is a separate section,
  `#menu-detail`.
- Any food photo meant to be zoomable needs the `.lightbox-trigger` class
  on its `<img>` — `src/script.js` wires clicks generically off that class, no
  per-image JS needed.

## Verifying changes

- Site changes: open `src/index.html` directly in a browser (or via Docker:
  `docker build -t kedai-icel . && docker run -p 8080:80 kedai-icel`). After
  editing `src/script.js`, a quick syntax check: `node --check src/script.js`.
- E2E tests (`tests/`, run locally): `npm ci`, then once per machine
  `npx playwright install --with-deps`, then `npm run test:e2e`. The config
  runs `npx http-server ./src -p 8080` itself and tears it down after — no
  need to start one by hand.
- CI runs the same E2E suite on every PR into `main` (`.github/workflows/ci.yml`)
  and publishes to GitHub Pages on every push to `main`
  (`.github/workflows/deploy.yml`).
