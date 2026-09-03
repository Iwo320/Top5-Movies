import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { buildMockWeeklyData } from "./data/mock";
import { THEME, totalSequenceFrames } from "./theme/theme";

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  if (ok) {
    console.log(`  PASS  ${name}`);
  } else {
    failures++;
    console.error(`  FAIL  ${name} ${detail}`);
  }
};

console.log("[test] Theme integrity");
check("fps is 30", THEME.fps === 30);
check("landscape is 1920x1080", THEME.layout.landscape.width === 1920 && THEME.layout.landscape.height === 1080);
check("portrait is 1080x1920", THEME.layout.portrait.width === 1080 && THEME.layout.portrait.height === 1920);
check(
  "all animation timings defined",
  Object.values(THEME.animation).every((v) => v !== undefined),
);

console.log("[test] Duration math");
const frames5 = totalSequenceFrames(5);
const expected =
  THEME.timing.introDurationInFrames +
  6 * THEME.timing.sceneGapInFrames +
  5 * THEME.timing.cardDurationInFrames +
  THEME.timing.outroDurationInFrames;
check(`5 movies => ${expected} frames (~${Math.round(expected / THEME.fps)}s)`, frames5 === expected);

console.log("[test] Mock data");
const mock = buildMockWeeklyData();
check("mock has 5 movies", mock.movies.length === 5);
check("ranks are 1..5", mock.movies.every((m, i) => m.rank === i + 1));
check("mock movies have titles", mock.movies.every((m) => m.title.length > 0));
check("no trailer fields remain", mock.movies.every((m) => !("trailerUrl" in m)));

console.log("[test] Environment");
const envPath = path.resolve(process.cwd(), ".env.example");
check(".env.example exists", fs.existsSync(envPath));
if (process.env.TMDB_API_KEY) {
  check("TMDB_API_KEY present", true);
} else {
  console.log("  INFO  TMDB_API_KEY not set — use `npm run generate -- --mock` for offline testing.");
}

console.log("[test] Project files");
for (const f of ["src/index.ts", "src/Root.tsx", "src/Top5Weekly.tsx", "remotion.config.ts", ".github/workflows/weekly.yml"]) {
  check(`${f} exists`, fs.existsSync(path.resolve(process.cwd(), f)));
}

if (failures > 0) {
  console.error(`[test] ${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("[test] ALL CHECKS PASSED");
