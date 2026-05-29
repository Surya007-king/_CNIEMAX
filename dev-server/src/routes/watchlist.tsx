import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { MovieCard } from "@/components/MovieCard";
import { useWatchlist } from "@/lib/watchlist";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "My Watchlist — CINEMAX" },
      { name: "description", content: "Movies you've saved to watch later." },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const items = useWatchlist();

  return (
    <div className="pt-28 pb-16 max-w-[1600px] mx-auto px-4 sm:px-8">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Bookmark className="w-3.5 h-3.5" /> Saved for later
        </div>
        <h1 className="font-display text-4xl sm:text-6xl">My Watchlist</h1>
        <p className="text-muted-foreground mt-2">
          {items.length} {items.length === 1 ? "title" : "titles"} saved.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-lg text-muted-foreground">Your watchlist is empty.</p>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2.5 rounded-full bg-[var(--gradient-primary)] text-primary-foreground font-semibold hover:scale-105 transition-transform"
          >
            Discover movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 [&>*]:w-full">
          {items.map((m) => (
            <MovieCard key={m.id} movie={{ ...m, poster_path: m.poster_path, backdrop_path: m.backdrop_path } as never} className="w-full sm:w-full md:w-full" />
          ))}
        </div>
      )}
    </div>
  );
}