import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { THEME } from "../theme/theme";
import { DISPLAY_FONT, BODY_FONT } from "../theme/fonts";
import { BackdropImage, PosterImage } from "./Images";
import type { MovieData } from "../types";

export const TrailerSegment: React.FC<{ movie: MovieData }> = ({ movie }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const scaleUnit = Math.min(width, height) / 1080;

  const kenBurns = interpolate(frame, [0, THEME.timing.trailerDurationInFrames], [1, 1.12]);
  const playSpring = spring({
    frame: frame - 12,
    fps,
    config: THEME.animation.popSpringConfig,
  });
  const pulse = interpolate(Math.sin(frame / 8), [-1, 1], [1, 1.08]);

  if (!movie.trailerUrl) {
    return (
      <AbsoluteFill>
        <BackdropImage src={movie.backdropUrl} style={{ opacity: 0.35 }} />
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: THEME.spacing.elementGap * scaleUnit,
          }}
        >
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 90 * scaleUnit,
              color: THEME.colors.text,
              letterSpacing: 6 * scaleUnit,
            }}
          >
            {movie.title.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: BODY_FONT,
              fontWeight: 700,
              fontSize: 32 * scaleUnit,
              letterSpacing: 8 * scaleUnit,
              color: THEME.colors.textMuted,
              border: `3px solid ${THEME.colors.textMuted}`,
              borderRadius: 999,
              padding: `${14 * scaleUnit}px ${40 * scaleUnit}px`,
            }}
          >
            OFFICIAL TRAILER UNAVAILABLE
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.backgroundDeep }}>
      <AbsoluteFill style={{ transform: `scale(${kenBurns})` }}>
        {movie.backdropUrl ? (
          <BackdropImage src={movie.backdropUrl} style={{ opacity: 0.55 }} />
        ) : (
          <PosterImage
            src={movie.posterUrl}
            alt={movie.title}
            style={{ width: "100%", height: "100%", opacity: 0.4, objectFit: "cover" }}
          />
        )}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${THEME.colors.backgroundDeep}55 0%, ${THEME.colors.backgroundDeep}ee 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 42 * scaleUnit,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 170 * scaleUnit,
            height: 170 * scaleUnit,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${THEME.colors.primary}, ${THEME.colors.secondary})`,
            boxShadow: `0 20px 70px rgba(255,71,87,0.5)`,
            transform: `scale(${playSpring * pulse})`,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              marginLeft: 12 * scaleUnit,
              borderTop: `${34 * scaleUnit}px solid transparent`,
              borderBottom: `${34 * scaleUnit}px solid transparent`,
              borderLeft: `${56 * scaleUnit}px solid ${THEME.colors.backgroundDeep}`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 84 * scaleUnit,
            color: THEME.colors.text,
            letterSpacing: 5 * scaleUnit,
            textAlign: "center",
            opacity: interpolate(frame, [24, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          {movie.title.toUpperCase()} — OFFICIAL TRAILER
        </div>
        <div
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 700,
            fontSize: 26 * scaleUnit,
            letterSpacing: 4 * scaleUnit,
            color: THEME.colors.accent,
            opacity: interpolate(frame, [34, 50], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          WATCH NOW ON YOUTUBE
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
