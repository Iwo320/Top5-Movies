import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { THEME, totalSequenceFrames } from "./theme/theme";
import type { WeeklyData } from "./types";
import { Intro } from "./components/Intro";
import { MovieCard } from "./components/MovieCard";
import { Outro } from "./components/Outro";

export const Top5Weekly: React.FC<{ data: WeeklyData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const movies = data.movies.slice(0, 5);
  const introEnd = THEME.timing.introDurationInFrames;
  const outroStart = durationInFrames - THEME.timing.outroDurationInFrames;

  const globalFade = interpolate(
    frame,
    [0, 8, durationInFrames - 10, durationInFrames - 1],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const musicVolume = (f: number): number =>
    interpolate(
      f,
      [0, 20, durationInFrames - THEME.animation.musicFadeOutFrames, durationInFrames - 2],
      [0, 0.9, 0.75, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.backgroundDeep }}>
      <Audio src={staticFile("theme-music.mp3")} volume={musicVolume} />
      <Sequence durationInFrames={introEnd} name="Intro">
        <Intro weekLabel={data.weekLabel} />
      </Sequence>
      {movies.map((movie, i) => (
        <Sequence
          key={`${movie.id}-${i}`}
          from={introEnd + i * THEME.timing.cardDurationInFrames}
          durationInFrames={THEME.timing.cardDurationInFrames}
          name={`#${movie.rank} ${movie.title}`}
        >
          <MovieCard movie={movie} />
        </Sequence>
      ))}
      <Sequence
        from={outroStart}
        durationInFrames={THEME.timing.outroDurationInFrames}
        name="Outro"
      >
        <Outro weekLabel={data.weekLabel} />
      </Sequence>
      <AbsoluteFill style={{ opacity: globalFade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const calculateTop5Metadata = ({ data }: { data: WeeklyData }) => ({
  durationInFrames: totalSequenceFrames(Math.min(data.movies.length, 5)),
});
