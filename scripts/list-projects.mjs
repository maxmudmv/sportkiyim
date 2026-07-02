import { stitch, StitchError } from "@google/stitch-sdk";

try {
  const projects = await stitch.projects();
  console.log(`Found ${projects.length} project(s):\n`);
  for (const p of projects) {
    // Print whatever identifying fields exist
    console.log(JSON.stringify({ id: p.id, title: p.title ?? p.displayName ?? p.name, ...("data" in p ? {} : {}) }));
  }
} catch (e) {
  if (e instanceof StitchError) {
    console.error(`StitchError [${e.code}]: ${e.message} (recoverable=${e.recoverable})`);
  } else {
    console.error("Error:", e);
  }
  process.exit(1);
}
