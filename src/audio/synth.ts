import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { THEME } from "../theme/theme";

const SR = 44100;
const BPM = 128;
const BEAT = 60 / BPM;
const INTRO_END = THEME.timing.introDurationInFrames / THEME.fps;
const CARD_DUR = THEME.timing.cardDurationInFrames / THEME.fps;
const OUTRO_DUR = THEME.timing.outroDurationInFrames / THEME.fps;
const MOVIES = 5;
const TOTAL = INTRO_END + MOVIES * CARD_DUR + OUTRO_DUR + 0.7;

const midi = (n: number): number => 440 * Math.pow(2, (n - 69) / 12);

const N = Math.ceil(TOTAL * SR);
const left = new Float64Array(N);
const right = new Float64Array(N);

const add = (i: number, l: number, r: number) => {
  if (i >= 0 && i < N) {
    left[i] += l;
    right[i] += r;
  }
};

const saw = (phase: number): number => (phase % 1) * 2 - 1;
const square = (phase: number): number => (phase % 1 < 0.5 ? 1 : -1);

class LowPass {
  private y = 0;
  constructor(private a: number) {}
  next(x: number): number {
    this.y += this.a * (x - this.y);
    return this.y;
  }
}

class HighPass {
  private prevX = 0;
  private prevY = 0;
  next(x: number): number {
    const y = 0.96 * (this.prevY + x - this.prevX);
    this.prevX = x;
    this.prevY = y;
    return y;
  }
}

let noiseState = 12345;
const noise = (): number => {
  noiseState = (noiseState * 1103515245 + 12345) & 0x7fffffff;
  return (noiseState / 0x3fffffff) - 1;
};

const env = (t: number, attack: number, decay: number): number => {
  if (t < 0) return 0;
  if (t < attack) return t / attack;
  return Math.exp(-(t - attack) / decay);
};

const kick = (time: number, gain = 1) => {
  const dur = 0.3;
  const start = Math.floor(time * SR);
  const lp = new LowPass(0.35);
  for (let i = 0; i < dur * SR; i++) {
    const t = i / SR;
    const f = 45 + 110 * Math.exp(-t / 0.02);
    const phase = (start + i) * (f / SR);
    const click = noise() * Math.exp(-t / 0.004) * 0.3;
    const s = (Math.sin(2 * Math.PI * phase) + click) * Math.exp(-t / 0.09) * 0.9 * gain;
    const out = lp.next(s);
    add(start + i, out, out);
  }
};

const hat = (time: number, gain = 1, open = false) => {
  const dur = open ? 0.18 : 0.05;
  const start = Math.floor(time * SR);
  const hp = new HighPass();
  for (let i = 0; i < dur * SR; i++) {
    const t = i / SR;
    const s = hp.next(noise()) * Math.exp(-t / (open ? 0.07 : 0.018)) * 0.22 * gain;
    add(start + i, s * 0.8, s);
  }
};

const bassNote = (time: number, note: number, dur: number, gain = 1) => {
  const start = Math.floor(time * SR);
  const len = Math.floor(dur * SR);
  const lp = new LowPass(0.12);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const f = midi(note);
    const phase = i * (f / SR);
    const e = env(t, 0.004, dur * 0.5) * 0.5 * gain;
    const s = lp.next(saw(phase) * 0.7 + Math.sin(2 * Math.PI * phase) * 0.5) * e;
    add(start + i, s, s);
  }
};

const arpNote = (time: number, note: number, gain = 1) => {
  const dur = 0.16;
  const start = Math.floor(time * SR);
  const len = Math.floor(dur * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const f = midi(note);
    const phase = i * (f / SR);
    const e = env(t, 0.002, 0.06) * 0.16 * gain;
    const s = (square(phase) * 0.4 + saw(phase * 1.005) * 0.6) * e;
    add(start + i, s * 0.7, s);
  }
};

const padChord = (time: number, notes: number[], dur: number, gain = 1) => {
  const start = Math.floor(time * SR);
  const len = Math.floor(dur * SR);
  const lps = [new LowPass(0.06), new LowPass(0.05), new LowPass(0.055), new LowPass(0.05)];
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    let l = 0;
    let r = 0;
    notes.forEach((note, ni) => {
      const f = midi(note);
      const detune = 1 + (ni % 2 === 0 ? 0.0015 : -0.0015);
      const phase = i * ((f * detune) / SR);
      const e = env(t, dur * 0.3, dur * 0.8) * 0.09 * gain;
      const s = lps[ni % lps.length].next(saw(phase)) * e;
      l += s * (ni % 2 === 0 ? 1 : 0.6);
      r += s * (ni % 2 === 1 ? 1 : 0.6);
    });
    add(start + i, l, r);
  }
};

