#!/usr/bin/env node
/* ============================================================
   Weidian price sync
   ------------------------------------------------------------
   Every Momokick batch and every PJS listing links to a Weidian
   item. Weidian embeds the real current price in the page as
   "itemLowPrice":<fen> (cents). We fetch each item, read that
   price, convert to yuan, and write it back into the catalog so
   the site shows the seller's actual current pricing.

   Safe by design: a listing is only updated when the fetch
   succeeds and the price is sane (¥20–¥20000). Failures keep the
   existing price. Prints an old -> new report and preserves the
   file's banner + both raw arrays.

   Usage: node scripts/price-weidian.js [--only momo|pjs|all]
   ============================================================ */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const CATALOG = path.resolve(__dirname, "../assets/js/catalog-data.js");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const only = (process.argv[process.argv.indexOf("--only") + 1]) || "all";
const MIN_YUAN = 20, MAX_YUAN = 20000;

const raw = fs.readFileSync(CATALOG, "utf8");
const banner = raw.split("\n")[0];
const sb = {};
new Function("g", raw + "\ng.MOMO = typeof MOMO_RAW!=='undefined'?MOMO_RAW:[]; g.PJS = typeof PJS_RAW!=='undefined'?PJS_RAW:[];")(sb);
const MOMO = sb.MOMO, PJS = sb.PJS;

const itemIdOf = (w) => { const m = /itemID=(\d+)/.exec(w || ""); return m ? m[1] : null; };
const sleep = (ms) => execFileSync("sleep", [String(ms / 1000)]);

/* price cache: itemID -> yuan | null */
const cache = new Map();
function fetchYuan(id) {
  if (cache.has(id)) return cache.get(id);
  let yuan = null;
  for (let attempt = 0; attempt < 2 && yuan == null; attempt++) {
    try {
      const html = execFileSync(
        "curl",
        ["-sSL", "-A", UA, "-H", "Referer: https://weidian.com/", "--max-time", "30", `https://weidian.com/item.html?itemID=${id}`],
        { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }
      ).replace(/&#34;/g, '"');
      const m = /"itemLowPrice":(\d+)/.exec(html);
      if (m) {
        const y = Math.round(parseInt(m[1], 10) / 100);
        if (y >= MIN_YUAN && y <= MAX_YUAN) yuan = y;
      }
    } catch (e) { /* retry */ }
    if (yuan == null) sleep(500);
  }
  cache.set(id, yuan);
  return yuan;
}

let changed = 0, kept = 0, failed = 0;
const report = [];

/* ---- Momokick: per-batch prices ---- */
if (only === "all" || only === "momo") {
  for (const r of MOMO) {
    for (const b of r.bt || []) {
      const id = itemIdOf(b.w);
      if (!id) continue;
      const y = fetchYuan(id);
      sleep(500);
      if (y == null) { failed++; report.push(`  FAIL  ${r.id} ${b.c}  (kept ${b.p})`); continue; }
      if (b.p !== y) { report.push(`  SET   ${r.id} ${b.c}  ${b.p} -> ${y}`); b.p = y; changed++; }
      else kept++;
    }
  }
}

/* ---- PJS: flat price ---- */
if (only === "all" || only === "pjs") {
  for (const r of PJS) {
    const id = itemIdOf(r.w);
    if (!id) continue;
    const y = fetchYuan(id);
    sleep(500);
    if (y == null) { failed++; report.push(`  FAIL  ${r.id}  (kept ${r.p})`); continue; }
    if (r.p !== y) { report.push(`  SET   ${r.id}  ${r.p} -> ${y}`); r.p = y; changed++; }
    else kept++;
  }
}

/* ---- rewrite catalog ---- */
const out = `${banner}\nvar MOMO_RAW = ${JSON.stringify(MOMO)};\nvar PJS_RAW = ${JSON.stringify(PJS)};\n`;
fs.writeFileSync(CATALOG, out);

console.log(report.join("\n"));
console.log(`\nUpdated ${changed}, unchanged ${kept}, failed ${failed}. Wrote ${CATALOG}`);
