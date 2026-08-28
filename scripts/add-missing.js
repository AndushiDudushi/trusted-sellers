#!/usr/bin/env node
/* ============================================================
   Add the Yupoo items that were never posted:
   - Bagoasis: 14 Celine + 9 Burberry albums (no price in Yupoo)
   - PJS: the unlinked albums (price + name from the album title;
     skips info albums like "Tuto pour commander" / discord)
   Downloads photos, appends to the catalog + gallery files.
   ============================================================ */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const CAP = 6, SIZE = "medium";

const curl = (url, out, ref) => {
  const a = ["-sSL", "--fail", "-A", UA, "-H", `Referer: ${ref}`, "--max-time", "40"];
  if (out) a.push("-o", out);
  a.push(url);
  return execFileSync("curl", a, out ? { stdio: "ignore" } : { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
};
const sleep = (ms) => execFileSync("sleep", [String(ms / 1000)]);
const decode = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/* Pull og:title + photo hashes from a single (SSR) album page. */
function album(shop, id) {
  const ref = `https://${shop}.x.yupoo.com/`;
  const html = curl(`https://${shop}.x.yupoo.com/albums/${id}?uid=1`, null, ref);
  const tM = html.match(/og:title" content="([^"]*)"/);
  const title = tM ? decode(tM[1]).split("| 相册")[0].trim() : "";
  const re = new RegExp(`photo\\.yupoo\\.com/${shop}/([a-f0-9]+)/`, "g");
  const hashes = [...new Set([...html.matchAll(re)].map((m) => m[1]))];
  return { title, hashes };
}
function download(shop, id, hashes, dir, relBase) {
  fs.mkdirSync(dir, { recursive: true });
  const ref = `https://${shop}.x.yupoo.com/`;
  const rel = [];
  hashes.slice(0, CAP).forEach((h, i) => {
    const file = path.join(dir, `${i + 1}.jpg`);
    const r = `${relBase}/${i + 1}.jpg`;
    if (fs.existsSync(file) && fs.statSync(file).size > 2000) { rel.push(r); return; }
    try { curl(`https://photo.yupoo.com/${shop}/${h}/${SIZE}.jpg`, file, ref); if (fs.statSync(file).size > 2000) rel.push(r); else fs.unlinkSync(file); } catch (e) {}
    sleep(100);
  });
  return rel;
}

/* ---------------- BAGOASIS: Celine + Burberry ---------------- */
const CELINE = ["251109975","251109891","251109799","251109712","251109650","251109489","251109124","251109050","251108941","251108811","251108227","251108126","251108033","251107816"];
const brandmap = JSON.parse(fs.readFileSync("/tmp/brandmap.json", "utf8"));
const BURBERRY = brandmap.Burberry || [];

const bagoAdds = [];
const bagoGal = {};
for (const [brand, ids] of [["Celine", CELINE], ["Burberry", BURBERRY]]) {
  for (const id of ids) {
    let info;
    try { info = album("zzxdk", id); } catch (e) { console.log(`  ! bago ${id} failed`); continue; }
    const code = info.title || id;
    const dir = path.join(ROOT, "assets/img/bago", id);
    const rel = download("zzxdk", id, info.hashes, dir, `assets/img/bago/${id}`);
    if (!rel.length) { console.log(`  ! bago ${id} no photos`); continue; }
    bagoAdds.push({ id: `bago-${id}`, n: `${brand} ${code}`, t: brand, p: null, y: `https://zzxdk.x.yupoo.com/albums/${id}?uid=1`, im: rel[0], brand });
    bagoGal[`bago-${id}`] = rel;
    console.log(`  + Bagoasis ${brand} ${code} (${rel.length} photos)`);
    sleep(120);
  }
}

/* ---------------- PJS: unlinked albums ---------------- */
const pjsMissing = JSON.parse(fs.readFileSync("/tmp/pjs_missing.json", "utf8"));
const INFO = /tuto|discord|server|community|commander|announce|whatsapp|telegram|group|公告|comment|paypal|reduction|promo|aliexpress|dhgate/i;
const pjsAdds = [];
const pjsGal = {};
for (const id of pjsMissing) {
  let info;
  try { info = album("helloworld520", id); } catch (e) { console.log(`  ! pjs ${id} failed`); continue; }
  const raw = info.title;
  const priceM = raw.match(/(\d+)\s*CNY/i);
  const price = priceM ? +priceM[1] : null;
  // Products always carry a price; albums without one are info/announcements -> skip.
  if (!price || INFO.test(raw)) { console.log(`  skip pjs ${id} (${raw.slice(0, 44)})`); continue; }
  // name = the product segment (drop price / emoji / 相册 / pure-number segments)
  let name = raw.split(/[|｜]/).map((s) => s.trim()).filter((s) => s && !/CNY|€|💰|相册/.test(s) && !/^\d+(\.\d+)?$/.test(s)).pop() || "";
  if (name.length < 3) name = "Nike apparel";
  const dir = path.join(ROOT, "assets/img/pjs/gallery", `pjs-yp-${id}`);
  const rel = download("helloworld520", id, info.hashes, dir, `assets/img/pjs/gallery/pjs-yp-${id}`);
  if (!rel.length) { console.log(`  ! pjs ${id} no photos`); continue; }
  pjsAdds.push({ id: `pjs-yp-${id}`, n: name.slice(0, 60), b: "Nike", p: price, w: null, y: `https://helloworld520.x.yupoo.com/albums/${id}?uid=1`, c: null, im: rel[0] });
  pjsGal[`pjs-yp-${id}`] = rel;
  console.log(`  + PJS ${name.slice(0, 40)} ${price ? "¥" + price : "(ask)"} (${rel.length} photos)`);
  sleep(120);
}

fs.writeFileSync("/tmp/bago_adds.json", JSON.stringify({ raw: bagoAdds, gal: bagoGal }));
fs.writeFileSync("/tmp/pjs_adds.json", JSON.stringify({ raw: pjsAdds, gal: pjsGal }));
console.log(`\nBagoasis +${bagoAdds.length}, PJS +${pjsAdds.length}. Wrote /tmp/*_adds.json`);
