import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Audio,
  Freeze,
  staticFile,
} from "remotion";
import { THEME, totalSequenceFrames } from "./theme/theme";
import type { WeeklyData } from "./types";
import { Intro } from "./components/Intro";
import { MovieCard } from "./components/MovieCard";
import { Outro } from "./components/Outro";
import backgroundMp3 from "./audio.mp3";

export const Top5Weekly: React.FC<{ data: WeeklyData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { fps, width, height } = useVideoConfig();

  const movies = data.movies.slice(0, 5);
  const introEnd = THEME.timing.introDurationInFrames;
  const movieDurations = movies.map(
    (movie) => movie.voiceoverDurationInFrames ?? THEME.timing.cardDurationInFrames,
  );
  const movieStarts = movieDurations.reduce<number[]>((starts, duration, i) => {
    starts.push(i === 0 ? introEnd : starts[i - 1] + movieDurations[i - 1]);
    return starts;
  }, []);
  const outroStart = introEnd + movieDurations.reduce((sum, duration) => sum + duration, 0);

  const isVoiceoverFrame = (currentFrame: number) =>
    movieStarts.some(
      (start, i) => currentFrame >= start && currentFrame < start + movieDurations[i],
    );

  const globalFade = interpolate(
    frame,
    [0, 8, durationInFrames - 10, durationInFrames - 1],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.backgroundDeep }}>
      <Audio
        src={backgroundMp3}
        loop
        volume={(currentFrame) => (isVoiceoverFrame(currentFrame) ? 0.05 : 0.5)}
      />
      <Sequence durationInFrames={introEnd} name="Intro">
        <Intro weekLabel={data.weekLabel} />
      </Sequence>
      {movies.map((movie, i) => (
        <Sequence
          key={`${movie.id}-${i}`}
          from={movieStarts[i]}
          durationInFrames={movieDurations[i]}
          name={`#${movie.rank} ${movie.title}`}
        >
          <Audio src={staticFile(`${movie.id}.mp3`)} volume={1} />
          <Freeze frame={30}>
            <MovieCard movie={movie} />
          </Freeze>
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
  durationInFrames: totalSequenceFrames(
    Math.min(data.movies.length, 5),
    data.movies.slice(0, 5).map((movie) => movie.voiceoverDurationInFrames),
  ),
});
