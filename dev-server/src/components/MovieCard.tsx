import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Star, Bookmark, BookmarkCheck, Play } from "lucide-react";
import { poster as posterUrl, movieTitle, movieYear, type Movie } from "@/lib/tmdb";
import { toggleWatchlist, useIsSaved } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

export function MovieCard({ movie, className }: { movie: Movie; className?: string }) {
  const saved = useIsSaved(movie.id);
  const img = posterUrl(movie.poster_path);
  const rating = Math.round(movie.vote_average * 10) / 10;
  const ratingPct = Math.min(100, Math.max(0, movie.vote_average * 10));

  return (
    <Link
      to="/movie/$id"
      params={{ id: String(movie.id) }}
      className={cn(
        "group relative block w-[160px] sm:w-[180px] md:w-[200px] shrink-0 rounded-xl overflow-hidden",
        "bg-card border border-border/60 transition-all duration-500",
        "hover:scale-[1.06] hover:z-10 hover:border-primary/60 hover:shadow-[var(--shadow-glow)]",
        className,
      )}
    >
      <div className="relative aspect-[2/3] bg-muted overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={movieTitle(movie)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Rating chip */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full glass text-xs font-semibold">
          <Star className="w-3 h-3 fill-accent text-accent" />
          {rating.toFixed(1)}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWatchlist({
              id: movie.id,
              title: movie.title,
              name: movie.name,
              poster_path: movie.poster_path,
              backdrop_path: movie.backdrop_path,
              vote_average: movie.vote_average,
              release_date: movie.release_date,
              first_air_date: movie.first_air_date,
              overview: movie.overview,
            });
          }}
          aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
          className="absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-full glass hover:bg-primary/90 transition-colors"
        >
          {saved ? (
            <BookmarkCheck className="w-4 h-4 text-primary" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary grid place-items-center shadow-[var(--shadow-glow)]">
              <Play className="w-3.5 h-3.5 fill-primary-foreground text-primary-foreground" />
            </div>
            <span className="text-xs font-medium">Watch details</span>
          </div>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {movieTitle(movie)}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-muted-foreground">{movieYear(movie)}</span>
          <div className="h-1 w-16 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-[var(--gradient-primary)] transition-all"
              style={{ width: `${ratingPct}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="w-[160px] sm:w-[180px] md:w-[200px] shrink-0 rounded-xl overflow-hidden bg-card border border-border/60">
      <div className="aspect-[2/3] animate-shimmer bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded animate-shimmer bg-muted" />
        <div className="h-2 w-1/2 rounded animate-shimmer bg-muted" />
      </div>
    </div>
  );
}