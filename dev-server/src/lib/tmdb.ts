// Typed TMDb client + helpers. All requests go through the /api/tmdb proxy.

export const IMG = "https://image.tmdb.org/t/p";
export const poster = (p: string | null, size: "w342" | "w500" | "w780" = "w500") =>
  p ? `${IMG}/${size}${p}` : "";
export const backdrop = (p: string | null, size: "w780" | "w1280" | "original" = "w1280") =>
  p ? `${IMG}/${size}${p}` : "";
export const profile = (p: string | null, size: "w185" | "h632" = "w185") =>
  p ? `${IMG}/${size}${p}` : "";

export type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: "movie" | "tv" | "person";
};

export type MovieDetails = Movie & {
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  vote_count: number;
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  videos?: {
    results: { id: string; key: string; site: string; type: string; name: string }[];
  };
  similar?: { results: Movie[] };
  recommendations?: { results: Movie[] };
};

export async function tmdb<T = unknown>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const url = `/api/tmdb/${path}${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const movieTitle = (m: Movie) => m.title ?? m.name ?? "Untitled";
export const movieYear = (m: Movie) => {
  const d = m.release_date || m.first_air_date;
  return d ? d.slice(0, 4) : "";
};

export const trailerKey = (videos?: MovieDetails["videos"]) => {
  const list = videos?.results ?? [];
  const yt = list.filter((v) => v.site === "YouTube");
  const pick =
    yt.find((v) => v.type === "Trailer") ??
    yt.find((v) => v.type === "Teaser") ??
    yt[0];
  return pick?.key;
};