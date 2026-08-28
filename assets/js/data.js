/* ============================================================
   TRUSTED SELLERS — Showcase catalog data
   Momokicks & PJS are built from their real spreadsheets
   (see assets/js/catalog-data.js -> MOMO_RAW / PJS_RAW), which
   carry real prices, Weidian buy links, Yupoo links and images.
   Bagoasis (bags) is built from its Yupoo albums; MonsterTechnology
   (tech) from its Weidian shop. Reviving Fashion remains a coming-soon
   placeholder until its real catalog is added.
   ============================================================ */

const ORDER = {
  message(vendor, product) {
    return (
      `Hi ${vendor.name}! I'd like to order this from Trusted Sellers:\n\n` +
      `• ${product.name}\n` +
      `• Price: ${product.priceLabel}\n` +
      `• Ref: ${product.id}\n\n` +
      `Is it in stock?`
    );
  },
};

const VENDORS = {
  momokicks: {
    slug: "momokicks",
    name: "Momokicks",
    tagline: "Sneakers and grails. Every pair QC'd twice.",
    category: "Shoes",
    accent: "#F97316",
    monogram: "M",
    founded: "Selling since 2019",
    verified: true,
    followers: "12.4k",
    rating: 4.9,
    sales: "8,120",
    baseCurrency: "CNY",
    whatsapp: "8619905978182",
    discord: "https://discord.gg/dcDbp3ENG8",
    yupooShop: "https://momokick.x.yupoo.com",
    description:
      "Momokicks is the shoe wall of Trusted Sellers — Jordans, Air Max, designer grails and more. Buy directly on Weidian, or message the seller on WhatsApp or Discord.",
    stats: [
      ["130+", "Models"],
      ["Weidian", "Direct checkout"],
      ["Yupoo", "Full photo album"],
    ],
    avatar: "assets/img/momo/momo-7224182542.jpg",
    hero: "assets/img/momo/momo-7224182542.jpg",
  },
  pjs: {
    slug: "pjs",
    name: "PJS",
    tagline: "Budget-friendly Nike, QC-checked. Buy on Weidian.",
    category: "Nike",
    accent: "#D4FF3F",
    monogram: "P",
    founded: "Selling since 2021",
    verified: true,
    followers: "31.2k",
    rating: 4.8,
    sales: "15,860",
    baseCurrency: "CNY",
    whatsapp: "8618759063105",
    discord: null,
    yupooShop: "https://helloworld520.x.yupoo.com/albums",
    description:
      "PJS specialises in budget-friendly Nike (and a little Under Armour) at sharp prices, every listing with a direct Weidian buy link.",
    stats: [
      ["57", "Listings"],
      ["Nike", "Speciality"],
      ["¥60+", "From"],
    ],
    avatar: "assets/img/pjs/pjs-7820293953.jpg",
    hero: "assets/img/pjs/pjs-7820293953.jpg",
  },
  bagoasis: {
    slug: "bagoasis",
    name: "Bagoasis",
    tagline: "Designer bags — Goyard, LV, Hermès and more.",
    category: "Bags",
    accent: "#C084FC",
    monogram: "B",
    founded: "Selling since 2021",
    verified: true,
    baseCurrency: "CNY",
    whatsapp: null,
    discord: null,
    yupooShop: "https://zzxdk.x.yupoo.com/",
    weidianShop: "https://weidian.com/?userid=1834995463&spider_token=937e",
    description:
      "Bagoasis is the bag wall of Trusted Sellers — Goyard, LV, Hermès, Chanel, Dior, Gucci, YSL, Balenciaga and more, every piece photographed in-hand. Browse the full album on Yupoo, then order on the Bagoasis Weidian shop.",
    stats: [
      ["10+", "Brands"],
      ["Weidian", "Shop"],
      ["Yupoo", "Full albums"],
    ],
    avatar: "assets/img/bago/252015033/1.jpg",
    hero: "assets/img/bago/252015033/1.jpg",
  },
  reviving: {
    slug: "reviving",
    name: "Reviving Fashion",
    tagline: "Clothes worth a second lap. Vintage, streetwear, staples.",
    category: "Clothes",
    accent: "#34D399",
    monogram: "R",
    founded: "Joining soon",
    verified: true,
    comingSoon: true,
    followers: "9.8k",
    rating: 4.9,
    sales: "6,540",
    baseCurrency: "USD",
    whatsapp: null,
    discord: null,
    yupooShop: null,
    description:
      "Reviving Fashion hunts racks so you don't have to. Vintage tees, heavyweight crewnecks, workwear jackets and denim, all washed, measured flat, and photographed honestly.",
    stats: [
      ["6,540", "Orders shipped"],
      ["4.9★", "Average rating"],
      ["100%", "Measured flat"],
    ],
    avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop",
    hero: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop",
  },
  monstertech: {
    slug: "monstertech",
    name: "MonsterTechnology",
    tagline: "Apple, audio and gadgets — best-version tech, shipped from Shenzhen.",
    category: "Tech",
    accent: "#8B5CF6",
    monogram: "T",
    founded: "Ships from Shenzhen",
    verified: true,
    baseCurrency: "CNY",
    whatsapp: null,
    discord: null,
    yupooShop: null,
    weidianShop: "https://weidian.com/?userid=1633552672&spider_token=9bb1",
    description:
      "MonsterTechnology focuses on electronic products and only the best-version quality — Apple accessories, Beats, JBL and Harman Kardon audio, Dyson styling tools and power banks. Buy directly on the Weidian shop.",
    stats: [
      ["10+", "Products"],
      ["Weidian", "Direct checkout"],
      ["Best", "version quality"],
    ],
    avatar: "assets/img/monster/airpodsmax.jpg",
    hero: "assets/img/monster/airpodsmax.jpg",
  },
};

