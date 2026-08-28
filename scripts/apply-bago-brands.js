#!/usr/bin/env node
/* Apply brand names to Bagoasis bags using the Yupoo brand-category
   album lists (captured from the live SPA). Prepends the brand to each
   bag name and adds a `brand` field. Re-writes assets/js/bago-catalog.js. */
const fs = require("fs");
const path = require("path");
const CAT = path.resolve(__dirname, "../assets/js/bago-catalog.js");
const brandmap = JSON.parse(fs.readFileSync("/tmp/brandmap.json", "utf8"));

const BRAND_LABEL = { Goyard: "Goyard", LV: "Louis Vuitton", Burberry: "Burberry" };
const idToBrand = {};
for (const [brand, ids] of Object.entries(brandmap))
  ids.forEach((id) => (idToBrand[id] = BRAND_LABEL[brand] || brand));

const raw = fs.readFileSync(CAT, "utf8");
const banner = raw.split("\n")[0];
const sb = {};
new Function("g", raw + "\ng.B = BAGO_RAW;")(sb);
const B = sb.B;

let branded = 0;
const counts = {};
for (const r of B) {
  const albumId = r.id.replace("bago-", "");
  const brand = idToBrand[albumId];
  if (!brand) continue;
  r.brand = brand;
  if (!r.n.startsWith(brand)) r.n = `${brand} ${r.n}`;
  counts[brand] = (counts[brand] || 0) + 1;
  branded++;
}

fs.writeFileSync(CAT, `${banner}\nvar BAGO_RAW = ${JSON.stringify(B)};\n`);
console.log("Branded", branded, "of", B.length, "bags:", JSON.stringify(counts));
