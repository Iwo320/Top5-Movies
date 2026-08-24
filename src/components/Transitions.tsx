import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { THEME } from "../theme/theme";

export const FadeIn: React.FC<{
  children: React.ReactNode;
  durationInFrames?: number;
}> = ({ children, durationInFrames = THEME.animation.mediumInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const FadeOutAtEnd: React.FC<{
  children: React.ReactNode;
  durationInFrames?: number;
}> = ({ children, durationInFrames = THEME.animation.exitFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: total } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [total - durationInFrames, total - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const SlideUpEntrance: React.FC<{
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  durationInFrames?: number;
}> = ({
  children,
  delay = 0,
  distance = 80,
  durationInFrames = THEME.animation.mediumInFrames,
}) => {
  const frame = useCurrentFrame() - delay;
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        transform: `translateY(${(1 - progress) * distance}px)`,
        opacity: progress,
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};
