# Images in use

| File | Used for |
|---|---|
| `tumpeng2.jpeg` | Hero background (left dark overlay) and the "Tentang Kami" section photo |
| `tumpeng.jpeg` | "Paket Catering" service card |
| `nasi_kotak.jpeg` | "Nasi Kotak" service card |
| `sate.jpeg` | "Menu Harian" service card |

All of the above are wired into `index.html` as `<img>` elements with
`object-fit:cover` (see `.about-photo-img` / `.service-media` in `style.css`),
so they crop cleanly instead of stretching.

## Still needed

| File | Used for | Suggested size |
|---|---|---|
| `service-porsi.jpg` | "Menu Porsi" service card | ~600×800, portrait |

This one is still a placeholder (gold color fallback, no broken-image icon).
Drop a file with this exact name into this folder — no code changes needed.
