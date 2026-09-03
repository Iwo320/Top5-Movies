export interface MovieData {
  rank: number;
  id: number;
  title: string;
  overview: string;
  releaseYear: string | null;
  voteAverage: number;
  popularity: number;
  genreNames: string[];
  posterUrl: string | null;
  backdropUrl: string | null;
  voiceoverDurationInFrames?: number;
}

export interface WeeklyData {
  weekLabel: string;
  generatedAt: string;
  source: "tmdb" | "mock";
  movies: MovieData[];
}