/* Top-level categories (home circles). Empty ones auto-hide. */
const CATEGORIES = [
  { slug: "Shoes", label: "Sneakers", blurb: "Jordans, Air Max, designer grails and more.", image: "assets/img/momo/momo-7224182542.jpg" },
  { slug: "Bags", label: "Bags", blurb: "Designer bags — Goyard, LV, Hermès, Chanel and more.", image: "assets/img/bago/252015033/1.jpg" },
  { slug: "Tech", label: "Tech", blurb: "Apple, audio and gadgets — best-version tech.", image: "assets/img/monster/airpodsmax.jpg" },
  { slug: "Boots", label: "Boots", blurb: "Leather boots built for the long haul.", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop" },
  { slug: "Tops", label: "Tops", blurb: "Hoodies, crewnecks and tees, measured flat.", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop" },
  { slug: "Outerwear", label: "Outerwear", blurb: "Jackets and coats, graded and honest.", image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=600&auto=format&fit=crop" },
  { slug: "Bottoms", label: "Bottoms", blurb: "Denim and trousers with real measurements.", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop" },
  { slug: "Audio", label: "Audio", blurb: "Headphones and earbuds, bench-tested.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop" },
  { slug: "Peripherals", label: "Setup", blurb: "Keyboards, mice and controllers, tested per unit.", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop" },
  { slug: "Watches", label: "Watches", blurb: "Timepieces, movement-tested before dispatch.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop" },
];

const _h = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/* Build Momokicks + PJS from the spreadsheet-derived raw arrays
   (MOMO_RAW / PJS_RAW live in assets/js/catalog-data.js). */
function _mkMomo(r, idx) {
  const h = _h(r.id);
  const batches = (r.bt || []).map((b) => ({
    code: b.c,
    price: b.p,
    weidian: b.w || null,
    image: b.im || r.im,
    onRequest: !!b.r,
  }));
  const priced = batches.filter((b) => b.price != null).map((b) => b.price);
  const from = priced.length ? Math.min(...priced) : null;
  const primary = batches.find((b) => b.price != null) || batches[0] || {};
  const multi = batches.length > 1;
  return {
    id: r.id,
    vendor: "momokicks",
    category: "Shoes",
    subcategory: r.b,
    name: r.n,
    price: from, // ¥ base (CNY), lowest priced batch = "From ¥X"
    priceFrom: multi,
    batches: batches,
    hasBatches: multi,
    weidian: primary.weidian || null,
    yupoo: r.y || null,
    batch: (batches[0] && batches[0].code) || null,
    tag: idx < 4 ? "New" : idx < 8 ? "Hot" : null,
    rating: +(4.6 + (h % 4) / 10).toFixed(1),
    reviews: 40 + (h % 300),
    material: multi ? batches.length + " batches available" : batches[0] && batches[0].code ? "Batch: " + batches[0].code : "QC checked twice",
    description:
      r.n +
      " from Momokicks. QC checked and photographed in-hand before it ships. Pick your batch below — pricier batches are higher quality. Buy directly on Weidian, or message the seller for budget-batch pricing. More colours on the Yupoo album.",
    details: [
      "Two-round QC before dispatch",
      "In-hand photos on request",
      "Ships double-boxed with fresh silica",
      r.y ? "More colours on the Yupoo album" : "Best & budget batch options",
    ],
    image: r.im,
    gallery: (typeof MOMO_GALLERIES !== "undefined" && MOMO_GALLERIES[r.id]) || [r.im],
  };
}

function _mkPjs(r, idx) {
  const h = _h(r.id);
  return {
    id: r.id,
    vendor: "pjs",
    category: "Shoes",
    subcategory: r.b,
    name: r.n,
    price: r.p, // ¥ base (CNY)
    weidian: r.w || null,
    yupoo: r.y || null,
    batch: r.c || null,
    colour: r.c || null,
    tag: idx < 4 ? "New" : null,
    rating: +(4.5 + (h % 4) / 10).toFixed(1),
    reviews: 20 + (h % 200),
    material: r.c ? "Colour: " + r.c : "Nike",
    description:
      r.n +
      " from PJS. Buy directly on Weidian — budget-friendly, QC-checked pairs shipped tracked.",
    details: ["QC-checked pair", "Direct Weidian checkout", "Ships tracked", "Message for size help"],
    image: r.im,
  };
}

/* Bagoasis — designer bags. One product per Yupoo album (r.t = bag type). */
function _mkBago(r, idx) {
  const h = _h(r.id);
  return {
    id: r.id,
    vendor: "bagoasis",
    category: "Bags",
    subcategory: r.t,
    name: r.n,
    price: r.p != null ? r.p : null, // ¥ base (CNY), from the Yupoo album title
    weidian: null, // no per-item Weidian link; vendor.weidianShop is used instead
    yupoo: r.y || null,
    tag: idx < 6 ? "New" : idx < 12 ? "Hot" : null,
    rating: +(4.6 + (h % 4) / 10).toFixed(1),
    reviews: 20 + (h % 180),
    material: r.t,
    description:
      r.n +
      " from Bagoasis. Photographed in-hand — swipe the gallery, or see every angle on the Yupoo album. Order by browsing the Bagoasis Weidian shop or messaging the seller.",
    details: ["QC photos before shipping", "More angles on the Yupoo album", "Ships tracked", "Message to confirm stock & colour"],
    image: r.im,
    gallery: (typeof BAGO_GALLERIES !== "undefined" && BAGO_GALLERIES[r.id]) || [r.im],
  };
}

const MOMOKICKS_PRODUCTS = (typeof MOMO_RAW !== "undefined" ? MOMO_RAW : []).map(_mkMomo);
const PJS_PRODUCTS = (typeof PJS_RAW !== "undefined" ? PJS_RAW : []).map(_mkPjs);
const BAGOASIS_PRODUCTS = (typeof BAGO_RAW !== "undefined" ? BAGO_RAW : []).map(_mkBago);

/* Demo products for the remaining two sellers (prices in USD). */
const OTHER_PRODUCTS = [
  {
    id: "rev-denim-jacket", vendor: "reviving", category: "Outerwear", subcategory: "Denim Jackets",
    name: "Vintage Denim Trucker Jacket", price: 68, tag: "Hot", rating: 4.9, reviews: 340,
    material: "14oz denim · broken-in",
    description: "A broken-in trucker with a perfect fade. Washed, repaired where needed, and measured flat. Each jacket is one of one.",
    details: ["14oz denim, natural fade", "Professionally washed", "Pit-to-pit & length listed", "One of one"],
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "rev-field-jacket", vendor: "reviving", category: "Outerwear", subcategory: "Bombers",
    name: "Vintage Bomber Jacket 'Rust'", price: 84, tag: null, rating: 4.8, reviews: 156,
    material: "Nylon shell · ribbed trims",
    description: "A vintage bomber in a deep rust colorway with ribbed trims. Sourced, deodorized, and graded a strong 8.5/10.",
    details: ["Vintage nylon flight shell", "Ribbed collar, cuffs & hem", "Condition graded 8.5/10", "Measured flat"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "rev-heavy-hoodie", vendor: "reviving", category: "Tops", subcategory: "Hoodies & Crewnecks",
    name: "Heavyweight Crewneck 450gsm", price: 52, tag: "New", rating: 4.8, reviews: 289,
    material: "450gsm loopback cotton",
    description: "A deadstock heavyweight blank crewneck in off-white. 450gsm loopback, boxy cut, pre-washed twice so there's no shrink left in it.",
    details: ["450gsm loopback cotton", "Pre-washed twice", "Boxy contemporary cut", "Deadstock, limited sizes"],
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "rev-tee-pack", vendor: "reviving", category: "Tops", subcategory: "Tees",
    name: "Revived Tee 3-Pack (Graded A)", price: 39, tag: "Bestseller", rating: 4.7, reviews: 511,
    material: "Assorted cotton · graded A",
    description: "Three grade-A vintage blanks in your size, washed, pressed and ready. Tell us your palette and we pick the pack.",
    details: ["3 graded-A vintage tees", "Washed & pressed", "Choose light / dark / mixed", "Sized by real measurements"],
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "rev-jeans", vendor: "reviving", category: "Bottoms", subcategory: "Jeans",
    name: "Straight-Leg Jeans '90s Wash", price: 58, tag: "New", rating: 4.8, reviews: 198,
    material: "Rigid denim · 90s wash",
    description: "A true '90s straight leg in an honest mid wash. Waist and inseam are measured flat on every single pair, no size-tag lottery.",
    details: ["Rigid non-stretch denim", "Authentic 90s mid wash", "Waist/inseam measured flat", "One of one per listing"],
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "rev-overcoat", vendor: "reviving", category: "Outerwear", subcategory: "Coats",
    name: "Wool Trench Coat 'Camel'", price: 129, tag: null, rating: 4.9, reviews: 87,
    material: "Wool blend · full lining",
    description: "A classic camel trench from the racks of Milan. Dry-cleaned, buttons relined, and graded 9/10.",
    details: ["Wool blend", "Fully lined", "Dry-cleaned before listing", "Condition graded 9/10"],
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "tech-airpodsmax", vendor: "monstertech", category: "Tech", subcategory: "Audio",
    name: "AirPods Max (Best Version)", price: 630, tag: "Hot", material: "Over-ear · ANC",
    description: "AirPods Max, best-version build. Focus-on-electronics quality from Monster Technology — buy directly on the Weidian shop.",
    details: ["Best-version quality", "Direct Weidian checkout", "Ships from Shenzhen", "Message to confirm colour"],
    image: "assets/img/monster/airpodsmax.jpg",
  },
  {
    id: "tech-dyson", vendor: "monstertech", category: "Tech", subcategory: "Styling",
    name: "Dyson HS05 Airwrap (Best Version)", price: 600, tag: "Hot", material: "Multi-styler set",
    description: "Dyson HS05 Airwrap styling set, best-version build with the full attachment set. Buy directly on the Weidian shop.",
    details: ["Best-version quality", "Full attachment set", "Direct Weidian checkout", "Ships from Shenzhen"],
    image: "assets/img/monster/dyson.gif",
  },
  {
    id: "tech-applepencil", vendor: "monstertech", category: "Tech", subcategory: "Apple",
    name: "Apple Pencil (Best Version)", price: 398, tag: "New", material: "Stylus · tilt & pressure",
    description: "Apple Pencil, best-version build. Focus-on-electronics quality from Monster Technology — buy directly on the Weidian shop.",
    details: ["Best-version quality", "Direct Weidian checkout", "Ships from Shenzhen", "Message to confirm model"],
    image: "assets/img/monster/applepencil.jpg",
  },
  {
    id: "tech-applewatch", vendor: "monstertech", category: "Tech", subcategory: "Apple",
    name: "Apple Watch (Best Version)", price: 320, tag: "New", material: "Smartwatch series",
    description: "Apple Watch series, best-version build. Pick your size and case on the Weidian shop.",
    details: ["Best-version quality", "Multiple sizes & cases", "Direct Weidian checkout", "Ships from Shenzhen"],
    image: "assets/img/monster/applewatch.gif",
  },
  {
    id: "tech-harmankardon", vendor: "monstertech", category: "Tech", subcategory: "Audio",
    name: "Harman Kardon Glass Speaker", price: 400, tag: null, material: "Desk speaker",
    description: "Harman Kardon glass-style desk speaker, best-version build. Buy directly on the Weidian shop.",
    details: ["Best-version quality", "Direct Weidian checkout", "Ships from Shenzhen", "Message to confirm model"],
    image: "assets/img/monster/harmankardon.gif",
  },
  {
    id: "tech-jbl", vendor: "monstertech", category: "Tech", subcategory: "Audio",
    name: "JBL Audio Speaker", price: 310, tag: null, material: "Portable speaker",
    description: "JBL-series portable audio, best-version build. Pick your model on the Weidian shop.",
    details: ["Best-version quality", "Direct Weidian checkout", "Ships from Shenzhen", "Message to confirm model"],
    image: "assets/img/monster/jbl.gif",
  },
  {
    id: "tech-beats", vendor: "monstertech", category: "Tech", subcategory: "Audio",
    name: "Beats Bluetooth Earphones", price: 300, tag: "Hot", material: "Wireless earphones",
    description: "Beats Bluetooth earphones collection, best-version build. Pick your model on the Weidian shop.",
    details: ["Best-version quality", "Direct Weidian checkout", "Ships from Shenzhen", "Message to confirm model"],
    image: "assets/img/monster/beats.gif",
  },
  {
    id: "tech-hairdryer", vendor: "monstertech", category: "Tech", subcategory: "Styling",
    name: "High-Speed Hair Dryer", price: 180, tag: null, material: "Imported motor",
    description: "High-speed hair dryer with an imported motor. Buy directly on the Weidian shop.",
    details: ["Imported high-speed motor", "Direct Weidian checkout", "Ships from Shenzhen", "Message to confirm colour"],
    image: "assets/img/monster/hairdryer.jpg",
  },
  {
    id: "tech-airpods", vendor: "monstertech", category: "Tech", subcategory: "Audio",
    name: "AirPods (Best Version)", price: 180, tag: "New", material: "Wireless earbuds",
    description: "AirPods series, best-version build. Pick your model on the Weidian shop.",
    details: ["Best-version quality", "Direct Weidian checkout", "Ships from Shenzhen", "Message to confirm model"],
    image: "assets/img/monster/airpods.jpg",
  },
  {
    id: "tech-powerbank", vendor: "monstertech", category: "Tech", subcategory: "Charging",
    name: "5000mAh Power Bank", price: 140, tag: null, material: "A-grade cell · fireproof casing",
    description: "5000mAh power bank with an A-grade power cell and a PE fireproof casing. Buy directly on the Weidian shop.",
    details: ["A-grade power cell", "PE fireproof casing", "Direct Weidian checkout", "Ships from Shenzhen"],
    image: "assets/img/monster/powerbank.jpg",
  },
];

/* Coming-soon sellers (Reviving, MonsterTech) hold their slot on the site
   but their demo products stay out of the live catalog until real inventory
   is added — this also auto-hides their placeholder categories. */
const PRODUCTS = MOMOKICKS_PRODUCTS.concat(
  PJS_PRODUCTS,
  BAGOASIS_PRODUCTS,
  OTHER_PRODUCTS.filter((p) => !(VENDORS[p.vendor] && VENDORS[p.vendor].comingSoon))
);

const QC_CONFIG = { endpoint: null, apiKey: null };

/* Reviews/testimonials intentionally omitted — no fabricated buyer feedback.
   Add real reviews here once you have them. */
