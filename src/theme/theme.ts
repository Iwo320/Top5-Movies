export const THEME = {
  colors: {
    background: "#0B0C1E",
    backgroundDeep: "#05060F",
    surface: "#151730",
    surfaceLight: "#1F2244",
    primary: "#FF4757",
    secondary: "#FFD32A",
    accent: "#3DC1F3",
    text: "#FFFFFF",
    textMuted: "#9BA0C8",
    gold: "#FFC24B",
  },
  fonts: {
    display: "Bebas Neue",
    body: "Inter",
  },
  layout: {
    landscape: { width: 1920, height: 1080 },
    portrait: { width: 1080, height: 1920 },
  },
  fps: 30,
  timing: {
    introDurationInFrames: 120,
    cardDurationInFrames: 210,
    trailerDurationInFrames: 240,
    outroDurationInFrames: 100,
  },
  animation: {
    fastInFrames: 12,
    mediumInFrames: 20,
    slowInFrames: 30,
    exitFrames: 15,
    springConfig: { damping: 200, stiffness: 100, mass: 0.5 },
    popSpringConfig: { damping: 12, stiffness: 120, mass: 0.8 },
  },
  spacing: {
    pageMarginX: 120,
    sectionGap: 48,
    elementGap: 24,
    cardPadding: 56,
    cornerRadius: 28,
  },
} as const;

export type Theme = typeof THEME;

export const totalSequenceFrames = (movieCount: number): number =>
  THEME.timing.introDurationInFrames +
  movieCount *
    (THEME.timing.cardDurationInFrames + THEME.timing.trailerDurationInFrames) +
  THEME.timing.outroDurationInFrames;
