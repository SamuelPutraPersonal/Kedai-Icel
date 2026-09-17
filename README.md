# Kedai Icel Website

A simple, static one-page website. No build tools, no framework — just HTML, CSS, and JS.

## Files
- `index.html` — page structure and content (menu items, text, contact info)
- `style.css` — all styling (colors, fonts, layout)
- `script.js` — WhatsApp link setup + menu tab switching
- `Dockerfile` — runs the site in an nginx container
- `images/` — photos used as CSS backgrounds (hero, about gallery, service cards); see `images/README.md` for filenames. Every spot has a color fallback, so the site still looks fine before you add real photos.

## Option A — Fastest: just open it
Double-click `index.html`. It opens in your browser. Edit any file, save, refresh the browser to see changes.

## Option B — VS Code with live-reload (recommended for playing around)
1. Open this folder in VS Code (`File > Open Folder`).
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel.
3. Right-click `index.html` → **Open with Live Server**.
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
docker run -p 8080:80 -v "%cd%":/usr/share/nginx/html nginx:alpine
```
(with that volume mount, no rebuild needed — just save and refresh)

## What's safe to customize
- **Menu items/prices**: in `index.html`, search for `menu-card` blocks.
- **Colors**: in `style.css`, the `:root { ... }` block at the top (`--accent`, `--gold`, etc.).
- **WhatsApp number/message**: in `script.js`, the `waNumber` and `waMessage` variables.
- **Address/map**: search `kontak` section in `index.html`, and the Google Maps `iframe` src.
- **Photos**: drop files into `images/` using the names listed in `images/README.md`.

## IntelliJ
IntelliJ (Ultimate) has built-in support for opening static HTML with a browser preview icon in the gutter — no plugin needed. Community Edition can open/edit the files fine but lacks the live preview; VS Code + Live Server is easier for that.
