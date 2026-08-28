#!/usr/bin/env node
/* Merge the scraped additions (/tmp/*_adds.json) into the catalog +
   gallery files, preserving each file's banner and other arrays. */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const P = (f) => path.join(ROOT, "assets/js", f);

const bago = JSON.parse(fs.readFileSync("/tmp/bago_adds.json", "utf8"));
const pjs = JSON.parse(fs.readFileSync("/tmp/pjs_adds.json", "utf8"));

function load(file, ...vars) {
  const raw = fs.readFileSync(file, "utf8");
  const banner = raw.split("\n")[0];
  const sb = {};
  new Function("g", raw + "\n" + vars.map((v) => `g.${v}=typeof ${v}!=='undefined'?${v}:undefined;`).join("")) (sb);
  return { banner, sb };
}
const byId = (arr) => new Set(arr.map((x) => x.id));

/* --- catalog-data.js: append PJS adds to PJS_RAW --- */
{
  const { banner, sb } = load(P("catalog-data.js"), "MOMO_RAW", "PJS_RAW");
  const have = byId(sb.PJS_RAW);
  const add = pjs.raw.filter((r) => !have.has(r.id));
  sb.PJS_RAW.push(...add);
  fs.writeFileSync(P("catalog-data.js"), `${banner}\nvar MOMO_RAW = ${JSON.stringify(sb.MOMO_RAW)};\nvar PJS_RAW = ${JSON.stringify(sb.PJS_RAW)};\n`);
  console.log("PJS_RAW += ", add.length, "-> total", sb.PJS_RAW.length);
}
/* --- pjs-galleries.js --- */
{
  const { banner, sb } = load(P("pjs-galleries.js"), "PJS_GALLERIES");
  Object.assign(sb.PJS_GALLERIES, pjs.gal);
  fs.writeFileSync(P("pjs-galleries.js"), `${banner}\nvar PJS_GALLERIES = ${JSON.stringify(sb.PJS_GALLERIES)};\n`);
  console.log("PJS_GALLERIES entries:", Object.keys(sb.PJS_GALLERIES).length);
}
/* --- bago-catalog.js: append Celine/Burberry to BAGO_RAW --- */
{
  const { banner, sb } = load(P("bago-catalog.js"), "BAGO_RAW");
  const have = byId(sb.BAGO_RAW);
  const add = bago.raw.filter((r) => !have.has(r.id));
  sb.BAGO_RAW.push(...add);
  fs.writeFileSync(P("bago-catalog.js"), `${banner}\nvar BAGO_RAW = ${JSON.stringify(sb.BAGO_RAW)};\n`);
  console.log("BAGO_RAW += ", add.length, "-> total", sb.BAGO_RAW.length);
}
/* --- bago-galleries.js --- */
{
  const { banner, sb } = load(P("bago-galleries.js"), "BAGO_GALLERIES");
  Object.assign(sb.BAGO_GALLERIES, bago.gal);
  fs.writeFileSync(P("bago-galleries.js"), `${banner}\nvar BAGO_GALLERIES = ${JSON.stringify(sb.BAGO_GALLERIES)};\n`);
  console.log("BAGO_GALLERIES entries:", Object.keys(sb.BAGO_GALLERIES).length);
}
console.log("Merged.");
