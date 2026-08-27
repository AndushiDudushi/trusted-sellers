/* ============================================================
   TRUSTED SELLERS — Showcase catalog data
   Momokicks & PJS are built from their real spreadsheets
   (see assets/js/catalog-data.js -> MOMO_RAW / PJS_RAW), which
   carry real prices, Weidian buy links, Yupoo links and images.
   Reviving Fashion & MonsterTechnology remain demo until their
   real catalogs are added.
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
    discord: "https://discord.gg/momokicks",
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
    whatsapp: null,
    discord: null,
    yupooShop: null,
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
  reviving: {
    slug: "reviving",
    name: "Reviving Fashion",
    tagline: "Clothes worth a second lap. Vintage, streetwear, staples.",
    category: "Clothes",
    accent: "#34D399",
    monogram: "R",
    founded: "Selling since 2018",
    verified: true,
    followers: "9.8k",
    rating: 4.9,
    sales: "6,540",
    baseCurrency: "USD",
    whatsapp: "10000000003",
    discord: "https://discord.gg/your-reviving-invite",
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
    tagline: "Audio, peripherals and setups. Tested before it ships.",
    category: "Tech",
    accent: "#8B5CF6",
    monogram: "T",
    founded: "Selling since 2020",
    verified: true,
    followers: "18.7k",
    rating: 4.7,
    sales: "11,230",
    baseCurrency: "USD",
    whatsapp: "10000000004",
    discord: "https://discord.gg/your-monstertech-invite",
    yupooShop: null,
    description:
      "MonsterTechnology stocks the gear that survives its own test bench. Headphones, keyboards, mice and desk audio, every unit powered on and burn-tested before it goes in the box.",
    stats: [
      ["11,230", "Orders shipped"],
      ["4.7★", "Average rating"],
      ["100%", "Bench-tested"],
    ],
    avatar: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    hero: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
  },
};

/* Top-level categories (home circles). Empty ones auto-hide. */
const CATEGORIES = [
  { slug: "Shoes", label: "Sneakers", blurb: "Jordans, Air Max, designer grails and more.", image: "assets/img/momo/momo-7224182542.jpg" },
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

const MOMOKICKS_PRODUCTS = (typeof MOMO_RAW !== "undefined" ? MOMO_RAW : []).map(_mkMomo);
const PJS_PRODUCTS = (typeof PJS_RAW !== "undefined" ? PJS_RAW : []).map(_mkPjs);

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
    id: "tech-headphones", vendor: "monstertech", category: "Audio", subcategory: "Headphones",
    name: "Studio Over-Ear Headphones", price: 219, tag: "Bestseller", rating: 4.8, reviews: 764,
    material: "40mm drivers · ANC",
    description: "Flagship over-ears with ANC and a 40-hour battery. Every unit is powered on, firmware-updated and burn-tested before shipping.",
    details: ["Active noise cancelling", "40h battery, USB-C", "Firmware updated pre-ship", "Bench-tested, sealed after"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "tech-earbuds", vendor: "monstertech", category: "Audio", subcategory: "Earbuds",
    name: "True Wireless Earbuds Pro", price: 129, tag: "New", rating: 4.7, reviews: 432,
    material: "ANC · wireless charging",
    description: "Compact buds with adaptive ANC and a wireless charging case. Serial-verified stock with a full local warranty.",
    details: ["Adaptive ANC", "8+24h battery", "Wireless charging case", "Serial-verified, 2y warranty"],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "tech-keyboard", vendor: "monstertech", category: "Peripherals", subcategory: "Keyboards",
    name: "Mechanical Keyboard 75% Hot-Swap", price: 96, tag: "Hot", rating: 4.8, reviews: 601,
    material: "Gasket mount · hot-swap PCB",
    description: "A gasket-mounted 75% board with a hot-swap PCB and factory-lubed stabilizers. Test-typed and QC'd per unit.",
    details: ["Gasket mount, 75% layout", "Hot-swap 3/5-pin PCB", "Factory-lubed stabilizers", "Per-unit typing test"],
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "tech-mouse", vendor: "monstertech", category: "Peripherals", subcategory: "Mice",
    name: "Ultralight Gaming Mouse 49g", price: 64, tag: null, rating: 4.7, reviews: 388,
    material: "49g · 26k sensor",
    description: "49 grams, a flawless sensor, and a solid shell with no honeycomb. Click-tested and sensor-verified before boxing.",
    details: ["49g solid shell", "26,000 DPI sensor", "Click + sensor tested", "PTFE skates pre-fitted"],
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "tech-watch", vendor: "monstertech", category: "Watches", subcategory: "Watches",
    name: "Minimalist Quartz Watch 'Sand'", price: 174, tag: null, rating: 4.6, reviews: 254,
    material: "Sapphire glass · leather strap",
    description: "A clean minimalist quartz watch with sapphire glass and a tan leather strap. The movement is tested and timed before shipping.",
    details: ["Sapphire crystal glass", "Japanese quartz movement", "Genuine leather strap", "Timed & tested pre-ship"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "tech-controller", vendor: "monstertech", category: "Peripherals", subcategory: "Controllers",
    name: "Pro Wireless Controller", price: 79, tag: "Hot", rating: 4.8, reviews: 529,
    material: "Hall-effect sticks",
    description: "A pro controller with hall-effect sticks, so it never drifts. Stick-tested on the bench and sealed after inspection.",
    details: ["Hall-effect thumbsticks", "Zero-drift guarantee", "PC / console / mobile", "Bench stick-test per unit"],
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop",
  },
];

const PRODUCTS = MOMOKICKS_PRODUCTS.concat(PJS_PRODUCTS, OTHER_PRODUCTS);

const QC_CONFIG = { endpoint: null, apiKey: null };

const REVIEWS_WEAR = [
  { name: "Marek T.", rating: 5, when: "June 2026", text: "Exactly as photographed. The QC photos matched what arrived to the centimeter." },
  { name: "Aisha B.", rating: 5, when: "May 2026", text: "Seller sent QC photos before shipping and answered sizing questions within the hour." },
  { name: "Jonas W.", rating: 4, when: "June 2026", text: "Quality is great for the price. Runs slightly roomy, so check the size notes before ordering." },
  { name: "Priya N.", rating: 5, when: "April 2026", text: "Arrived double-boxed in four days. Condition was better than expected." },
  { name: "Tomás R.", rating: 4, when: "May 2026", text: "Color is a touch warmer in person than on the photos. Still very happy with it." },
  { name: "Elif D.", rating: 5, when: "July 2026", text: "Second order from this seller. Consistent quality both times, and tracking updated daily." },
];
const REVIEWS_GEAR = [
  { name: "Viktor S.", rating: 5, when: "June 2026", text: "Unit arrived firmware-updated and sealed after testing, exactly as promised." },
  { name: "Hana M.", rating: 5, when: "May 2026", text: "Works flawlessly. You can tell it was actually bench-tested." },
  { name: "Diego F.", rating: 4, when: "June 2026", text: "Solid build and fast shipping. Setup took five minutes." },
  { name: "Ingrid K.", rating: 5, when: "April 2026", text: "Serial checked out with the manufacturer and the warranty registered without issues." },
  { name: "Sam O.", rating: 4, when: "July 2026", text: "Does what it says. Packaging was heavily padded, no rattles, no scuffs." },
  { name: "Mateo L.", rating: 5, when: "May 2026", text: "Asked two questions before buying and got detailed answers with photos both times." },
];

const TESTIMONIALS = [
  { quote: "Bought a Jordan from Momokicks straight on Weidian, and the Yupoo album showed every colour first. QC photos landed before it shipped.", name: "Dario M.", rating: 5, meta: "Verified buyer · 14 orders" },
  { quote: "PJS Nike prices are unreal and the Weidian checkout was one tap. Pair arrived exactly like the photo.", name: "Lena K.", rating: 5, meta: "Verified buyer · 6 orders" },
  { quote: "Messaged Momokicks on Discord about sizing, got an answer in minutes, then ordered. Already back for more.", name: "Yusuf A.", rating: 5, meta: "Verified buyer · 9 orders" },
];
