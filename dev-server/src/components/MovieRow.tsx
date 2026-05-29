import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tmdb, type Movie } from "@/lib/tmdb";
import { MovieCard, MovieCardSkeleton } from "./MovieCard";

type Props = {
  title: string;
  subtitle?: string;
  endpoint: string; // e.g. "trending/movie/week" or "movie/popular"
  params?: Record<string, string | number>;
};

export function MovieRow({ title, subtitle, endpoint, params }: Props) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["row", endpoint, params],
    queryFn: () => tmdb<{ results: Movie[] }>(endpoint, params),
    staleTime: 5 * 60_000,
  });

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <section className="relative group/row py-6 sm:py-8">
      <div className="px-4 sm:px-8 mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl tracking-wider">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="hidden sm:flex gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="w-10 h-10 grid place-items-center rounded-full glass hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="w-10 h-10 grid place-items-center rounded-full glass hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto px-4 sm:px-8 pb-4 scrollbar-hide scroll-smooth snap-x"
      >
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        {isError && (
          <div className="text-sm text-destructive py-8">Couldn't load this row. Try again later.</div>
        )}
        {data?.results.map((m) => (
          <div key={m.id} className="snap-start">
            <MovieCard movie={m} />
          </div>
        ))}
      </div>
    </section>
  );
}