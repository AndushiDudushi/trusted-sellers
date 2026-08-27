#!/usr/bin/env node
/* ============================================================
   Link unlinked Momokick products to their Yupoo category.
   ------------------------------------------------------------
   64 products carry no Yupoo link. We map each to the seller's
   real brand/model category (IDs taken from the live Yupoo
   category tree) so they get a proper "View on Yupoo" target
   and a colourway gallery. Only confident brand/model matches
   are linked; anything else is left cover-only on purpose
   (a wrong-brand gallery is worse than none).

   Patches assets/js/catalog-data.js in place (adds "y":…).
   ============================================================ */
const fs = require("fs");
const path = require("path");

const CATALOG = path.resolve(__dirname, "../assets/js/catalog-data.js");
const catUrl = (id) => `https://momokick.x.yupoo.com/categories/${id}?isSubCate=true`;

/* Brand -> category id (from the live tree). */
const BRAND = {
  balenciaga: "4863506",
  dior: "4976900",
  yeezy: "4976855",
  "off-white": "4976899",
  offwhite: "4976899",
  amiri: "4976903",
  "louis vuitton": "4976904",
  lv: "4976904",
  gucci: "4976955",
  chanel: "4994082",
  balmain: null, bape: null, hoka: null, alo: null, ysl: null,
  valentino: null, mizuno: null, birkenstock: null, asics: null,
  louboutin: null, crocs: null, hermes: null, burberry: null,
};
/* Sub-brand routing that needs the product name, not just the brand column. */
const NAME_RULES = [
  [/new balance|nb\b/i, "4835108"],
  [/\bon\b|cloudtilt/i, "4984868"],
  [/cloudtilt/i, "657808"],
  [/air ?max|vapor ?max|scorpion/i, "4996049"],
  [/dior\s*b33/i, "669139"],
];

let src = fs.readFileSync(CATALOG, "utf8");
const sandbox = {};
new Function("g", src + "\ng.M = MOMO_RAW;")(sandbox);
const M = sandbox.M;

let linked = 0, skipped = 0;
const report = [];
for (const r of M) {
  if (r.y) continue;
  const brand = String(r.b || "").toLowerCase().trim();
  const name = String(r.n || "");
  let cat = null;
  for (const [re, id] of NAME_RULES) if (re.test(name) || re.test(brand)) { cat = id; break; }
  if (!cat && brand in BRAND) cat = BRAND[brand];
  if (!cat) { skipped++; report.push(`  skip  ${r.id}  ${r.b} · ${r.n}`); continue; }

  const url = catUrl(cat);
  const re = new RegExp('("id":"' + r.id + '"[\\s\\S]*?"im":"[^"]*")');
  if (re.test(src)) { src = src.replace(re, `$1,"y":"${url}"`); linked++; report.push(`  LINK  ${r.id}  ${r.b} · ${r.n}  -> ${cat}`); }
  else { skipped++; report.push(`  ERR   ${r.id} not found in source`); }
}

fs.writeFileSync(CATALOG, src);
console.log(report.join("\n"));
console.log(`\nLinked ${linked}, left cover-only ${skipped}.`);
