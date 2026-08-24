import type { MovieData, WeeklyData } from "../types";

const MOCK_MOVIES: Array<Omit<MovieData, "rank">> = [
  {
    id: 1001,
    title: "Północny Horyzont",
    overview:
      "Zhańbiony pilot podejmuje ostatni lot przez polarną noc, aby dostarczyć szczepionkę, zanim niepowstrzymana burza unieruchomi wszystkie samoloty na Ziemi.",
    releaseYear: "2026",
    voteAverage: 8.4,
    popularity: 1420.55,
    genreNames: ["Thriller", "Przygodowy"],
    posterUrl: null,
    backdropUrl: null,
  },
  {
    id: 1002,
    title: "Szklane Archiwum",
    overview:
      "Archiwista odkrywa, że w zamkniętym skrzydle biblioteki narodowej przechowywane są wspomnienia zapisane w szkle — a ktoś kasuje je jedno po drugim.",
    releaseYear: "2025",
    voteAverage: 7.9,
    popularity: 1180.2,
    genreNames: ["Tajemnica", "Dramat"],
    posterUrl: null,
    backdropUrl: null,
  },
  {
    id: 1003,
    title: "Neonowa Delta",
    overview:
      "W zalanym megamieście kurierka z mechanicznym sercem wikła się w skok, który może kupić jej wolność — albo zatopić miasto na dobre.",
    releaseYear: "2026",
    voteAverage: 7.6,
    popularity: 990.4,
    genreNames: ["Science Fiction", "Akcja"],
    posterUrl: null,
    backdropUrl: null,
  },
  {
    id: 1004,
    title: "Listy z Latarni",
    overview:
      "Dwoje nieznajomych wymienia listy przez latarnię morską, która w jakikolwiek sposób dostarcza pocztę czterdzieści lat w przeszłość.",
    releaseYear: "2024",
    voteAverage: 8.1,
    popularity: 870.75,
    genreNames: ["Romans", "Fantasy"],
    posterUrl: null,
    backdropUrl: null,
  },
  {
    id: 1005,
    title: "Królowie Statyki",
    overview:
      "Załoga pirackiego radia nadającego z opuszczonej stacji metra staje się jedynym głosem, któremu miasto ufa, gdy sieć gaśnie.",
    releaseYear: "2025",
    voteAverage: 7.3,
    popularity: 640.15,
    genreNames: ["Kryminał", "Muzyka"],
    posterUrl: null,
    backdropUrl: null,
  },
];

export const polishWeekLabel = (): string =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

export const buildMockWeeklyData = (): WeeklyData => ({
  weekLabel: polishWeekLabel(),
  generatedAt: new Date().toISOString(),
  source: "mock",
  movies: MOCK_MOVIES.map((m, i) => ({
    ...m,
    rank: i + 1,
  })),
});
