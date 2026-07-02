import { stitch, StitchError } from "@google/stitch-sdk";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const RAW = "_stitch_raw";

const slug = (title) =>
  title.toLowerCase().replace(/apexvelocity\s*\|\s*/i, "").trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "screen";

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res;
}

try {
  await mkdir(RAW, { recursive: true });
  const projects = await stitch.projects();
  const project = projects[0];
  console.log("Project:", project.projectId);

  const screens = await project.screens();
  console.log(`Downloading ${screens.length} screens...\n`);

  const manifest = [];
  for (const s of screens) {
    const title = s.data?.title ?? s.id;
    const name = slug(title);

    const htmlUrl = await s.getHtml();
    const htmlRes = await download(htmlUrl);
    const html = await htmlRes.text();
    await writeFile(join(RAW, `${name}.html`), html, "utf8");

    let imgFile = null;
    try {
      const imgUrl = await s.getImage();
      const imgRes = await download(imgUrl);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      imgFile = `${name}.png`;
      await writeFile(join(RAW, imgFile), buf);
    } catch (e) {
      console.warn(`  (screenshot skipped for ${name}: ${e.message})`);
    }

    console.log(`✓ ${title}  ->  ${name}.html (${html.length} bytes)${imgFile ? ` + ${imgFile}` : ""}`);
    manifest.push({ id: s.id, title, name, htmlBytes: html.length, deviceType: s.data?.deviceType });
  }

  await writeFile(join(RAW, "_theme.json"), JSON.stringify(project.data?.designTheme ?? {}, null, 2), "utf8");
  await writeFile(join(RAW, "_manifest.json"), JSON.stringify({ projectId: project.projectId, title: project.data?.title, screens: manifest }, null, 2), "utf8");
  console.log("\nDone. Raw files in ./_stitch_raw");
} catch (e) {
  if (e instanceof StitchError) console.error(`StitchError [${e.code}]: ${e.message}`);
  else console.error("Error:", e);
  process.exit(1);
}
