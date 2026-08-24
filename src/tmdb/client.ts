import type { MovieData } from "../types";

const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";
const LANGUAGE = "pl-PL";

export class TmdbError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "TmdbError";
  }
}

const requireApiKey = (): string => {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new TmdbError(
      "TMDB_API_KEY is not set. Copy .env.example to .env and add your key.",
    );
  }
  return key;
};

interface TmdbMovieSummary {
  id: number;
  title?: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  popularity?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  genre_ids?: number[];
}

interface TmdbListResponse {
  results: TmdbMovieSummary[];
}

interface TmdbMovieDetail extends TmdbMovieSummary {
  genres?: Array<{ id: number; name: string }>;
}

let genreMap: Map<number, string> | null = null;

const tmdbFetch = async <T>(path: string, params = {}): Promise<T> => {
  const apiKey = requireApiKey();
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", LANGUAGE);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  let response: Response;
  try {
    response = await fetch(url);
  } catch (cause) {
    throw new TmdbError(`Network error while calling ${path}: ${String(cause)}`);
  }
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new TmdbError(
      `TMDB request failed (${response.status}) for ${path}: ${body.slice(0, 200)}`,
      response.status,
    );
  }
  return (await response.json()) as T;
};

const getGenreMap = async (): Promise<Map<number, string>> => {
  if (genreMap) return genreMap;
  const data = await tmdbFetch<{ genres: Array<{ id: number; name: string }> }>(
    "/genre/movie/list",
  );
  genreMap = new Map(data.genres.map((g) => [g.id, g.name]));
  return genreMap;
};

const polishDateLabel = (): string =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

export const fetchTop5Movies = async (): Promise<MovieData[]> => {
  const list = await tmdbFetch<TmdbListResponse>("/trending/movie/week", {
    window: "week",
  });
  const candidates = [...list.results].sort(
    (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
  );
  const top = candidates.slice(0, 5);
  if (top.length === 0) {
    throw new TmdbError("TMDB returned no trending movies.");
  }

  await getGenreMap().catch(() => null);

  const movies: MovieData[] = [];
  for (let i = 0; i < top.length; i++) {
    const item = top[i];
    let detail: TmdbMovieDetail;
    try {
      detail = await tmdbFetch<TmdbMovieDetail>(`/movie/${item.id}`);
    } catch (error) {
      console.warn(`[tmdb] details failed for "${item.title}" — using list data.`, error);
      detail = { ...item };
    }

    const genres =
      detail.genres?.map((g) => g.name) ??
      (detail.genre_ids ?? [])
        .map((id) => genreMap?.get(id))
        .filter((n): n is string => Boolean(n));

    movies.push({
      rank: i + 1,
      id: detail.id,
      title: detail.title || `Film #${detail.id}`,
      overview: detail.overview?.trim() || "",
      releaseYear: detail.release_date ? detail.release_date.slice(0, 4) : null,
      voteAverage: Math.round((detail.vote_average ?? 0) * 10) / 10,
      popularity: Math.round((detail.popularity ?? 0) * 10) / 10,
      genreNames: genres,
      posterUrl: detail.poster_path
        ? `${IMAGE_BASE}/w780${detail.poster_path}`
        : null,
      backdropUrl: detail.backdrop_path
        ? `${IMAGE_BASE}/w1280${detail.backdrop_path}`
        : null,
    });

    if (!movies[i].posterUrl) {
      console.warn(`[tmdb] no poster found for "${movies[i].title}" — placeholder will be used.`);
    }
  }
  return movies;
};

export const polishWeekLabel = polishDateLabel;
