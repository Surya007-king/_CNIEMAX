import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, Star, Calendar, Clock, Bookmark, BookmarkCheck, ArrowLeft } from "lucide-react";
import {
  tmdb,
  backdrop,
  poster as posterUrl,
  profile as profileUrl,
  trailerKey,
  type MovieDetails,
} from "@/lib/tmdb";
import { toggleWatchlist, useIsSaved } from "@/lib/watchlist";
import { TrailerModal } from "@/components/TrailerModal";
import { MovieCard } from "@/components/MovieCard";

export const Route = createFileRoute("/movie/$id")({
  head: () => ({
    meta: [
      { title: "Movie details — CINEMAX" },
      { name: "description", content: "Movie details, trailer, cast and recommendations." },
    ],
  }),
  component: MoviePage,
});

function MoviePage() {
  const { id } = Route.useParams();
  const [trailerOpen, setTrailerOpen] = React.useState(false);
  const saved = useIsSaved(Number(id));

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: () =>
      tmdb<MovieDetails>(`movie/${id}`, {
        append_to_response: "videos,credits,recommendations,similar",
      }),
    staleTime: 5 * 60_000,
  });

  if (isLoading) {
    return (
      <div className="pt-16">
        <div className="h-[60vh] animate-pulse bg-secondary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="pt-32 text-center px-4">
        <h1 className="text-2xl font-display">Couldn't load this movie</h1>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Back home
        </Link>
      </div>
    );
  }

  const tKey = trailerKey(data.videos);
  const director = ""; // optional
  const recs = data.recommendations?.results?.length
    ? data.recommendations.results
    : data.similar?.results ?? [];

  return (
    <article>
      {/* Backdrop */}
      <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
        {data.backdrop_path && (
          <img
            src={backdrop(data.backdrop_path, "original")}
            alt=""
            className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
          />
        )}
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero-side)" }} />

        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-24 pb-12 flex items-end">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {data.poster_path && (
              <img
                src={posterUrl(data.poster_path, "w500")}
                alt={data.title}
                className="hidden md:block w-64 rounded-2xl shadow-[var(--shadow-card)] border border-border animate-fade-up"
              />
            )}
            <div className="flex-1 animate-fade-up">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Link>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-glow">
                {data.title}
              </h1>
              {data.tagline && (
                <p className="mt-2 text-base sm:text-lg text-muted-foreground italic">
                  "{data.tagline}"
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-5 text-sm">
                <span className="flex items-center gap-1.5 text-accent font-bold text-base">
                  <Star className="w-5 h-5 fill-accent" />
                  {data.vote_average.toFixed(1)}
                  <span className="text-muted-foreground font-normal">({data.vote_count.toLocaleString()})</span>
                </span>
                {data.release_date && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" /> {data.release_date}
                  </span>
                )}
                {data.runtime ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {data.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 rounded-full text-xs border border-border bg-secondary/60"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-base text-foreground/90 max-w-3xl leading-relaxed">
                {data.overview}
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[var(--gradient-primary)] text-primary-foreground font-semibold shadow-[var(--shadow-glow)] hover:scale-105 transition-transform"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {tKey ? "Play Trailer" : "No Trailer"}
                </button>
                <button
                  onClick={() =>
                    toggleWatchlist({
                      id: data.id,
                      title: data.title,
                      poster_path: data.poster_path,
                      backdrop_path: data.backdrop_path,
                      vote_average: data.vote_average,
                      release_date: data.release_date,
                      overview: data.overview,
                    })
                  }
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full glass hover:bg-secondary font-semibold"
                >
                  {saved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      Add to Watchlist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast */}
      {data.credits?.cast?.length ? (
        <section className="py-10">
          <h2 className="font-display text-2xl sm:text-3xl tracking-wider px-4 sm:px-8 mb-5">
            Top Cast
          </h2>
          <div className="flex gap-4 overflow-x-auto px-4 sm:px-8 pb-4 scrollbar-hide">
            {data.credits.cast.slice(0, 18).map((c) => (
              <div key={c.id} className="w-32 shrink-0 text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary mb-2 border border-border">
                  {c.profile_path ? (
                    <img
                      src={profileUrl(c.profile_path)}
                      alt={c.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">
                      {c.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold line-clamp-1">{c.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{c.character}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Recommendations */}
      {recs.length > 0 && (
        <section className="py-10">
          <h2 className="font-display text-2xl sm:text-3xl tracking-wider px-4 sm:px-8 mb-5">
            You May Also Like
          </h2>
          <div className="flex gap-4 sm:gap-5 overflow-x-auto px-4 sm:px-8 pb-4 scrollbar-hide">
            {recs.slice(0, 20).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>
      )}

      <TrailerModal open={trailerOpen} youtubeKey={tKey} onClose={() => setTrailerOpen(false)} />
    </article>
  );
}