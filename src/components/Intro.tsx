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

const TITLE = "TOP 5";

export const Intro: React.FC<{ weekLabel: string }> = ({ weekLabel }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const scaleUnit = Math.min(width, height) / 1080;

  const subtitleOpacity = interpolate(frame, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const weekOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barWidth = interpolate(frame, [20, 60], [0, 320 * scaleUnit], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 300 * scaleUnit,
            lineHeight: 1,
            color: THEME.colors.text,
            letterSpacing: 14 * scaleUnit,
            display: "flex",
            gap: 18 * scaleUnit,
          }}
        >
          {TITLE.split("").map((char, i) => {
            const s = spring({
              frame: frame - i * 4,
              fps,
              config: THEME.animation.popSpringConfig,
            });
  return (
              <span
                key={i}
                style={{
                  transform: `translateY(${(1 - s) * 140 * scaleUnit}px) scale(${s})`,
                  opacity: s,
                  display: "inline-block",
                  minWidth: char === " " ? 90 * scaleUnit : undefined,
                  color:
                    i % 3 === 1 && char !== " "
                      ? THEME.colors.primary
                      : THEME.colors.text,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
        <div
          style={{
            width: barWidth,
            height: 6 * scaleUnit,
            marginTop: 28 * scaleUnit,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.secondary})`,
          }}
        />
        <div
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 800,
            fontSize: 44 * scaleUnit,
            letterSpacing: 16 * scaleUnit,
            marginTop: 30 * scaleUnit,
            opacity: subtitleOpacity,
            color: THEME.colors.secondary,
          }}
        >
          MOVIES OF THE WEEK
        </div>
        <div
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 600,
            fontSize: 26 * scaleUnit,
            letterSpacing: 6 * scaleUnit,
            marginTop: 22 * scaleUnit,
            opacity: weekOpacity,
            color: THEME.colors.textMuted,
          }}
        >
          WEEK OF {weekLabel}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
