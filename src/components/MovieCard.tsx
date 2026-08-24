import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { THEME } from "../theme/theme";
import { DISPLAY_FONT, BODY_FONT } from "../theme/fonts";
import { AnimatedBackground } from "./AnimatedBackground";
import { PosterImage } from "./Images";
import type { MovieData } from "../types";

export const MovieCard: React.FC<{ movie: MovieData }> = ({ movie }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const isPortrait = height > width;
  const scaleUnit = Math.min(width, height) / 1080;

  const rankSpring = spring({
    frame: frame - 4,
    fps,
    config: THEME.animation.popSpringConfig,
  });
  const posterSpring = spring({
    frame: frame - 10,
    fps,
    config: THEME.animation.springConfig,
  });
  const ratingFill = interpolate(frame, [40, 80], [0, movie.voteAverage], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const popFill = interpolate(
    frame,
    [50, 95],
    [0, Math.min(movie.popularity, 2000) / 2000],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const cardFlexDirection: React.CSSProperties["flexDirection"] = isPortrait
    ? "column"
    : "row";

  return (
    <AbsoluteFill>
      <AnimatedBackground />
      <AbsoluteFill
        style={{
          padding: THEME.spacing.pageMarginX * scaleUnit * (isPortrait ? 0.5 : 1),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isPortrait ? "column" : "row",
            alignItems: isPortrait ? "center" : "flex-start",
            gap: THEME.spacing.sectionGap * scaleUnit,
            width: "100%",
          }}
        >
          <div
            style={{
              position: "relative",
              transform: `translateY(${(1 - posterSpring) * 90 * scaleUnit}px)`,
              opacity: posterSpring,
              flexShrink: 0,
            }}
          >
            <PosterImage
              src={movie.posterUrl}
              alt={movie.title}
              style={{
                width: (isPortrait ? 380 : 420) * scaleUnit,
                height: (isPortrait ? 570 : 630) * scaleUnit,
                borderRadius: THEME.spacing.cornerRadius * scaleUnit,
                boxShadow: `0 30px 90px rgba(0,0,0,0.65)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -46 * scaleUnit,
                left: -38 * scaleUnit,
                fontFamily: DISPLAY_FONT,
                fontSize: 190 * scaleUnit,
                lineHeight: 1,
                color: THEME.colors.primary,
                textShadow: `0 12px 40px rgba(255,71,87,0.45)`,
                transform: `scale(${rankSpring}) rotate(-6deg)`,
              }}
            >
              {movie.rank}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: THEME.spacing.elementGap * scaleUnit,
              maxWidth: isPortrait ? undefined : 960 * scaleUnit,
              alignItems: isPortrait ? "center" : "flex-start",
              textAlign: isPortrait ? "center" : "left",
            }}
          >
            <div
              style={{
                fontFamily: BODY_FONT,
                fontWeight: 700,
                fontSize: 26 * scaleUnit,
                letterSpacing: 8 * scaleUnit,
                color: THEME.colors.accent,
                opacity: rankSpring,
              }}
            >
              #{movie.rank} TYGODNIA
            </div>
            <div
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: (isPortrait ? 96 : 120) * scaleUnit,
                lineHeight: 1,
                color: THEME.colors.text,
                transform: `translateY(${(1 - rankSpring) * 40 * scaleUnit}px)`,
                opacity: rankSpring,
              }}
            >
              {movie.title.toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                gap: 16 * scaleUnit,
                alignItems: "center",
                opacity: rankSpring,
                flexWrap: "wrap",
                justifyContent: isPortrait ? "center" : "flex-start",
              }}
            >
              {movie.releaseYear && (
                <Badge scaleUnit={scaleUnit}>{movie.releaseYear}</Badge>
              )}
              {movie.genreNames.slice(0, 3).map((g) => (
                <Badge key={g} tone="accent" scaleUnit={scaleUnit}>
                  {g}
                </Badge>
              ))}
              <Badge tone="gold" scaleUnit={scaleUnit}>
                ★ {movie.voteAverage.toFixed(1)}
              </Badge>
            </div>
            <div
              style={{
                fontFamily: BODY_FONT,
                fontWeight: 400,
                fontSize: 28 * scaleUnit,
                lineHeight: 1.5,
                color: THEME.colors.textMuted,
                maxWidth: 780 * scaleUnit,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
              }}
            >
              {movie.overview || "Brak opisu tego filmu."}
            </div>

            <MeterRow
              label="OCENA TMDB"
              value={`${ratingFill.toFixed(1)} / 10`}
              fill={ratingFill / 10}
              scaleUnit={scaleUnit}
            />
            <MeterRow
              label="POPULARNOŚĆ"
              value={Math.round(movie.popularity).toLocaleString("en-US")}
              fill={popFill}
              scaleUnit={scaleUnit}
              tone={THEME.colors.secondary}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Badge: React.FC<{
  children: React.ReactNode;
  tone?: "default" | "accent" | "gold";
  scaleUnit: number;
}> = ({ children, tone = "default", scaleUnit }) => {
  const color =
    tone === "accent"
      ? THEME.colors.accent
      : tone === "gold"
        ? THEME.colors.gold
        : THEME.colors.textMuted;
  return (
    <span
      style={{
        fontFamily: BODY_FONT,
        fontWeight: 700,
        fontSize: 22 * scaleUnit,
        letterSpacing: 2 * scaleUnit,
        color,
        border: `2px solid ${color}`,
        borderRadius: 999,
        padding: `${8 * scaleUnit}px ${22 * scaleUnit}px`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

const MeterRow: React.FC<{
  label: string;
  value: string;
  fill: number;
  scaleUnit: number;
  tone?: string;
}> = ({ label, value, fill, scaleUnit, tone = THEME.colors.primary }) => (
  <div style={{ width: "100%", maxWidth: 720 * scaleUnit }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 10 * scaleUnit,
      }}
    >
      <span
        style={{
          fontFamily: BODY_FONT,
          fontWeight: 700,
          fontSize: 20 * scaleUnit,
          letterSpacing: 4 * scaleUnit,
          color: THEME.colors.textMuted,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: BODY_FONT,
          fontWeight: 800,
          fontSize: 20 * scaleUnit,
          color: THEME.colors.text,
        }}
      >
        {value}
      </span>
    </div>
    <div
      style={{
        height: 14 * scaleUnit,
        borderRadius: 7 * scaleUnit,
        backgroundColor: THEME.colors.surfaceLight,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${fill * 100}%`,
          height: "100%",
          borderRadius: 7 * scaleUnit,
          background: `linear-gradient(90deg, ${tone}, ${THEME.colors.secondary})`,
        }}
      />
    </div>
  </div>
);
