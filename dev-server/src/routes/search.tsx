import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { z } from "zod";
import { tmdb, type Movie } from "@/lib/tmdb";
import { MovieCard, MovieCardSkeleton } from "@/components/MovieCard";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Search — CINEMAX" },
      { name: "description", content: "Search movies, TV shows and actors on CINEMAX." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const term = (q ?? "").trim();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", term],
    queryFn: () =>
      tmdb<{ results: (Movie & { media_type: "movie" | "tv" | "person" })[] }>(
        "search/multi",
        { query: term, include_adult: "false" },
      ),
    enabled: term.length > 0,
    staleTime: 60_000,
  });

  const results = (data?.results ?? []).filter(
    (r) => r.media_type !== "person" && r.poster_path,
  );

  return (
    <div className="pt-28 pb-16 max-w-[1600px] mx-auto px-4 sm:px-8">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <SearchIcon className="w-3.5 h-3.5" /> Search results
        </div>
        <h1 className="font-display text-4xl sm:text-6xl">
          {term ? (
            <>
              <span className="text-muted-foreground">Results for</span>{" "}
              <span className="gradient-text">"{term}"</span>
            </>
          ) : (
            "Start typing to search"
          )}
        </h1>
      </header>

      {term && isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <p className="text-destructive">Something went wrong. Try again.</p>}

      {term && !isLoading && results.length === 0 && (
        <p className="text-muted-foreground">No matches. Try a different search.</p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 [&>*]:w-full">
          {results.map((m) => (
            <MovieCard key={`${m.media_type}-${m.id}`} movie={m} className="w-full sm:w-full md:w-full" />
          ))}
        </div>
      )}
    </div>
  );
}