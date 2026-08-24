import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import {
  renderMedia,
  selectComposition,
} from "@remotion/renderer";

const OUT_DIR = path.resolve(process.cwd(), "out");

type Format = "landscape" | "portrait";

interface RenderArgs {
  format: Format;
  date: string | null;
}

const parseArgs = (): RenderArgs => {
  const argv = process.argv.slice(2);
  const get = (name: string): string | undefined => {
    const idx = argv.indexOf(`--${name}`);
    if (idx === -1) return undefined;
    const value = argv[idx + 1];
    return value && !value.startsWith("--") ? value : "true";
  };
  const rawFormat = (get("format") ?? process.env.FORMAT ?? "landscape").toLowerCase();
  if (rawFormat !== "landscape" && rawFormat !== "portrait") {
    throw new Error(`Unknown --format "${rawFormat}". Use: landscape | portrait`);
  }
  return { format: rawFormat, date: get("date") ?? null };
};

const findLatestDataDir = (): string => {
  const entries = fs
    .readdirSync(OUT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(e.name))
    .map((e) => e.name)
    .sort();
  if (entries.length === 0) {
    throw new Error(
      `No generated data found in ${OUT_DIR}. Run "npm run generate" first.`,
    );
  }
  return entries[entries.length - 1];
};

const main = async () => {
  const { format, date } = parseArgs();

  const dataDirName =
    date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : findLatestDataDir();
  const dataDir = path.join(OUT_DIR, dataDirName);
  const dataPath = path.join(dataDir, "data.json");
  if (!fs.existsSync(dataPath)) {
    throw new Error(`data.json not found at ${dataPath}. Run "npm run generate" first.`);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(
    `[render] Using data from ${dataDirName} (${data.movies.length} movies, source: ${data.source})`,
  );

  console.log("[render] Bundling project...");
  const bundleLocation = await bundle({
    entryPoint: path.resolve(process.cwd(), "src/index.ts"),
    onProgress: (p: number) => {
      if (p % 25 === 0) console.log(`[render] bundling ${p}%`);
    },
  });

  const compositionId =
    format === "landscape" ? "Top5Weekly-Landscape" : "Top5Weekly-Portrait";

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps: { data },
  });

  const outputPath = path.join(dataDir, `top5-weekly-${format}.mp4`);
  console.log(
    `[render] Rendering ${compositionId} (${composition.width}x${composition.height}, ${composition.durationInFrames} frames)...`,
  );
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: { data },
    chromiumOptions: { gl: "angle" },
  });

  console.log(`[render] DONE → ${outputPath}`);
};

main().catch((error) => {
  console.error("[render] FAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
