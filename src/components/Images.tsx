import React from "react";
import { Img, AbsoluteFill } from "remotion";
import { THEME } from "../theme/theme";
import { DISPLAY_FONT, BODY_FONT } from "../theme/fonts";

export const PosterImage: React.FC<{
  src: string | null;
  alt: string;
  style?: React.CSSProperties;
}> = ({ src, alt, style }) => {
  if (!src) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(160deg, ${THEME.colors.surface}, ${THEME.colors.surfaceLight})`,
          ...style,
        }}
      >
        <span
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 44,
            color: THEME.colors.textMuted,
            letterSpacing: 4,
            textAlign: "center",
            padding: 20,
          }}
        >
          {alt.toUpperCase()}
        </span>
      </div>
    );
  }
  return (
    <Img
      src={src}
      alt={alt}
      style={{
        objectFit: "cover",
        backgroundColor: THEME.colors.surface,
        ...style,
      }}
    />
  );
};

export const BackdropImage: React.FC<{
  src: string | null;
  style?: React.CSSProperties;
}> = ({ src, style }) => {
  if (!src) {
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(150deg, ${THEME.colors.surface} 0%, ${THEME.colors.backgroundDeep} 100%)`,
          ...style,
        }}
      />
    );
  }
  return (
    <Img
      src={src}
      style={{ objectFit: "cover", width: "100%", height: "100%", ...style }}
    />
  );
};
