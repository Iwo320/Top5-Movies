import type { MovieData, WeeklyData } from "../types";

const MOCK_MOVIES: Array<Omit<MovieData, "rank" | "trailerUrl">> = [
  {
    id: 1001,
    title: "Midnight Horizon",
    overview:
      "A disgraced pilot takes one final flight across the polar night to deliver a vaccine before an unstoppable storm grounds every plane on Earth.",
    releaseYear: "2026",
    voteAverage: 8.4,
    popularity: 1420.55,
    genreNames: ["Thriller", "Adventure"],
    posterUrl: null,
    backdropUrl: null,
  },
  {
    id: 1002,
    title: "The Glass Archive",
    overview:
      "An archivist discovers that a sealed wing of the national library contains memories recorded in glass, and someone is erasing them one by one.",
    releaseYear: "2025",
    voteAverage: 7.9,
    popularity: 1180.2,
    genreNames: ["Mystery", "Drama"],
    posterUrl: null,
    backdropUrl: null,
  },
  {
    id: 1003,
    title: "Neon Delta",
    overview:
      "In a flooded megacity, a courier with a mechanical heart gets tangled in a heist that could buy her freedom — or sink the city for good.",
    releaseYear: "2026",
    voteAverage: 7.6,
    popularity: 990.4,
    genreNames: ["Science Fiction", "Action"],
    posterUrl: null,
    backdropUrl: null,
  },
  {
    id: 1004,
    title: "Letters from the Lighthouse",
    overview:
      "Two strangers exchange letters through a lighthouse that somehow delivers mail forty years into the past.",
    releaseYear: "2024",
    voteAverage: 8.1,
    popularity: 870.75,
    genreNames: ["Romance", "Fantasy"],
    posterUrl: null,
    backdropUrl: null,
  },
  {
    id: 1005,
    title: "Kings of the Static",
    overview:
      "A pirate radio crew broadcasting from an abandoned subway station becomes the only voice a city trusts when the grid goes dark.",
    releaseYear: "2025",
    voteAverage: 7.3,
    popularity: 640.15,
    genreNames: ["Crime", "Music"],
    posterUrl: null,
    backdropUrl: null,
  },
];

export const buildMockWeeklyData = (): WeeklyData => ({
  weekLabel: new Date().toISOString().slice(0, 10),
  generatedAt: new Date().toISOString(),
  source: "mock",
  movies: MOCK_MOVIES.map((m, i) => ({
    ...m,
    rank: i + 1,
    trailerUrl: i === 3 ? null : `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
  })),
});
