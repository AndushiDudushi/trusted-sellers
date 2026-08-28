#!/usr/bin/env node
/* ============================================================
   One-off catalog fixes:
   1) Duplicate Momokick product IDs (same Weidian itemID reused
      for different shoes). Drop the genuine duplicates; make the
      rest unique so every product is reachable.
   2) Clean stray Chinese characters left in a few PJS colour names.
   Rewrites assets/js/catalog-data.js, preserving banner + both arrays.
   ============================================================ */
const fs = require("fs");
const path = require("path");
const CATALOG = path.resolve(__dirname, "../assets/js/catalog-data.js");

const raw = fs.readFileSync(CATALOG, "utf8");
const banner = raw.split("\n")[0];
const sb = {};
new Function("g", raw + "\ng.MOMO = MOMO_RAW; g.PJS = PJS_RAW;")(sb);
const MOMO = sb.MOMO, PJS = sb.PJS;

/* --- 1) de-duplicate Momokick ids --- */
// IDs where the extra row is a genuine duplicate shoe -> keep the one WITH a
// Yupoo link, drop the rest.
const TRUE_DUP = new Set(["momo-7275278406", "momo-7279273396"]);

const counts = {};
MOMO.forEach((r) => (counts[r.id] = (counts[r.id] || 0) + 1));

const seen = {};
const kept = [];
const report = [];
for (const r of MOMO) {
  if ((counts[r.id] || 0) < 2) { kept.push(r); continue; }
  seen[r.id] = (seen[r.id] || 0) + 1;
  const n = seen[r.id];
  if (n === 1) { kept.push(r); continue; } // first occurrence keeps the id
  if (TRUE_DUP.has(r.id)) { report.push(`  DROP  ${r.id}  "${r.n}" (duplicate)`); continue; }
  const newId = `${r.id}-${n}`;
  report.push(`  RENAME ${r.id} -> ${newId}  "${r.n}"  (shares Weidian item — verify link)`);
  r.id = newId;
  kept.push(r);
}
MOMO.length = 0;
MOMO.push(...kept);

/* --- 2) clean PJS colour names --- */
const NAME_FIX = [ [/酒\s*Red/g, "Wine Red"], [/宝\s*Blue/g, "Royal Blue"] ];
let nameFixes = 0;
for (const r of PJS) {
  let n = r.n;
  NAME_FIX.forEach(([re, to]) => (n = n.replace(re, to)));
  n = n.replace(/[一-鿿]/g, "").replace(/\s{2,}/g, " ").trim();
  if (n !== r.n) { report.push(`  NAME  ${r.id}  "${r.n}" -> "${n}"`); r.n = n; nameFixes++; }
}

const out = `${banner}\nvar MOMO_RAW = ${JSON.stringify(MOMO)};\nvar PJS_RAW = ${JSON.stringify(PJS)};\n`;
fs.writeFileSync(CATALOG, out);
console.log(report.join("\n"));
console.log(`\nMomo rows now ${MOMO.length}. PJS name fixes ${nameFixes}.`);
