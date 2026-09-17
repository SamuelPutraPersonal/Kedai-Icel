# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Kedai Icel — a static one-page marketing site for a home catering business
(Terbanggi Besar, Lampung Tengah, Indonesia). Plain HTML/CSS/JS, no build
tools, no framework, no package manager.

## Files

- `index.html` — all page structure and content (hero, about, menu, ordering
  steps, testimonials, contact).
- `style.css` — all styling, including light/dark theme via CSS custom
  properties in `:root` and `prefers-color-scheme`.
- `script.js` — two responsibilities: building the WhatsApp deep link and
  wiring the menu tab switcher.
- `Dockerfile` — serves the folder as-is via `nginx:alpine`.
- `README.md` — end-user setup instructions (Live Server, Docker, IntelliJ).

## Working in this repo

- No build step. Edits to any file take effect on browser refresh.
- Keep everything working with `file://` opened directly, not just via a
  server — avoid `fetch`, ES modules, or anything requiring CORS/origin.
- `script.js` is loaded as a plain classic script (no `type="module"`, no
  bundler). Keep it in that style — `var`/function declarations, no imports.
- Don't introduce a framework, CSS preprocessor, or build tool unless
  explicitly asked.

## Conventions

- Colors, fonts, spacing are theme tokens in `style.css`'s `:root` block
  (`--accent`, `--gold`, `--bg`, etc.) plus a `prefers-color-scheme: dark`
  override and a `[data-theme="dark"]` override. Add new colors as tokens
  there rather than hardcoding hex values in rules.
- Menu items live in `index.html` as `.menu-card` blocks inside
  `.menu-panel[data-panel="..."]` sections; tab buttons
  (`.menu-tab[data-tab="..."]`) must match the panel's `data-panel` value.
- The WhatsApp number and prefilled message are the two variables at the top
  of `script.js` (`waNumber`, `waMessage`) — update there, not per-link in
  HTML. Links get their `href` set at runtime by
  `document.querySelectorAll('.hero-wa-btn, #nav-wa-btn, #float-wa')`, so any
  new WhatsApp CTA button must use one of those existing classes/ids (or be
  added to that selector) to get its link wired.
- Section `id`s (`#tentang`, `#menu`, `#cara-pesan`, `#kontak`) are targeted
  by the nav links in the header — keep them in sync if renaming.

## Verifying changes

- No test suite. Check changes by opening `index.html` directly in a browser,
  or via Docker: `docker build -t kedai-icel . && docker run -p 8080:80 kedai-icel`.
- After editing `script.js`, a quick syntax check: `node --check script.js`.
