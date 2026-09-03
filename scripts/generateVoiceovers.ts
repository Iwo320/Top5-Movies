import "dotenv/config";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WeeklyData } from "../src/types";

const OUT_DIR = path.resolve(process.cwd(), "out");
const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const MODEL = process.env.PIPER_MODEL ?? "pl_PL-gosia-medium.onnx";
const PIPER_BIN = process.env.PIPER_BIN ?? "piper";

const run = (command: string, args: string[], input: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["pipe", "inherit", "inherit"] });
    child.stdin.end(input);
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`)),
    );
  });

const findLatestDataPath = async (): Promise<string> => {
  const { readdir } = await import("node:fs/promises");
  const dates = (await readdir(OUT_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  if (dates.length === 0) {
    throw new Error('No generated data found. Run "npm run generate" first.');
  }

  return path.join(OUT_DIR, dates[dates.length - 1], "data.json");
};

const main = async () => {
  const dataPath = await findLatestDataPath();
  const data = JSON.parse(await readFile(dataPath, "utf8")) as WeeklyData;

  for (const movie of data.movies.slice(0, 5)) {
    const wavPath = path.join(PUBLIC_DIR, `${movie.id}.wav`);
    const mp3Path = path.join(PUBLIC_DIR, `${movie.id}.mp3`);
    await run(PIPER_BIN, ["--model", MODEL, "--output_file", wavPath], movie.overview);
    await run("ffmpeg", ["-y", "-i", wavPath, "-codec:a", "libmp3lame", "-b:a", "128k", mp3Path], "");
    await import("node:fs/promises").then(({ unlink }) => unlink(wavPath));
    console.log(`[voiceovers] Generated ${movie.id}.mp3`);
  }
};

main().catch((error) => {
  console.error("[voiceovers] FAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