const riser = (time: number, dur: number) => {
  const start = Math.floor(time * SR);
  const len = Math.floor(dur * SR);
  const hp = new HighPass();
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const p = t / dur;
    const s =
      hp.next(noise()) * Math.pow(p, 2.2) * 0.25 +
      Math.sin(2 * Math.PI * i * ((200 + 600 * p * p) / SR)) * Math.pow(p, 2) * 0.12;
    add(start + i, s * Math.min(1, (dur - t) / 0.05), s * Math.min(1, (dur - t) / 0.05));
  }
};

const impact = (time: number) => {
  const start = Math.floor(time * SR);
  const len = Math.floor(1.2 * SR);
  const lp = new LowPass(0.2);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const s =
      lp.next(noise()) * Math.exp(-t / 0.12) * 0.5 +
      Math.sin(2 * Math.PI * i * (55 / SR)) * Math.exp(-t / 0.25) * 0.8;
    add(start + i, s, s);
  }
};

const CHORDS = [
  [57, 60, 64],
  [53, 57, 60],
  [48, 52, 55],
  [55, 59, 62],
];
const ROOTS = [33, 29, 24, 31];
const ARPS = [
  [69, 72, 76, 81],
  [65, 69, 72, 77],
  [72, 76, 79, 84],
  [67, 71, 74, 79],
];

const bars = TOTAL / (BEAT * 4);
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * BEAT * 4;
  const section = t0 < INTRO_END ? "intro" : t0 < INTRO_END + MOVIES * CARD_DUR ? "body" : "outro";
  const chord = CHORDS[bar % CHORDS.length];
  const root = ROOTS[bar % ROOTS.length];
  const arp = ARPS[bar % ARPS.length];

  if (section === "intro") {
    padChord(t0, [...chord, chord[0] + 12], BEAT * 4, 0.9);
    if (bar >= 1) {
      for (let b = 0; b < 4; b++) hat(t0 + b * BEAT + BEAT / 2, 0.4);
    }
  }

  if (section === "body") {
    padChord(t0, chord, BEAT * 4, 0.55);
    for (let b = 0; b < 4; b++) {
      const tb = t0 + b * BEAT;
      kick(tb, 0.95);
      hat(tb + BEAT / 2, 0.8);
      hat(tb + BEAT, 0.35);
      bassNote(tb, root, BEAT * 0.9, 0.9);
      bassNote(tb + BEAT / 2, root + 12, BEAT * 0.4, 0.5);
    }
    for (let s = 0; s < 16; s++) {
      if (s % 2 === 0 || Math.floor(bar / 2) % 2 === 1) {
        arpNote(t0 + s * (BEAT / 4), arp[s % arp.length] + (s >= 8 ? 12 : 0), s % 4 === 0 ? 1 : 0.7);
      }
    }
  }

  if (section === "outro") {
    padChord(t0, [...chord, chord[0] + 12], BEAT * 4, 1);
  }
}

riser(Math.max(0, INTRO_END - 1.8), 1.8);
impact(INTRO_END);

const fadeSamples = Math.floor(0.8 * SR);
for (let i = 0; i < fadeSamples; i++) {
  const g = 1 - i / fadeSamples;
  left[N - fadeSamples + i] *= g;
  right[N - fadeSamples + i] *= g;
}

let peak = 0;
for (let i = 0; i < N; i++) {
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const norm = peak > 0 ? 0.88 / peak : 1;

const buffer = Buffer.alloc(44 + N * 4);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + N * 4, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(2, 22);
buffer.writeUInt32LE(SR, 24);
buffer.writeUInt32LE(SR * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buffer.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(left[i] * norm * 32767))), 44 + i * 4);
  buffer.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(right[i] * norm * 32767))), 46 + i * 4);
}

const outPath = path.resolve(process.cwd(), "public", "theme-music.wav");

const main = async () => {
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, buffer);
  console.log(`[music] Wygenerowano ${TOTAL.toFixed(1)}s ścieżki → ${outPath}`);
};

main().catch((error) => {
  console.error("[music] FAILED:", error);
  process.exit(1);
});
