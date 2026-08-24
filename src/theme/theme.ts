export const THEME = {
  colors: {
    background: "#111111",
    backgroundDeep: "#0A0A0A",
    surface: "#1A1A1A",
    surfaceLight: "#262626",
    primary: "#FF7A00",
    secondary: "#FFFFFF",
    accent: "#FFB25C",
    text: "#FFFFFF",
    textMuted: "#B3B3B3",
    gold: "#FFA51E",
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
    cardDurationInFrames: 240,
    outroDurationInFrames: 100,
  },
  animation: {
    fastInFrames: 12,
    mediumInFrames: 20,
    slowInFrames: 30,
    exitFrames: 15,
    springConfig: { damping: 200, stiffness: 100, mass: 0.5 },
    popSpringConfig: { damping: 12, stiffness: 120, mass: 0.8 },
    musicFadeOutFrames: 50,
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
  movieCount * THEME.timing.cardDurationInFrames +
  THEME.timing.outroDurationInFrames;
