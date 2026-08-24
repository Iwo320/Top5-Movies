import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../theme/theme";

export const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.5) % 240;
  const glowPulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.35, 0.7]);

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.backgroundDeep }}>
      <div
        style={{
          position: "absolute",
          inset: -240,
          background: `radial-gradient(900px circle at 20% 25%, ${THEME.colors.primary}22, transparent 60%),
            radial-gradient(1100px circle at 80% 70%, ${THEME.colors.accent}1e, transparent 60%)`,
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${12 + i * 34}%`,
            left: -400 + ((drift + i * 120) % 2400),
            width: 520,
            height: 6,
            borderRadius: 3,
            opacity: 0.08,
            transform: "rotate(-8deg)",
            background: i % 2 === 0 ? THEME.colors.secondary : THEME.colors.primary,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          right: "-8%",
          bottom: "-14%",
          width: "42vw",
          height: "42vw",
          borderRadius: "50%",
          border: `2px solid ${THEME.colors.surfaceLight}`,
          opacity: glowPulse,
        }}
      />
    </AbsoluteFill>
  );
};
