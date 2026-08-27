# Trusted Sellers

A showcase catalog for sneaker & streetwear sellers (Momokicks, PJS, +demo).
Static site — HTML + Tailwind (CDN) + vanilla JS. No build step.

## Run locally
```bash
python3 serve.py   # http://localhost:8765
```

## Structure
- `index.html`, `shop.html`, `category.html`, `product.html`, `vendor.html`, `404.html`
- `assets/js/catalog-data.js` — auto-generated from the sellers' spreadsheets (MOMO_RAW / PJS_RAW)
- `assets/js/data.js` — sellers, categories, product builders (batches, currency, links)
- `assets/js/app.js` — rendering, filters, batch picker, order buttons
- `assets/css/styles.css` — theme
- `assets/img/` — product images (extracted & optimized)

## Update the catalog
Re-generate `assets/js/catalog-data.js` from updated spreadsheets, then bump the `?v=` query on the `<script>`/`<link>` tags to bust caches.

## Order links
Per-seller WhatsApp / Discord / Yupoo and per-product Weidian links live in `data.js` (VENDORS) and `catalog-data.js`.
