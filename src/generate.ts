import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fetchTop5Movies } from "./tmdb/client";
import { buildMockWeeklyData } from "./data/mock";
import type { WeeklyData } from "./types";

const OUT_DIR = path.resolve(process.cwd(), "out");

const parseArgs = (argv: string[]) => {
  const args = new Map<string, string>();
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const next = argv[i + 1];
      args.set(arg.slice(2), next && !next.startsWith("--") ? next : "true");
    }
  }
  return args;
};

const weekLabel = (): string => new Date().toISOString().slice(0, 10);

const main = async () => {
  const args = parseArgs(process.argv);
  const useMock = args.get("mock") === "true";
  const label = weekLabel();

  let data: WeeklyData;
  if (useMock) {
    console.log("[generate] Running in MOCK mode (--mock). No TMDB calls.");
    data = buildMockWeeklyData();
    data.weekLabel = label;
  } else {
    console.log("[generate] Fetching weekly trending movies from TMDB...");
    data = {
      weekLabel: label,
      generatedAt: new Date().toISOString(),
      source: "tmdb",
      movies: await fetchTop5Movies(),
    };
  }

  const targetDir = path.join(OUT_DIR, label);
  await mkdir(targetDir, { recursive: true });
  const dataPath = path.join(targetDir, "data.json");
  await writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");

  console.log(`[generate] Weekly data saved to ${dataPath}`);
  for (const m of data.movies) {
    console.log(
      `  #${m.rank} ${m.title} (${m.releaseYear ?? "?"}) ★${m.voteAverage} — trailer: ${
        m.trailerUrl ? "yes" : "MISSING"
      }, poster: ${m.posterUrl ? "yes" : "MISSING"}`,
    );
  }
};

main().catch((error) => {
  console.error("[generate] FAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
