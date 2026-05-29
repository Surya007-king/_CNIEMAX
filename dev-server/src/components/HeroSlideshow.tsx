import * as React from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, Info, Star } from "lucide-react";
import { tmdb, backdrop, movieTitle, movieYear, type Movie } from "@/lib/tmdb";

export function HeroSlideshow() {
  const { data } = useQuery({
    queryKey: ["hero", "trending/movie/day"],
    queryFn: () => tmdb<{ results: Movie[] }>("trending/movie/day"),
    staleTime: 10 * 60_000,
  });

  const slides = (data?.results ?? []).filter((m) => m.backdrop_path).slice(0, 5);
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className="relative h-[78vh] min-h-[520px] bg-gradient-to-br from-secondary to-background animate-pulse" />
    );
  }

  const current = slides[idx];

  return (
    <div className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
      {slides.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === idx ? 1 : 0 }}
          aria-hidden={i !== idx}
        >
          <img
            src={backdrop(m.backdrop_path, "original")}
            alt=""
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero-side)" }} />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-4 sm:px-8 flex flex-col justify-end pb-20 sm:pb-28">
        <div key={current.id} className="max-w-2xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-4 text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Trending today
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-glow">
            {movieTitle(current)}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1.5 text-accent font-semibold">
              <Star className="w-4 h-4 fill-accent" />
              {current.vote_average.toFixed(1)}
            </span>
            <span className="text-muted-foreground">{movieYear(current)}</span>
            <span className="px-2 py-0.5 rounded border border-border text-xs text-muted-foreground">HD</span>
          </div>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground line-clamp-3 max-w-xl">
            {current.overview}
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              to="/movie/$id"
              params={{ id: String(current.id) }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[var(--gradient-primary)] text-primary-foreground font-semibold shadow-[var(--shadow-glow)] hover:scale-105 transition-transform"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Trailer
            </Link>
            <Link
              to="/movie/$id"
              params={{ id: String(current.id) }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full glass hover:bg-secondary transition-colors font-semibold"
            >
              <Info className="w-4 h-4" />
              More Info
            </Link>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex gap-2 mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === idx ? 40 : 16,
                background:
                  i === idx ? "var(--gradient-primary)" : "oklch(1 0 0 / 0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}