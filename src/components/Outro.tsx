import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { THEME } from "../theme/theme";
import { DISPLAY_FONT, BODY_FONT } from "../theme/fonts";
import { AnimatedBackground } from "./AnimatedBackground";

export const Outro: React.FC<{ weekLabel: string }> = ({ weekLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const scaleUnit = Math.min(width, height) / 1080;

  const titleSpring = spring({
    frame: frame - 6,
    fps,
    config: THEME.animation.popSpringConfig,
  });
  const subOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: THEME.spacing.sectionGap * scaleUnit * 0.6,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 190 * scaleUnit,
            lineHeight: 1,
            color: THEME.colors.text,
            letterSpacing: 10 * scaleUnit,
            textAlign: "center",
            transform: `scale(${titleSpring})`,
          }}
        >
          DO ZOBACZENIA
        </div>
        <div
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 800,
            fontSize: 38 * scaleUnit,
            letterSpacing: 10 * scaleUnit,
            color: THEME.colors.secondary,
            opacity: subOpacity,
            textAlign: "center",
          }}
        >
          NOWE TOP 5 W KAŻDY PONIEDZIAŁEK
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60 * scaleUnit,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: BODY_FONT,
            fontWeight: 400,
            fontSize: 18 * scaleUnit,
            color: THEME.colors.textMuted,
            opacity: subOpacity * 0.8,
            padding: `0 ${80 * scaleUnit}px`,
          }}
        >
          Dane pochodzą z TMDB. Ten produkt korzysta z TMDB API, ale nie jest
          wspierany ani certyfikowany przez TMDB. · Tydzień {weekLabel}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
