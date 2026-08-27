/* ============================================================
   TRUSTED SELLERS — Application engine (showcase catalog)
   Browse-only. No cart: products are ordered from their seller
   via WhatsApp or Discord. Keeps favorites, follows, QC photos,
   reviews and search.
   ============================================================ */

(function () {
  "use strict";

  /* Currency: prices stored per seller's base currency, converted on read.
     CUR_RATES = CNY per 1 unit of that currency. */
  const CURRENCY_KEY = "ts_currency";
  const CUR_RATES = { CNY: 1, USD: 7.2, EUR: 7.8 };
  const CUR_SYM = { CNY: "¥", USD: "$", EUR: "€" };
  function displayCur() {
    const c = localStorage.getItem(CURRENCY_KEY);
    return CUR_RATES[c] ? c : "USD";
  }
  function baseCurOf(p) {
    return (VENDORS[p.vendor] && VENDORS[p.vendor].baseCurrency) || "USD";
  }
  function money(amount, base = "USD") {
    const cny = amount * (CUR_RATES[base] || 1);
    const d = displayCur();
    const v = Math.round(cny / CUR_RATES[d]);
    return CUR_SYM[d] + v.toLocaleString("en-US");
  }

  const qs = (sel, el = document) => el.querySelector(sel);
  const qsa = (sel, el = document) => [...el.querySelectorAll(sel)];
  const param = (key) => new URLSearchParams(location.search).get(key);
  const productById = (id) => PRODUCTS.find((p) => p.id === id);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const attr = (s) => esc(s); // for href/label attributes

  /* ----------------------------------------------------------
     Icons
  ---------------------------------------------------------- */
  const ICON = {
    search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    camera: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    arrowUpRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    badgeCheck: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/></svg>',
    shop: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 7h20"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    menu: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16"/><path d="M4 16h16"/></svg>',
    gallery: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>',
    cart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
    whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
    discord: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/></svg>',
  };

  const starRow = (n = 5) =>
    `<span class="inline-flex gap-0.5" aria-label="${n} out of 5 stars">${Array.from(
      { length: n },
      () => `<span class="w-3.5 h-3.5 block" style="color:var(--star)">${ICON.star}</span>`
    ).join("")}</span>`;

  /* ----------------------------------------------------------
     Order links (WhatsApp / Discord), per seller
  ---------------------------------------------------------- */
  function orderText(vendor, product) {
    if (product) return ORDER.message(vendor, { ...product, priceLabel: money(product.price, baseCurOf(product)) });
    return `Hi ${vendor.name}! I found your shop on Trusted Sellers and I'd like to ask about your catalog.`;
  }
  function waLink(vendor, product) {
    if (!vendor.whatsapp) return null;
    return `https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(orderText(vendor, product))}`;
  }
  function discordLink(vendor) {
    return vendor.discord || null;
  }

  /* ----------------------------------------------------------
     Favorites & follows (localStorage sets)
  ---------------------------------------------------------- */
  function makeStore(key, onChange) {
    return {
      read() {
        try {
          return new Set(JSON.parse(localStorage.getItem(key)) || []);
        } catch {
          return new Set();
        }
      },
      has(id) {
        return this.read().has(id);
      },
      toggle(id) {
        const set = this.read();
        set.has(id) ? set.delete(id) : set.add(id);
        localStorage.setItem(key, JSON.stringify([...set]));
        if (onChange) onChange();
        return set.has(id);
      },
      size() {
        return this.read().size;
      },
    };
  }
  const Favs = makeStore("trusted_sellers_favs_v1", () => renderFavBadge());
  const Follows = makeStore("trusted_sellers_follows_v1");

  function renderFavBadge() {
    const badge = qs("#fav-count");
    if (!badge) return;
    const n = Favs.size();
    badge.textContent = n;
    badge.classList.toggle("has-items", n > 0);
  }

  /* ----------------------------------------------------------
     QC photos & reviews
  ---------------------------------------------------------- */
  const hashOf = (s) => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
  function qcCountFor(p) {
    return 6 + (hashOf(p.id) % 18);
  }
  async function getQCPhotos(p) {
    if (QC_CONFIG.endpoint) {
      try {
        const res = await fetch(`${QC_CONFIG.endpoint}?product=${encodeURIComponent(p.id)}`, {
          headers: QC_CONFIG.apiKey ? { Authorization: `Bearer ${QC_CONFIG.apiKey}` } : {},
        });
        const data = await res.json();
        if (Array.isArray(data.photos) && data.photos.length) return data.photos;
      } catch {
        /* fall through to the demo gallery */
      }
    }
    const mates = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).map((x) => x.image);
    const vendorMates = PRODUCTS.filter((x) => x.vendor === p.vendor && x.id !== p.id).map((x) => x.image);
    return [p.image, ...mates, ...vendorMates].filter((u, i, a) => a.indexOf(u) === i).slice(0, 5);
  }
  function reviewsFor(p) {
    const pool = ["Audio", "Peripherals", "Watches"].includes(p.category) ? REVIEWS_GEAR : REVIEWS_WEAR;
    const h = hashOf(p.id);
    return [0, 1, 2].map((i) => pool[(h + i * 2) % pool.length]);
  }
  function distributionFor(rating) {
    const p5 = Math.min(88, Math.max(55, Math.round((rating - 3.9) * 88)));
    const p4 = Math.max(6, 94 - p5);
    return [
      [5, p5],
      [4, p4],
      [3, 4],
      [2, 1],
      [1, 1],
    ];
  }

  /* Subcategories of a top-level category (derived from products) */
  function subcategoriesOf(catSlug) {
    const seen = new Map();
    PRODUCTS.filter((p) => p.category === catSlug).forEach((p) => {
      if (!seen.has(p.subcategory)) {
        seen.set(p.subcategory, { name: p.subcategory, count: 0, image: p.image });
      }
      seen.get(p.subcategory).count += 1;
    });
    return [...seen.values()];
  }
  function categoryBySlug(slug) {
    return CATEGORIES.find((c) => c.slug === slug);
  }
  function activeCategories() {
    return CATEGORIES.filter((c) => PRODUCTS.some((p) => p.category === c.slug));
  }

  /* ----------------------------------------------------------
     Shared chrome
  ---------------------------------------------------------- */
  function pageName() {
    return document.body.dataset.page || "";
  }

  function logoHTML(sizeClass = "text-lg") {
    return `<span class="inline-flex items-center gap-2 ${sizeClass} font-bold tracking-tight">
      <span class="w-5 h-5 block" style="color:var(--brand)">${ICON.badgeCheck}</span>
      Trusted<span class="-ml-1.5" style="color:var(--ink-muted)">Sellers</span>
    </span>`;
  }

  function injectChrome() {
    const active = pageName();
    const navLinks = [
      ["index.html", "Home", "home"],
      ["shop.html", "Browse", "shop"],
    ];

    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4 lg:gap-8 h-16">
          <a href="index.html" class="shrink-0" aria-label="Trusted Sellers home">${logoHTML()}</a>
          <nav class="hidden md:flex items-center gap-6 shrink-0" aria-label="Primary">
            ${navLinks
              .map(
                ([href, label, key]) =>
                  `<a href="${href}" class="nav-link ${key === active ? "is-active" : ""}">${label}</a>`
              )
              .join("")}
          </nav>
          <form id="header-search" class="search-bar hidden sm:flex flex-1 max-w-xl mx-auto" role="search">
            <span class="w-[18px] h-[18px] block shrink-0" style="color:var(--ink-faint)">${ICON.search}</span>
            <label for="header-search-input" class="sr-only">Search products and sellers</label>
            <input id="header-search-input" type="text" placeholder="Enter product name…" autocomplete="off" />
          </form>
          <div class="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
            <button id="open-search" class="sm:hidden w-11 h-11 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:text-white" aria-label="Search">
              <span class="w-5 h-5 block">${ICON.search}</span>
            </button>
            <label for="currency-select" class="sr-only">Currency</label>
            <select id="currency-select" class="cur-select" title="Prices are approximate; the seller confirms the final price.">
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="CNY">¥ CNY</option>
            </select>
            <a href="shop.html?fav=1" class="relative w-11 h-11 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:text-white" aria-label="Saved items">
              <span class="w-5 h-5 block">${ICON.heart}</span>
              <span id="fav-count" class="cart-count" aria-hidden="true">0</span>
            </a>
            <button id="open-menu" class="md:hidden w-11 h-11 flex items-center justify-center cursor-pointer" aria-label="Open menu" aria-expanded="false">
              <span class="w-5 h-5 block">${ICON.menu}</span>
            </button>
          </div>
        </div>
        <nav id="mobile-menu" class="md:hidden hidden pb-5 flex-col gap-1" aria-label="Mobile">
          ${navLinks.map(([href, label]) => `<a href="${href}" class="nav-link block py-2.5">${label}</a>`).join("")}
        </nav>
      </div>`;
    document.body.prepend(header);

    /* Footer */
    const footer = document.createElement("footer");
    footer.className = "relative z-[2] border-t hairline mt-20";
    footer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12">
          <div class="col-span-2">
            <a href="index.html" class="inline-block mb-4">${logoHTML()}</a>
            <p class="text-sm leading-relaxed max-w-sm" style="color:var(--ink-muted)">A curated showcase of trusted sellers — sneakers and grails now, with clothing and tech sellers joining soon. Browse the catalog, then order directly from the seller on WhatsApp, Discord or Weidian.</p>
          </div>
          <div>
            <p class="text-sm font-semibold mb-4">Sellers</p>
            <ul class="space-y-2.5 text-sm">
              ${Object.values(VENDORS)
                .map(
                  (v) =>
                    `<li><a class="link-line" style="color:var(--ink-muted)" href="vendor.html?v=${v.slug}">${esc(v.name)}</a></li>`
                )
                .join("")}
            </ul>
          </div>
          <div>
            <p class="text-sm font-semibold mb-4">Browse</p>
            <ul class="space-y-2.5 text-sm" style="color:var(--ink-muted)">
              <li><a class="link-line" href="shop.html">All Products</a></li>
              <li><a class="link-line" href="shop.html?tag=New">New Arrivals</a></li>
              <li><a class="link-line" href="shop.html?tag=Hot">Hot Right Now</a></li>
              <li><a class="link-line" href="shop.html?fav=1">Saved Items</a></li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t hairline text-xs" style="color:var(--ink-faint)">
          <p>© 2026 Trusted Sellers. A showcase catalog. Orders are handled directly by each seller.</p>
          <p class="flex items-center gap-4">
            <a href="#" class="link-line">Privacy</a>
            <a href="#" class="link-line">Terms</a>
            <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 block" style="color:var(--brand)">${ICON.badgeCheck}</span>Sellers identity-verified</span>
          </p>
        </div>
      </div>`;
    document.body.appendChild(footer);

    /* Search overlay (mobile) */
    const search = document.createElement("div");
    search.id = "search-overlay";
    search.className = "search-overlay";
    search.setAttribute("role", "dialog");
    search.setAttribute("aria-label", "Search the marketplace");
    search.innerHTML = `
      <div class="max-w-3xl w-full mx-auto px-4 sm:px-6 pt-20">
        <div class="flex items-center gap-3 mb-8">
          <form id="overlay-search-form" class="search-bar search-bar--hero flex-1" role="search">
            <span class="w-[18px] h-[18px] block shrink-0" style="color:var(--ink-faint)">${ICON.search}</span>
            <label for="search-input" class="sr-only">Search products and sellers</label>
            <input id="search-input" type="text" placeholder="Enter product name…" autocomplete="off" />
          </form>
          <button id="close-search" class="w-11 h-11 shrink-0 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:text-white" aria-label="Close search">
            <span class="w-5 h-5 block">${ICON.close}</span>
          </button>
        </div>
        <div class="flex flex-wrap gap-2 items-center mb-8">
          <span class="text-xs mr-1" style="color:var(--ink-faint)">Popular:</span>
          ${["Air Force 1", "Jordan", "Crewneck", "Keyboard", "Vintage"]
            .map((t) => `<button class="filter-pill search-suggestion" data-q="${t}">${t}</button>`)
            .join("")}
        </div>
        <div id="search-results" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-16 overflow-y-auto max-h-[55vh]"></div>
      </div>`;
    document.body.appendChild(search);

    /* Toast */
    const toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);

    wireChrome();
  }

  /* ----------------------------------------------------------
     Chrome behavior
  ---------------------------------------------------------- */
  let lastFocus = null;

  function openSearch() {
    lastFocus = document.activeElement;
    qs("#search-overlay").classList.add("is-open");
    document.body.style.overflow = "hidden";
    qs("#search-input").focus();
  }
  function closeSearch() {
    qs("#search-overlay").classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  let toastTimer = null;
  function showToast(msg) {
    const t = qs("#toast");
    t.innerHTML = `<span class="w-4 h-4 block">${ICON.check}</span>${esc(msg)}`;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2400);
  }

  function goToShopSearch(q) {
    const term = q.trim();
    if (!term) return;
    location.href = `shop.html?q=${encodeURIComponent(term)}`;
  }

  function searchProducts(term) {
    const t = term.trim().toLowerCase();
    if (!t) return [];
    return PRODUCTS.filter((p) => {
      const v = VENDORS[p.vendor];
      return (
        p.name.toLowerCase().includes(t) ||
        p.material.toLowerCase().includes(t) ||
        p.category.toLowerCase().includes(t) ||
        p.subcategory.toLowerCase().includes(t) ||
        v.name.toLowerCase().includes(t) ||
        v.category.toLowerCase().includes(t)
      );
    });
  }

  function wireChrome() {
    qs("#open-search").addEventListener("click", openSearch);
    qs("#close-search").addEventListener("click", closeSearch);

    const curSel = qs("#currency-select");
    if (curSel) {
      curSel.value = displayCur();
      curSel.addEventListener("change", () => {
        localStorage.setItem(CURRENCY_KEY, curSel.value);
        location.reload();
      });
    }

    qs("#open-menu").addEventListener("click", (e) => {
      const menu = qs("#mobile-menu");
      const open = menu.classList.toggle("hidden") === false;
      menu.classList.toggle("flex", open);
      e.currentTarget.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSearch();
    });

    qs("#header-search").addEventListener("submit", (e) => {
      e.preventDefault();
      goToShopSearch(qs("#header-search-input").value);
    });

    /* overlay live search (mobile) */
    const input = qs("#search-input");
    const results = qs("#search-results");
    const runSearch = (q) => {
      const hits = searchProducts(q).slice(0, 8);
      if (!q.trim()) {
        results.innerHTML = "";
        return;
      }
      results.innerHTML = hits.length
        ? hits
            .map((p) => {
              const v = VENDORS[p.vendor];
              return `<a href="product.html?id=${p.id}" class="surface-card p-4 flex items-center justify-between gap-4 transition-colors duration-200 hover:bg-[#232326]">
                <span class="min-w-0">
                  <span class="vendor-chip mb-1" style="--accent:${v.accent}"><span class="glyph">${ICON.shop}</span>${esc(v.name)}</span>
                  <span class="block text-sm font-semibold truncate">${esc(p.name)}</span>
                </span>
                <span class="text-sm font-bold shrink-0">${money(p.price, baseCurOf(p))}</span>
              </a>`;
            })
            .join("")
        : `<p class="text-sm col-span-full" style="color:var(--ink-faint)">No matches for “${esc(q)}”. Try a product, seller or category.</p>`;
    };
    input.addEventListener("input", (e) => runSearch(e.target.value));
    qs("#overlay-search-form").addEventListener("submit", (e) => {
      e.preventDefault();
      goToShopSearch(input.value);
    });
    qsa(".search-suggestion").forEach((b) =>
      b.addEventListener("click", () => {
        input.value = b.dataset.q;
        runSearch(b.dataset.q);
        input.focus();
      })
    );
  }

  /* ----------------------------------------------------------
     Product tile renderer (borderless, dense)
  ---------------------------------------------------------- */
  function productCard(p, revealDelay = 0, entering = false) {
    const v = VENDORS[p.vendor];
    const enterCls = entering ? "tab-enter" : "reveal";
    const delayVar = entering ? "--enter-delay" : "--reveal-delay";
    const wa = waLink(v, p);
    const priceLabel = p.price != null ? (p.isModel || p.priceFrom ? "From " : "") + money(p.price, baseCurOf(p)) : "Ask price";
    const chip = p.isModel ? `<span class="qc-chip">${ICON.gallery}${p.totalColorways} colours</span>` : "";
    const metaRight = p.isModel
      ? `<span class="text-[11px] shrink-0" style="color:var(--ink-faint)">${p.totalColorways} colourways</span>`
      : p.hasBatches
      ? `<span class="text-[11px] shrink-0" style="color:var(--ink-faint)">${p.batches.length} batches</span>`
      : "";
    return `
      <article class="product-card group ${enterCls}" style="--accent:${v.accent}; ${delayVar}:${revealDelay}ms">
        <a href="product.html?id=${p.id}" class="block" aria-label="${attr(p.name)} by ${attr(v.name)}, ${priceLabel}">
          <div class="product-media">
            ${p.batch || p.tag ? `<span class="tag-pill">${esc(p.batch || p.tag)}</span>` : ""}
            ${chip}
            <img src="${attr(p.image)}" alt="${attr(p.name)}" loading="lazy" />
          </div>
          <div class="pt-2.5 px-0.5">
            <h3 class="text-[13px] font-medium leading-snug truncate">${esc(p.name)}</h3>
            <div class="flex items-center justify-between gap-2 mt-1">
              <p class="text-sm font-bold">${priceLabel}</p>
              ${metaRight}
            </div>
            <p class="vendor-chip mt-1 w-full"><span class="glyph">${ICON.shop}</span><span class="truncate">${esc(v.name)}</span></p>
          </div>
        </a>
        <button class="fav-btn ${Favs.has(p.id) ? "is-active" : ""}" data-fav="${p.id}" aria-label="${Favs.has(p.id) ? "Remove" : "Save"} ${attr(p.name)}" aria-pressed="${Favs.has(p.id)}">
          <span class="w-4 h-4 block">${ICON.heart}</span>
        </button>
        ${
          p.weidian
            ? `<a class="quick-order quick-buy" href="${attr(p.weidian)}" target="_blank" rel="noopener" aria-label="Buy ${attr(p.name)} on Weidian" title="Buy on Weidian"><span class="w-4 h-4 block">${ICON.cart}</span></a>`
            : wa
            ? `<a class="quick-order" href="${wa}" target="_blank" rel="noopener" aria-label="Order ${attr(p.name)} on WhatsApp" title="Order on WhatsApp"><span class="w-4 h-4 block">${ICON.whatsapp}</span></a>`
            : ""
        }
      </article>`;
  }

  const DENSE_GRID = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6";

  function wireCardActions(scope = document) {
    qsa("[data-fav]", scope).forEach((btn) => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = "1";
      btn.addEventListener("click", () => {
        const p = productById(btn.dataset.fav);
        const on = Favs.toggle(p.id);
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", String(on));
        btn.setAttribute("aria-label", `${on ? "Remove" : "Save"} ${p.name}`);
        btn.classList.remove("pop");
        void btn.offsetWidth;
        btn.classList.add("pop");
        showToast(on ? `${p.name} saved` : `${p.name} removed from saved`);
      });
    });
  }

  /* ----------------------------------------------------------
     Image fallback
  ---------------------------------------------------------- */
  function hookImageFallbacks(scope = document) {
    qsa(".product-media img, .vendor-hero-media img, .cat-circle .ring img, .cat-tile img, .seller-avatar img, .search-pop .thumb img", scope).forEach((img) => {
      if (img.dataset.fallbackHooked) return;
      img.dataset.fallbackHooked = "1";
      img.addEventListener("error", () => {
        const wrap = img.closest(".product-media, .vendor-hero-media, .ring, .seller-avatar, .thumb, .cat-tile-media");
        if (!wrap) return;
        img.style.display = "none";
        if (!wrap.querySelector(".media-fallback, .ring-fallback")) {
          const small = wrap.classList.contains("ring") || wrap.classList.contains("seller-avatar") || wrap.classList.contains("thumb");
          const fb = document.createElement("div");
          fb.className = small ? "ring-fallback" : "media-fallback";
          fb.innerHTML = small ? "TS" : "<span>TS</span>";
          wrap.appendChild(fb);
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Lightbox — full-screen zoom for product photo galleries
  ---------------------------------------------------------- */
  const Lightbox = (() => {
    let el, imgEl, countEl, list = [], idx = 0;
    function build() {
      el = document.createElement("div");
      el.className = "lightbox";
      el.innerHTML = `
        <button class="lb-btn lb-close" aria-label="Close">${ICON.close || "×"}</button>
        <button class="lb-btn lb-nav lb-prev" aria-label="Previous photo">‹</button>
        <figure class="lb-stage"><img class="lb-img" alt="" /></figure>
        <button class="lb-btn lb-nav lb-next" aria-label="Next photo">›</button>
        <div class="lb-count"></div>`;
      imgEl = el.querySelector(".lb-img");
      countEl = el.querySelector(".lb-count");
      el.querySelector(".lb-close").onclick = close;
      el.querySelector(".lb-prev").onclick = (e) => { e.stopPropagation(); go(-1); };
      el.querySelector(".lb-next").onclick = (e) => { e.stopPropagation(); go(1); };
      el.addEventListener("click", (e) => { if (e.target === el || e.target.classList.contains("lb-stage")) close(); });
      let sx = 0;
      el.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
      el.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); });
      document.body.appendChild(el);
    }
    function render() {
      imgEl.src = list[idx] || "";
      const multi = list.length > 1;
      countEl.textContent = multi ? `${idx + 1} / ${list.length}` : "";
      el.classList.toggle("lb-single", !multi);
    }
    function go(d) { idx = (idx + d + list.length) % list.length; render(); }
    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    }
    function open(images, start) {
      if (!el) build();
      list = (images && images.length ? images : [""]);
      idx = Math.max(0, Math.min(start || 0, list.length - 1));
      render();
      requestAnimationFrame(() => el.classList.add("is-open"));
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
    }
    function close() {
      el.classList.remove("is-open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    }
    return { open };
  })();

  /* ----------------------------------------------------------
     Scroll reveal
  ---------------------------------------------------------- */
  function observeReveals(scope = document) {
    const els = qsa(".reveal:not(.is-visible)", scope);
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------
     Follow buttons (shared)
  ---------------------------------------------------------- */
  function wireFollowButtons(scope = document) {
    qsa("[data-follow]", scope).forEach((btn) => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = "1";
      btn.addEventListener("click", () => {
        const slug = btn.dataset.follow;
        const v = VENDORS[slug];
        const on = Follows.toggle(slug);
        btn.classList.toggle("is-following", on);
        btn.setAttribute("aria-pressed", String(on));
        btn.textContent = on ? "Following" : "Follow";
        showToast(on ? `You're now following ${v.name}` : `Unfollowed ${v.name}`);
      });
    });
  }

  /* ----------------------------------------------------------
     Page: HOME
  ---------------------------------------------------------- */
  function initHome() {
    const heroForm = qs("#hero-search-form");
    const heroInput = qs("#hero-search-input");
    const pop = qs("#search-pop");

    heroForm.addEventListener("submit", (e) => {
      e.preventDefault();
      goToShopSearch(heroInput.value);
    });

    const closePop = () => pop.classList.remove("is-open");
    heroInput.addEventListener("input", () => {
      const hits = searchProducts(heroInput.value).slice(0, 6);
      if (!heroInput.value.trim()) {
        closePop();
        return;
      }
      pop.innerHTML = hits.length
        ? hits
            .map((p) => {
              const v = VENDORS[p.vendor];
              return `<a href="product.html?id=${p.id}">
                <span class="thumb"><img src="${attr(p.image)}" alt="" loading="lazy" /></span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium truncate">${esc(p.name)}</span>
                  <span class="block text-xs mt-0.5" style="color:var(--ink-faint)">${esc(v.name)} · ${esc(p.subcategory)}</span>
                </span>
                <span class="text-sm font-bold shrink-0">${money(p.price, baseCurOf(p))}</span>
              </a>`;
            })
            .join("")
        : `<p class="px-4 py-3.5 text-sm" style="color:var(--ink-faint)">No matches for “${esc(heroInput.value)}”.</p>`;
      pop.classList.add("is-open");
      hookImageFallbacks(pop);
    });
    document.addEventListener("click", (e) => {
      if (!heroForm.contains(e.target)) closePop();
    });
    heroInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePop();
    });

    /* Seller circles */
    qs("#seller-row").innerHTML = Object.values(VENDORS)
      .map(
        (v, i) => `
      <a class="cat-circle reveal${v.comingSoon ? " is-soon" : ""}" style="--accent:${v.accent}; --reveal-delay:${i * 40}ms" href="vendor.html?v=${v.slug}" aria-label="${attr(v.name)}, ${attr(v.category)} seller${v.comingSoon ? " (coming soon)" : ""}">
        <span class="ring"><img src="${attr(v.avatar)}" alt="" loading="lazy" /></span>
        ${v.comingSoon ? `<span class="ring-soon">Soon</span>` : ""}
        <span class="label">${esc(v.name)}</span>
      </a>`
      )
      .join("");

    /* Category circles → drill-down (category.html) */
    qs("#cat-row").innerHTML = activeCategories().map(
      (c, i) => `
      <a class="cat-circle reveal" style="--reveal-delay:${i * 30}ms" href="category.html?cat=${encodeURIComponent(c.slug)}" aria-label="Browse ${attr(c.label)}">
        <span class="ring"><img src="${attr(c.image)}" alt="" loading="lazy" /></span>
        <span class="label">${esc(c.label)}</span>
      </a>`
    ).join("");

    /* Tabbed grid: Popular / New / Hot */
    const TAB_SOURCES = {
      Popular: () => [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 12),
      New: () => PRODUCTS.filter((p) => p.tag === "New"),
      Hot: () => PRODUCTS.filter((p) => p.tag === "Hot"),
    };
    const grid = qs("#tab-grid");
    grid.className = DENSE_GRID;
    function renderTab(name, entering) {
      const items = TAB_SOURCES[name]();
      grid.innerHTML = items.map((p, i) => productCard(p, (i % 6) * 35, entering)).join("");
      qsa("[data-tab]").forEach((b) => {
        const isActive = b.dataset.tab === name;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-selected", String(isActive));
      });
      wireCardActions(grid);
      hookImageFallbacks(grid);
      if (!entering) observeReveals(grid);
    }
    qs("#grid-tabs").addEventListener("click", (e) => {
      const b = e.target.closest("[data-tab]");
      if (!b || b.classList.contains("is-active")) return;
      renderTab(b.dataset.tab, true);
    });
    renderTab("Popular", false);

    /* New this week: horizontal scroll row */
    const fresh = PRODUCTS.filter((p) => p.tag === "New");
    const row = qs("#new-row");
    row.innerHTML = fresh.map((p, i) => productCard(p, i * 40)).join("");
    wireCardActions(row);
    hookImageFallbacks(row);

    /* Trending sellers strip */
    const strip = qs("#trending-sellers");
    strip.innerHTML = Object.values(VENDORS)
      .map((v, i) => {
        const following = Follows.has(v.slug);
        const prices = PRODUCTS.filter((p) => p.vendor === v.slug).map((p) => p.price).filter((n) => n != null);
        const soon = v.comingSoon || !prices.length;
        const meta = soon ? "Coming soon" : `${esc(v.category)} · From ${money(Math.min(...prices), v.baseCurrency || "USD")}`;
        return `
        <div class="seller-card flex items-center gap-3.5 reveal${soon ? " is-soon" : ""}" style="--accent:${v.accent}; --reveal-delay:${i * 60}ms">
          <a href="vendor.html?v=${v.slug}" class="seller-avatar shrink-0" aria-label="Visit ${attr(v.name)}"><img src="${attr(v.avatar)}" alt="" loading="lazy" /></a>
          <a href="vendor.html?v=${v.slug}" class="min-w-0 flex-1">
            <span class="flex items-center gap-1.5">
              <span class="text-sm font-semibold truncate">${esc(v.name)}</span>
              ${soon ? `<span class="soon-pill shrink-0">Soon</span>` : `<span class="verified-badge shrink-0">${ICON.badgeCheck}</span>`}
            </span>
            <span class="text-xs mt-1 block" style="color:var(--ink-faint)">${meta}</span>
          </a>
          ${
            soon
              ? `<a href="vendor.html?v=${v.slug}" class="btn btn-ghost !min-h-[36px] !px-4 !text-xs shrink-0">Preview</a>`
              : `<button class="btn btn-primary follow-btn !min-h-[36px] !px-4 !text-xs shrink-0 ${following ? "is-following" : ""}" data-follow="${v.slug}" aria-pressed="${following}">${following ? "Following" : "Follow"}</button>`
          }
        </div>`;
      })
      .join("");
    wireFollowButtons(strip);
    hookImageFallbacks(strip);
  }

  /* ----------------------------------------------------------
     Page: CATEGORY (subcategory drill-down)
  ---------------------------------------------------------- */
  function initCategory() {
    const cat = categoryBySlug(param("cat")) || CATEGORIES[0];
    document.title = `${cat.label} — Trusted Sellers`;

    qs("#category-hero").innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <nav class="text-xs mb-6 flex items-center gap-2" style="color:var(--ink-faint)" aria-label="Breadcrumb">
          <a href="index.html" class="link-line">Home</a><span>/</span>
          <span style="color:var(--ink-muted)">${esc(cat.label)}</span>
        </nav>
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="section-title text-4xl sm:text-5xl mb-2">${esc(cat.label)}</h1>
            <p class="text-sm max-w-md" style="color:var(--ink-muted)">${esc(cat.blurb)} Pick a category below, then order straight from the seller.</p>
          </div>
          <a href="shop.html?cat=${encodeURIComponent(cat.slug)}" class="link-line text-sm font-medium" style="color:var(--ink-muted)">View all in ${esc(cat.label)}</a>
        </div>
      </div>`;

    const subs = subcategoriesOf(cat.slug);
    qs("#subcat-grid").innerHTML = subs
      .map(
        (s, i) => `
      <a class="cat-tile reveal" style="--reveal-delay:${i * 50}ms" href="shop.html?cat=${encodeURIComponent(cat.slug)}&sub=${encodeURIComponent(s.name)}" aria-label="Browse ${attr(s.name)}, ${s.count} item${s.count === 1 ? "" : "s"}">
        <span class="cat-tile-media">
          <img src="${attr(s.image)}" alt="" loading="lazy" />
          <span class="cat-tile-veil"></span>
        </span>
        <span class="cat-tile-body">
          <span class="block text-base font-semibold">${esc(s.name)}</span>
          <span class="block text-xs mt-0.5" style="color:var(--ink-faint)">${s.count} item${s.count === 1 ? "" : "s"}</span>
        </span>
        <span class="cat-tile-arrow">${ICON.arrowUpRight}</span>
      </a>`
      )
      .join("");

    /* Other categories strip */
    qs("#other-cats").innerHTML = CATEGORIES.filter((c) => c.slug !== cat.slug)
      .map(
        (c) => `
      <a href="category.html?cat=${encodeURIComponent(c.slug)}" class="filter-pill">${esc(c.label)}</a>`
      )
      .join("");

    hookImageFallbacks();
  }

  /* ----------------------------------------------------------
     Page: SHOP
  ---------------------------------------------------------- */
  function initShop() {
    const grid = qs("#shop-grid");
    grid.className = DENSE_GRID;
    const countEl = qs("#shop-count");
    const state = {
      vendor: param("vendor") || "all",
      tag: param("tag") || "all",
      cat: param("cat") || "all",
      sub: param("sub") || "all",
      fav: param("fav") === "1",
      q: (param("q") || "").toLowerCase(),
      sort: "featured",
    };

    if (state.q) {
      const headerInput = qs("#header-search-input");
      if (headerInput) headerInput.value = param("q");
      qs("#shop-query-note").textContent = `Results for “${param("q")}”`;
    } else if (state.fav) {
      qs("h1.section-title").innerHTML = `Your <em>saved</em> items`;
      qs("#shop-query-note").textContent = "Everything you've hearted, across all sellers.";
    } else if (state.cat !== "all") {
      const c = categoryBySlug(state.cat);
      qs("#shop-query-note").textContent = state.sub !== "all" ? `${c ? c.label : state.cat} · ${state.sub}` : `Browsing ${c ? c.label : state.cat}`;
    }

    /* Category pills */
    qs("#cat-filters").innerHTML =
      `<button class="filter-pill" data-cat="all">All Categories</button>` +
      activeCategories().map((c) => `<button class="filter-pill" data-cat="${c.slug}">${esc(c.label)}</button>`).join("");

    /* Seller pills */
    qs("#vendor-filters").innerHTML =
      `<button class="filter-pill" data-vendor="all">All Sellers</button>` +
      Object.values(VENDORS)
        .map((v) => `<button class="filter-pill" data-vendor="${v.slug}">${esc(v.name)}</button>`)
        .join("");

    const subRow = qs("#subcat-filters");
    function renderSubPills() {
      if (state.cat === "all") {
        subRow.innerHTML = "";
        subRow.classList.add("hidden");
        return;
      }
      const c = categoryBySlug(state.cat);
      const subs = subcategoriesOf(state.cat);
      subRow.classList.remove("hidden");
      subRow.innerHTML =
        `<button class="filter-pill" data-sub="all">All ${esc(c ? c.label : state.cat)}</button>` +
        subs.map((s) => `<button class="filter-pill" data-sub="${attr(s.name)}">${esc(s.name)} <span style="color:var(--ink-faint)">${s.count}</span></button>`).join("");
    }

    function apply() {
      let list = [...PRODUCTS];
      if (state.fav) {
        const set = Favs.read();
        list = list.filter((p) => set.has(p.id));
        if (!list.length) {
          grid.innerHTML = `
            <div class="col-span-full text-center py-20">
              <span class="w-8 h-8 mx-auto mb-4 block" style="color:var(--ink-faint)">${ICON.heart}</span>
              <p class="text-lg font-semibold mb-2">Nothing saved yet</p>
              <p class="text-sm mb-6" style="color:var(--ink-muted)">Tap the heart on any product to keep it here.</p>
              <a href="shop.html" class="btn btn-primary">Browse Products</a>
            </div>`;
          countEl.textContent = "0 products";
          return;
        }
      }
      if (state.q) {
        list = list.filter((p) => {
          const v = VENDORS[p.vendor];
          return (
            p.name.toLowerCase().includes(state.q) ||
            p.material.toLowerCase().includes(state.q) ||
            p.category.toLowerCase().includes(state.q) ||
            p.subcategory.toLowerCase().includes(state.q) ||
            v.name.toLowerCase().includes(state.q) ||
            v.category.toLowerCase().includes(state.q)
          );
        });
      }
      if (state.cat !== "all") list = list.filter((p) => p.category === state.cat);
      if (state.sub !== "all") list = list.filter((p) => p.subcategory === state.sub);
      if (state.vendor !== "all") list = list.filter((p) => p.vendor === state.vendor);
      if (state.tag !== "all") list = list.filter((p) => p.tag === state.tag);
      if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
      if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
      if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);

      grid.innerHTML = list.length
        ? list.map((p, i) => productCard(p, (i % 6) * 30)).join("")
        : `<p class="col-span-full text-sm py-20 text-center" style="color:var(--ink-faint)">No products match. Loosen a filter or clear the search.</p>`;
      countEl.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
      qsa("[data-vendor]").forEach((b) => b.classList.toggle("is-active", b.dataset.vendor === state.vendor));
      qsa("[data-tag]").forEach((b) => b.classList.toggle("is-active", b.dataset.tag === state.tag));
      qsa("[data-cat]").forEach((b) => b.classList.toggle("is-active", b.dataset.cat === state.cat));
      qsa("[data-sub]").forEach((b) => b.classList.toggle("is-active", b.dataset.sub === state.sub));
      wireCardActions(grid);
      hookImageFallbacks(grid);
      observeReveals(grid);
    }

    qs("#cat-filters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      state.cat = b.dataset.cat;
      state.sub = "all";
      renderSubPills();
      apply();
    });
    subRow.addEventListener("click", (e) => {
      const b = e.target.closest("[data-sub]");
      if (!b) return;
      state.sub = b.dataset.sub;
      apply();
    });
    qs("#vendor-filters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-vendor]");
      if (!b) return;
      state.vendor = b.dataset.vendor;
      apply();
    });
    qs("#tag-filters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-tag]");
      if (!b) return;
      state.tag = b.dataset.tag;
      apply();
    });
    qs("#sort-select").addEventListener("change", (e) => {
      state.sort = e.target.value;
      apply();
    });

    renderSubPills();
    apply();
  }

  /* ----------------------------------------------------------
     Order buttons block (product / vendor)
  ---------------------------------------------------------- */
  function orderButtonsHTML(vendor, product) {
    const wd = (product && product.weidian) || null;
    const wa = waLink(vendor, product);
    const dc = discordLink(vendor);
    const yp = (product && product.yupoo) || vendor.yupooShop || null;
    const parts = [];
    if (wd)
      parts.push(
        `<a id="ord-wd" href="${attr(wd)}" target="_blank" rel="noopener" class="btn btn-weidian flex-1">${ICON.cart}<span>Buy on Weidian</span></a>`
      );
    if (wa)
      parts.push(
        `<a id="ord-wa" href="${wa}" target="_blank" rel="noopener" class="btn btn-whatsapp flex-1">${ICON.whatsapp}<span>${wd ? "Ask on WhatsApp" : "Order via WhatsApp"}</span></a>`
      );
    if (dc)
      parts.push(
        `<a id="ord-dc" href="${attr(dc)}" target="_blank" rel="noopener" class="btn btn-discord flex-1">${ICON.discord}<span>${wd ? "Ask on Discord" : "Order via Discord"}</span></a>`
      );
    if (yp)
      parts.push(
        `<a id="ord-yp" href="${attr(yp)}" target="_blank" rel="noopener" class="btn btn-yupoo flex-1">${ICON.gallery}<span>${product ? "View on Yupoo" : "Browse Yupoo shop"}</span></a>`
      );
    return parts.join("");
  }

  /* ----------------------------------------------------------
     Page: SELLER storefront
  ---------------------------------------------------------- */
  function initVendor() {
    const v = VENDORS[param("v")] || VENDORS.momokicks;
    document.title = `${v.name} — Trusted Sellers`;
    document.documentElement.style.setProperty("--accent", v.accent);

    if (v.comingSoon) {
      qs("#vendor-hero").innerHTML = `
        <div class="vendor-hero-wash border-b hairline" style="--accent:${v.accent}">
          <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center">
            <span class="seller-avatar !w-[80px] !h-[80px] mx-auto mb-6" style="border-color:${v.accent}"><img src="${attr(v.avatar)}" alt="" /></span>
            <span class="soon-pill mb-4 inline-block">Coming soon</span>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-3">${esc(v.name)}</h1>
            <p class="text-[15px] leading-relaxed mb-8 mx-auto max-w-xl" style="color:var(--ink-muted)">${esc(v.description)}</p>
            <p class="text-sm mb-8" style="color:var(--ink-faint)">${esc(v.category)} · this seller is being onboarded. Their catalog will appear here once it's live.</p>
            <a href="index.html" class="btn btn-ghost">Back to the sellers that are live</a>
          </div>
        </div>`;
      const products = qs("#vendor-products");
      if (products) products.innerHTML = "";
      return;
    }

    qs("#vendor-hero").innerHTML = `
      <div class="vendor-hero-wash border-b hairline" style="--accent:${v.accent}">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 grid lg:grid-cols-[1fr_380px] gap-10 items-center">
          <div>
            <div class="flex items-center gap-4 mb-5">
              <span class="seller-avatar !w-[72px] !h-[72px]" style="border-color:${v.accent}"><img src="${attr(v.avatar)}" alt="" /></span>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">${esc(v.name)}</h1>
                  <span class="verified-badge !text-sm">${ICON.badgeCheck}<span class="hidden sm:inline">Verified</span></span>
                </div>
                <p class="text-sm mt-1" style="color:var(--ink-faint)">${esc(v.category)} · ${esc(v.founded)}</p>
              </div>
            </div>
            <p class="text-[15px] leading-relaxed max-w-2xl mb-7" style="color:var(--ink-muted)">${esc(v.description)}</p>
            <div class="flex flex-wrap gap-3">
              ${orderButtonsHTML(v, null)}
              <button class="btn btn-ghost follow-btn ${Follows.has(v.slug) ? "is-following" : ""}" data-follow="${v.slug}" aria-pressed="${Follows.has(v.slug)}">${Follows.has(v.slug) ? "Following" : "Follow"}</button>
            </div>
            <div class="grid grid-cols-3 gap-4 max-w-md mt-8">
              ${v.stats
                .map(
                  ([n, l]) => `
                <div class="surface-card !rounded-xl p-4">
                  <p class="text-lg font-bold" style="color:${v.accent}">${esc(n)}</p>
                  <p class="text-xs mt-1 leading-snug" style="color:var(--ink-faint)">${esc(l)}</p>
                </div>`
                )
                .join("")}
            </div>
          </div>
          <div class="vendor-hero-media aspect-[4/3] lg:aspect-square hidden md:block">
            <img src="${attr(v.hero)}" alt="${attr(v.name)}" />
          </div>
        </div>
      </div>`;

    wireFollowButtons(qs("#vendor-hero"));

    const items = PRODUCTS.filter((p) => p.vendor === v.slug);
    const grid = qs("#vendor-grid");
    grid.className = DENSE_GRID;
    grid.innerHTML = items.map((p, i) => productCard(p, i * 40)).join("");
    qs("#vendor-grid-title").innerHTML = `Listings <span class="text-sm font-normal align-middle ml-2" style="color:var(--ink-faint)">${items.length} products</span>`;

    qs("#other-sellers").innerHTML = Object.values(VENDORS)
      .filter((o) => o.slug !== v.slug)
      .map(
        (o) => `
        <a href="vendor.html?v=${o.slug}" class="seller-card flex items-center gap-4" style="--accent:${o.accent}">
          <span class="seller-avatar"><img src="${attr(o.avatar)}" alt="" loading="lazy" /></span>
          <span class="min-w-0">
            <span class="flex items-center gap-1.5">
              <span class="text-sm font-semibold truncate">${esc(o.name)}</span>
              <span class="verified-badge shrink-0">${ICON.badgeCheck}</span>
            </span>
            <span class="text-xs block mt-0.5" style="color:var(--ink-faint)">${esc(o.category)}</span>
          </span>
          <span class="w-4 h-4 shrink-0 ml-auto" style="color:var(--ink-faint)">${ICON.arrowUpRight}</span>
        </a>`
      )
      .join("");

    wireCardActions();
    hookImageFallbacks();
  }

  /* ----------------------------------------------------------
     Page: PRODUCT detail
  ---------------------------------------------------------- */
  /* Model box: colorway gallery + one order set */
  function initModelProduct(p, v) {
    const base = baseCurOf(p);
    const fromLabel = p.price != null ? money(p.price, base) : null;
    const dc = discordLink(v);

    qs("#product-root").innerHTML = `
      <nav class="text-xs mb-8 flex items-center gap-2 flex-wrap" style="color:var(--ink-faint)" aria-label="Breadcrumb">
        <a href="index.html" class="link-line">Home</a><span>/</span>
        <a href="category.html?cat=${encodeURIComponent(p.category)}" class="link-line">${esc((categoryBySlug(p.category) || {}).label || p.category)}</a><span>/</span>
        <a href="shop.html?cat=${encodeURIComponent(p.category)}&sub=${encodeURIComponent(p.subcategory)}" class="link-line">${esc(p.subcategory)}</a><span>/</span>
        <span style="color:var(--ink-muted)">${esc(p.name)}</span>
      </nav>
      <div class="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div class="product-media !rounded-2xl !aspect-square" style="--accent:${v.accent}">
            <img id="pdp-image" src="${attr(p.colorways[0].image)}" alt="${attr(p.name)}" />
          </div>
          <p class="text-xs font-semibold mt-4 mb-2 flex items-center gap-1.5" style="color:var(--ink-muted)"><span class="w-3.5 h-3.5 block">${ICON.gallery}</span>Colourways (${p.totalColorways})</p>
          <div id="cw-strip" class="qc-thumbs" aria-label="Colourways"></div>
        </div>
        <div class="lg:pt-2">
          <a href="vendor.html?v=${v.slug}" class="inline-flex items-center gap-2 mb-4 group">
            <span class="seller-avatar !w-8 !h-8"><img src="${attr(v.avatar)}" alt="" /></span>
            <span class="text-sm font-medium transition-colors duration-200 group-hover:text-white" style="color:var(--ink-muted)">${esc(v.name)}</span>
            <span class="verified-badge">${ICON.badgeCheck}</span>
          </a>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-3">${esc(p.name)}</h1>
          <div class="flex items-center gap-3 mb-5">
            <span class="rating !text-sm"><span class="star !w-4 !h-4">${ICON.star}</span>${p.rating.toFixed(1)}</span>
            <span class="text-sm" style="color:var(--ink-faint)">${p.reviews} reviews · ${p.totalColorways} colourways</span>
          </div>
          <p id="pdp-price" class="text-3xl font-bold mb-1">${fromLabel ? "From " + fromLabel : "Message for price"}</p>
          <p class="text-sm mb-6" style="color:var(--ink-faint)">Selected: <span id="pdp-selected" style="color:var(--ink)">choose a colourway below</span></p>
          <p class="text-[15px] leading-relaxed mb-6 max-w-[60ch]" style="color:var(--ink-muted)">${esc(p.description)}</p>

          <div class="flex flex-col sm:flex-row gap-3 mb-3">
            <a id="ord-wa" href="#" target="_blank" rel="noopener" class="btn btn-whatsapp flex-1">${ICON.whatsapp}<span>Order via WhatsApp</span></a>
            ${dc ? `<a id="ord-dc" href="${attr(dc)}" target="_blank" rel="noopener" class="btn btn-discord flex-1">${ICON.discord}<span>Order via Discord</span></a>` : ""}
            <a id="ord-yp" href="${attr(p.yupoo)}" target="_blank" rel="noopener" class="btn btn-yupoo flex-1">${ICON.gallery}<span>View on Yupoo</span></a>
            <button id="pdp-fav" class="btn btn-ghost !px-4 shrink-0 ${Favs.has(p.id) ? "!text-[#f8717a] !border-[#f8717a]" : ""}" aria-label="${Favs.has(p.id) ? "Remove from saved" : "Save for later"}" aria-pressed="${Favs.has(p.id)}">
              <span class="w-5 h-5 block" ${Favs.has(p.id) ? 'style="fill:currentColor"' : ""}>${ICON.heart}</span>
              <span class="sm:hidden">Save</span>
            </button>
          </div>
          <p class="text-xs mb-8 flex items-center gap-1.5" style="color:var(--ink-faint)"><span class="w-3.5 h-3.5 block" style="color:var(--brand)">${ICON.badgeCheck}</span>Pick a colourway, then ordering opens a chat with ${esc(v.name)} pre-filled with that colourway.</p>

          <div class="border-t hairline">
            <details class="group py-4" open>
              <summary class="flex items-center justify-between cursor-pointer list-none text-sm font-semibold">What you get<span class="w-4 h-4 block transition-transform duration-200 group-open:rotate-45" style="color:var(--ink-faint)">${ICON.arrowUpRight}</span></summary>
              <ul class="mt-3 space-y-2">
                ${p.details.map((d) => `<li class="flex gap-2.5 text-sm" style="color:var(--ink-muted)"><span class="w-4 h-4 shrink-0 mt-0.5" style="color:${v.accent}">${ICON.check}</span>${esc(d)}</li>`).join("")}
              </ul>
            </details>
            <details class="group py-4 border-t hairline">
              <summary class="flex items-center justify-between cursor-pointer list-none text-sm font-semibold">Shipping & returns<span class="w-4 h-4 block transition-transform duration-200 group-open:rotate-45" style="color:var(--ink-faint)">${ICON.arrowUpRight}</span></summary>
              <p class="mt-3 text-sm leading-relaxed max-w-[60ch]" style="color:var(--ink-muted)">${esc(v.name)} ships tracked within 24-48h and confirms shipping and returns with you at order time. Every order is covered by the seller's own buyer protection.</p>
            </details>
            <details class="group py-4 border-t hairline">
              <summary class="flex items-center justify-between cursor-pointer list-none text-sm font-semibold">About this seller<span class="w-4 h-4 block transition-transform duration-200 group-open:rotate-45" style="color:var(--ink-faint)">${ICON.arrowUpRight}</span></summary>
              <p class="mt-3 text-sm leading-relaxed max-w-[60ch]" style="color:var(--ink-muted)">${esc(v.description)}</p>
            </details>
          </div>
        </div>
      </div>

      <section class="mt-16 pt-10 border-t hairline">
        <h2 class="section-title text-2xl sm:text-3xl mb-8">Reviews <span class="text-sm font-normal align-middle ml-2" style="color:var(--ink-faint)">${p.reviews} total</span></h2>
        <div class="grid lg:grid-cols-[260px_1fr] gap-10">
          <div>
            <div class="flex items-end gap-2 mb-5">
              <span class="text-5xl font-bold" style="font-variant-numeric:tabular-nums">${p.rating.toFixed(1)}</span>
              <span class="rating mb-2"><span class="star !w-4 !h-4">${ICON.star}</span>out of 5</span>
            </div>
            <div class="space-y-2">
              ${distributionFor(p.rating).map(([stars, pct]) => `
                <div class="dist-row"><span>${stars} ★</span><span class="dist-track"><span class="dist-fill" style="width:${pct}%"></span></span><span class="text-right">${pct}%</span></div>`).join("")}
            </div>
          </div>
          <div class="grid sm:grid-cols-3 gap-4">
            ${reviewsFor(p).map((r) => `
              <figure class="surface-card p-5 flex flex-col gap-3">
                <span class="inline-flex gap-0.5">${Array.from({ length: r.rating }, () => `<span class="w-3.5 h-3.5 block" style="color:var(--star)">${ICON.star}</span>`).join("")}</span>
                <blockquote class="text-sm leading-relaxed" style="color:var(--ink)">"${esc(r.text)}"</blockquote>
                <figcaption class="mt-auto pt-3 border-t hairline flex items-center justify-between gap-2"><span class="text-sm font-semibold">${esc(r.name)}</span><span class="text-xs" style="color:var(--ink-faint)">${esc(r.when)}</span></figcaption>
              </figure>`).join("")}
          </div>
        </div>
      </section>`;

    /* Colorway strip + selection */
    const strip = qs("#cw-strip");
    strip.innerHTML = p.colorways
      .map(
        (c, i) => `
      <button class="qc-thumb ${i === 0 ? "is-active" : ""}" data-i="${i}" title="${attr(c.name)}" aria-label="${attr(c.name)}">
        <img src="${attr(c.image)}" alt="${attr(c.name)}" loading="lazy" />
      </button>`
      )
      .join("");

    function selectCw(i) {
      const c = p.colorways[i];
      qs("#pdp-image").src = c.image;
      qs("#pdp-selected").textContent = c.name;
      qs("#pdp-price").textContent = c.price != null ? money(c.price, base) : fromLabel ? "From " + fromLabel : "Message for price";
      const synth = { name: p.name + " — " + c.name, price: c.price != null ? c.price : p.price, id: p.id, vendor: p.vendor };
      const wa = waLink(v, synth);
      if (wa) qs("#ord-wa").href = wa;
      qs("#ord-yp").href = c.album;
      qsa(".qc-thumb", strip).forEach((t, idx) => t.classList.toggle("is-active", idx === i));
    }
    strip.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]");
      if (!b) return;
      selectCw(Number(b.dataset.i));
    });
    selectCw(0);
    hookImageFallbacks(strip);

    qs("#pdp-fav").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const on = Favs.toggle(p.id);
      btn.classList.toggle("!text-[#f8717a]", on);
      btn.classList.toggle("!border-[#f8717a]", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.firstElementChild.style.fill = on ? "currentColor" : "none";
      showToast(on ? `${p.name} saved` : `${p.name} removed from saved`);
    });

    /* Related: same brand, then category */
    const related = [
      ...PRODUCTS.filter((x) => x.subcategory === p.subcategory && x.id !== p.id),
      ...PRODUCTS.filter((x) => x.category === p.category && x.subcategory !== p.subcategory),
    ]
      .filter((x, i, arr) => arr.findIndex((y) => y.id === x.id) === i && x.id !== p.id)
      .slice(0, 6);
    const rg = qs("#related-grid");
    rg.className = DENSE_GRID;
    rg.innerHTML = related.map((x, i) => productCard(x, i * 40)).join("");
    wireCardActions();
    hookImageFallbacks();
  }

  function initProduct() {
    const p = productById(param("id")) || PRODUCTS[0];
    const v = VENDORS[p.vendor];
    document.title = `${p.name} — ${v.name} · Trusted Sellers`;

    if (p.isModel) {
      initModelProduct(p, v);
      return;
    }

    qs("#product-root").innerHTML = `
      <nav class="text-xs mb-8 flex items-center gap-2 flex-wrap" style="color:var(--ink-faint)" aria-label="Breadcrumb">
        <a href="index.html" class="link-line">Home</a><span>/</span>
        <a href="category.html?cat=${encodeURIComponent(p.category)}" class="link-line">${esc((categoryBySlug(p.category) || {}).label || p.category)}</a><span>/</span>
        <a href="shop.html?cat=${encodeURIComponent(p.category)}&sub=${encodeURIComponent(p.subcategory)}" class="link-line">${esc(p.subcategory)}</a><span>/</span>
        <span style="color:var(--ink-muted)">${esc(p.name)}</span>
      </nav>
      <div class="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div id="pdp-media" class="product-media !rounded-2xl !aspect-square cursor-zoom-in" style="--accent:${v.accent}">
            ${p.batch || p.tag ? `<span class="tag-pill">${esc(p.batch || p.tag)}</span>` : ""}
            <img id="pdp-image" src="${attr(p.image)}" alt="${attr(p.name)}" />
            <span class="media-zoom"><span class="w-4 h-4 block">${ICON.gallery}</span>Tap to zoom</span>
          </div>
          <div id="pdp-thumbs" class="qc-thumbs mt-3"></div>
          ${
            p.yupoo
              ? `<a href="${attr(p.yupoo)}" target="_blank" rel="noopener" class="mt-3 surface-card p-4 flex items-center justify-between gap-3 transition-colors duration-200 hover:bg-[#232326]">
                   <span class="flex items-center gap-2 text-sm font-medium"><span class="w-4 h-4 block" style="color:var(--ink-muted)">${ICON.gallery}</span>See every colour on the Yupoo album</span>
                   <span class="w-4 h-4 block" style="color:var(--ink-faint)">${ICON.arrowUpRight}</span>
                 </a>`
              : ""
          }
        </div>
        <div class="lg:pt-2">
          <a href="vendor.html?v=${v.slug}" class="inline-flex items-center gap-2 mb-4 group">
            <span class="seller-avatar !w-8 !h-8"><img src="${attr(v.avatar)}" alt="" /></span>
            <span class="text-sm font-medium transition-colors duration-200 group-hover:text-white" style="color:var(--ink-muted)">${esc(v.name)}</span>
            <span class="verified-badge">${ICON.badgeCheck}</span>
          </a>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-3">${esc(p.name)}</h1>
          <div class="flex items-center gap-3 mb-5">
            <span class="text-sm" style="color:var(--ink-faint)">${esc(p.material)}</span>
          </div>
          <p id="pdp-price" class="text-3xl font-bold ${p.hasBatches ? "mb-1" : "mb-6"}">${p.price != null ? (p.priceFrom ? "From " : "") + money(p.price, baseCurOf(p)) : "Message for price"}</p>
          ${
            p.hasBatches
              ? `<p class="text-sm mb-4" style="color:var(--ink-faint)">Batch: <span id="pdp-selected-batch" style="color:var(--ink)">choose below</span></p>
                 <div class="mb-6">
                   <p class="text-xs font-semibold mb-2" style="color:var(--ink-muted)">Choose your batch <span style="color:var(--ink-faint)">· pricier = better quality</span></p>
                   <div id="batch-strip" class="flex flex-wrap gap-2">
                     ${p.batches
                       .map((b, i) => `<button class="filter-pill" data-batch="${i}">${esc(b.code)}${b.price != null ? " · " + money(b.price, baseCurOf(p)) : " · Ask"}</button>`)
                       .join("")}
                   </div>
                 </div>`
              : ""
          }
          <p class="text-[15px] leading-relaxed mb-6 max-w-[60ch]" style="color:var(--ink-muted)">${esc(p.description)}</p>

          <div class="flex flex-col sm:flex-row gap-3 mb-3">
            ${orderButtonsHTML(v, p)}
            <button id="pdp-fav" class="btn btn-ghost !px-4 shrink-0 ${Favs.has(p.id) ? "!text-[#f8717a] !border-[#f8717a]" : ""}" aria-label="${Favs.has(p.id) ? "Remove from saved" : "Save for later"}" aria-pressed="${Favs.has(p.id)}">
              <span class="w-5 h-5 block" ${Favs.has(p.id) ? 'style="fill:currentColor"' : ""}>${ICON.heart}</span>
              <span class="sm:hidden">Save</span>
            </button>
          </div>
          <p class="text-xs mb-8 flex items-center gap-1.5" style="color:var(--ink-faint)"><span class="w-3.5 h-3.5 block" style="color:var(--brand)">${ICON.badgeCheck}</span>Ordering opens a chat with ${esc(v.name)}. They confirm stock, size and payment directly.</p>

          <div class="border-t hairline">
            <details class="group py-4" open>
              <summary class="flex items-center justify-between cursor-pointer list-none text-sm font-semibold">What you get<span class="w-4 h-4 block transition-transform duration-200 group-open:rotate-45" style="color:var(--ink-faint)">${ICON.arrowUpRight}</span></summary>
              <ul class="mt-3 space-y-2">
                ${p.details
                  .map(
                    (d) =>
                      `<li class="flex gap-2.5 text-sm" style="color:var(--ink-muted)"><span class="w-4 h-4 shrink-0 mt-0.5" style="color:${v.accent}">${ICON.check}</span>${esc(d)}</li>`
                  )
                  .join("")}
              </ul>
            </details>
            <details class="group py-4 border-t hairline">
              <summary class="flex items-center justify-between cursor-pointer list-none text-sm font-semibold">Shipping & returns<span class="w-4 h-4 block transition-transform duration-200 group-open:rotate-45" style="color:var(--ink-faint)">${ICON.arrowUpRight}</span></summary>
              <p class="mt-3 text-sm leading-relaxed max-w-[60ch]" style="color:var(--ink-muted)">${esc(v.name)} ships tracked within 24-48h and confirms shipping and returns with you at order time. Every order is covered by the seller's own buyer protection.</p>
            </details>
            <details class="group py-4 border-t hairline">
              <summary class="flex items-center justify-between cursor-pointer list-none text-sm font-semibold">About this seller<span class="w-4 h-4 block transition-transform duration-200 group-open:rotate-45" style="color:var(--ink-faint)">${ICON.arrowUpRight}</span></summary>
              <p class="mt-3 text-sm leading-relaxed max-w-[60ch]" style="color:var(--ink-muted)">${esc(v.description)}</p>
            </details>
          </div>
        </div>
      </div>`;

    /* Photo gallery: main image + colourway thumbnails + lightbox */
    const gallery = (p.gallery && p.gallery.length ? p.gallery : [p.image]).filter(Boolean);
    let curImg = 0;
    const mainImg = qs("#pdp-image");
    const thumbs = qs("#pdp-thumbs");
    const setImg = (i) => {
      curImg = (i + gallery.length) % gallery.length;
      mainImg.src = gallery[curImg];
      qsa(".qc-thumb", thumbs).forEach((t, idx) => t.classList.toggle("is-active", idx === curImg));
    };
    if (gallery.length > 1) {
      thumbs.innerHTML = gallery
        .map((src, i) => `<button class="qc-thumb ${i === 0 ? "is-active" : ""}" data-g="${i}" aria-label="Photo ${i + 1}"><img src="${attr(src)}" alt="" loading="lazy" /></button>`)
        .join("");
      thumbs.addEventListener("click", (e) => {
        const b = e.target.closest("[data-g]");
        if (b) setImg(Number(b.dataset.g));
      });
    } else {
      thumbs.remove();
    }
    qs("#pdp-media").addEventListener("click", () => Lightbox.open(gallery, curImg));

    /* Save for later */
    qs("#pdp-fav").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const on = Favs.toggle(p.id);
      btn.classList.toggle("!text-[#f8717a]", on);
      btn.classList.toggle("!border-[#f8717a]", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on ? "Remove from saved" : "Save for later");
      btn.firstElementChild.style.fill = on ? "currentColor" : "none";
      showToast(on ? `${p.name} saved` : `${p.name} removed from saved`);
    });

    /* Batch selector (Momokicks): pick best vs budget batch */
    if (p.hasBatches) {
      const base = baseCurOf(p);
      const strip = qs("#batch-strip");
      const selectBatch = (i) => {
        const b = p.batches[i];
        if (b.image) qs("#pdp-image").src = b.image;
        qs("#pdp-selected-batch").textContent = b.code + (b.onRequest ? " · price on request" : "");
        qs("#pdp-price").textContent = b.price != null ? money(b.price, base) : "Price on request";
        const synth = { name: p.name + " — " + b.code + " batch", price: b.price != null ? b.price : p.price, id: p.id, vendor: p.vendor };
        const wd = qs("#ord-wd");
        if (wd) {
          if (!b.onRequest && b.weidian) {
            wd.href = b.weidian;
            wd.querySelector("span").textContent = "Buy " + b.code + " on Weidian";
          } else {
            const ask = waLink(v, synth) || (v.whatsapp ? "https://wa.me/" + v.whatsapp : (v.discord || "#"));
            wd.href = ask;
            wd.querySelector("span").textContent = (b.price != null ? "Order " + b.code + " · message" : "Ask price · " + b.code);
          }
        }
        const wa = qs("#ord-wa");
        if (wa) {
          const l = waLink(v, synth);
          if (l) wa.href = l;
        }
        qsa("[data-batch]", strip).forEach((el, idx) => el.classList.toggle("is-active", idx === i));
      };
      strip.addEventListener("click", (e) => {
        const b = e.target.closest("[data-batch]");
        if (b) selectBatch(Number(b.dataset.batch));
      });
      selectBatch(0);
    }

    /* Related: same subcategory first, then category, then seller */
    const related = [
      ...PRODUCTS.filter((x) => x.subcategory === p.subcategory && x.id !== p.id),
      ...PRODUCTS.filter((x) => x.category === p.category && x.subcategory !== p.subcategory),
      ...PRODUCTS.filter((x) => x.vendor === p.vendor && x.category !== p.category),
    ]
      .filter((x, i, arr) => arr.findIndex((y) => y.id === x.id) === i && x.id !== p.id)
      .slice(0, 6);
    const rg = qs("#related-grid");
    rg.className = DENSE_GRID;
    rg.innerHTML = related.map((x, i) => productCard(x, i * 40)).join("");
    wireCardActions();
    hookImageFallbacks();
  }

  /* ----------------------------------------------------------
     Boot
  ---------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    injectChrome();
    renderFavBadge();
    const page = pageName();
    if (page === "home") initHome();
    if (page === "category") initCategory();
    if (page === "shop") initShop();
    if (page === "vendor") initVendor();
    if (page === "product") initProduct();
    hookImageFallbacks();
    observeReveals();
  });
})();
