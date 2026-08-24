import React from "react";
import { Composition } from "remotion";
import { THEME } from "./theme/theme";
import type { WeeklyData } from "./types";
import { Top5Weekly, calculateTop5Metadata } from "./Top5Weekly";

const emptyData: WeeklyData = {
  weekLabel: "",
  generatedAt: "",
  source: "mock",
  movies: [],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {(["landscape", "portrait"] as const).map((format) => (
        <Composition
          key={format}
          id={format === "landscape" ? "Top5Weekly-Landscape" : "Top5Weekly-Portrait"}
          component={Top5Weekly}
          fps={THEME.fps}
          width={THEME.layout[format].width}
          height={THEME.layout[format].height}
          defaultProps={{ data: emptyData }}
          calculateMetadata={({ props }) => calculateTop5Metadata(props)}
        />
      ))}
    </>
  );
};
