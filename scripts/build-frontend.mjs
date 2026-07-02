/*
 * Assembles the browsable frontend from the raw Stitch screen HTML.
 * Each screen -> a page at the project root. Design markup is preserved as-is;
 * only a shared navigation script tag is injected before </body>.
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const RAW = "_stitch_raw";
const OUT_MAP = {
  "home.html": "index.html",
  "shop-all.html": "shop.html",
  "product-details.html": "product.html",
  "checkout.html": "checkout.html",
};
const NAV_TAG = '\n<script src="assets/site.js"></script>\n';

const files = await readdir(RAW);
let built = 0;
for (const [raw, out] of Object.entries(OUT_MAP)) {
  if (!files.includes(raw)) {
    console.warn(`skip: ${raw} not found`);
    continue;
  }
  let html = await readFile(join(RAW, raw), "utf8");
  if (!html.includes("assets/site.js")) {
    html = html.replace(/<\/body>/i, `${NAV_TAG}</body>`);
  }
  await writeFile(out, html, "utf8");
  console.log(`✓ ${raw}  ->  ${out}`);
  built++;
}
console.log(`\nBuilt ${built} page(s).`);
