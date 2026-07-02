import { stitch, StitchError } from "@google/stitch-sdk";

const clean = (obj) =>
  JSON.stringify(obj, (k, v) => (k === "client" ? "[client]" : typeof v === "function" ? "[fn]" : v), 2);

try {
  const projects = await stitch.projects();
  const p = projects[0];
  console.log("=== PROJECT.projectId ===", p.projectId);
  console.log("=== PROJECT.data ===");
  console.log(clean(p.data));

  console.log("\n=== SCREENS ===");
  const screens = await p.screens();
  console.log(`count: ${screens.length}`);
  for (let i = 0; i < screens.length; i++) {
    const s = screens[i];
    console.log(`\n--- screen[${i}] keys: ${Object.keys(s)} ---`);
    console.log("id:", s.id);
    console.log("data:", clean(s.data));
  }
} catch (e) {
  if (e instanceof StitchError) console.error(`StitchError [${e.code}]: ${e.message}`);
  else console.error("Error:", e);
  process.exit(1);
}
