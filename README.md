# Kedai Icel Website

A simple, static one-page website. No build tools, no framework — just HTML, CSS, and JS.

## Files
- `src/index.html` — page structure and content (menu items, text, contact info)
- `src/style.css` — all styling (colors, fonts, layout)
- `src/script.js` — WhatsApp link setup, menu filters, quote builder, lightbox
- `src/images/` — photos used as `<img>`/CSS backgrounds (hero, about photo, service cards, menu thumbnails); see `src/images/README.md` for filenames. Every spot has a color fallback, so the site still looks fine before you add real photos.
- `Dockerfile` — runs `src/` in an nginx container
- `tests/`, `playwright.config.js` — Playwright E2E tests (see below)
- `.github/workflows/` — CI (runs tests on PRs) and deploy (publishes `src/` to GitHub Pages on push to `main`)

## Option A — Fastest: just open it
Double-click `src/index.html`. It opens in your browser. Edit any file, save, refresh the browser to see changes.

## Option B — VS Code with live-reload (recommended for playing around)
1. Open this folder in VS Code (`File > Open Folder`).
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel.
3. Right-click `src/index.html` → **Open with Live Server**.
4. It opens at something like `http://127.0.0.1:5500` and auto-refreshes every time you save a file.

## Option C — Docker
From this folder, in a terminal (PowerShell/cmd):
```
docker build -t kedai-icel .
docker run -p 8080:80 kedai-icel
```
Then open `http://localhost:8080` in your browser.
To see edits, rebuild the image (`docker build` again) or mount the folder as a volume instead:
```
docker run -p 8080:80 -v "%cd%\src":/usr/share/nginx/html nginx:alpine
```
(with that volume mount, no rebuild needed — just save and refresh)

## Option D — Playwright E2E tests
```
npm ci
npx playwright install --with-deps   # first time only
npm run test:e2e
```
This starts its own local static server for `src/` (via `http-server`) and tears it down after — no need to serve the site yourself first.

## What's safe to customize
- **Menu items**: in `src/index.html`, search for `menu-item` blocks (no prices — pricing is quote-only via the WhatsApp modal).
- **Colors**: in `src/style.css`, the `:root { ... }` block at the top (`--accent`, `--gold`, etc.).
- **WhatsApp number/message**: in `src/script.js`, the `waNumber` and `waMessage` variables.
- **Address/map**: search `kontak` section in `src/index.html`, and the Google Maps `iframe` src.
- **Photos**: drop files into `src/images/` using the names listed in `src/images/README.md`.

## IntelliJ
IntelliJ (Ultimate) has built-in support for opening static HTML with a browser preview icon in the gutter — no plugin needed. Community Edition can open/edit the files fine but lacks the live preview; VS Code + Live Server is easier for that.
