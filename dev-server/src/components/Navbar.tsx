import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Film, Bookmark, Menu, X, TrendingUp, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/lib/watchlist";

const links = [
  { to: "/", label: "Home", icon: Film },
  { to: "/trending", label: "Trending", icon: TrendingUp },
  { to: "/top-rated", label: "Top Rated", icon: Star },
  { to: "/upcoming", label: "Upcoming", icon: Clock },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const navigate = useNavigate();
  const watch = useWatchlist();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    navigate({ to: "/search", search: { q: term } });
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "glass shadow-2xl" : "bg-gradient-to-b from-background/90 to-transparent",
      )}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 h-16 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-[var(--gradient-primary)] grid place-items-center shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform">
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl tracking-widest">
            CINE<span className="text-primary">MAX</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors relative"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden md:flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search movies, shows, actors…"
            className="pl-9 pr-3 h-10 w-64 lg:w-80 rounded-full bg-secondary/60 border border-border focus:border-primary focus:bg-secondary focus:w-96 outline-none transition-all text-sm"
          />
        </form>

        <Link
          to="/watchlist"
          className="hidden md:flex relative items-center gap-2 px-3 py-2 rounded-full hover:bg-secondary/60 transition-colors text-sm"
        >
          <Bookmark className="w-4 h-4" />
          <span>Watchlist</span>
          {watch.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-primary text-primary-foreground font-bold">
              {watch.length}
            </span>
          )}
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden ml-auto p-2 rounded-md hover:bg-secondary"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-[max-height] duration-300 glass border-t border-border",
          open ? "max-h-[480px]" : "max-h-0",
        )}
      >
        <div className="px-4 py-4 space-y-3">
          <form onSubmit={submit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="pl-9 pr-3 h-11 w-full rounded-full bg-secondary border border-border outline-none text-sm"
            />
          </form>
          <nav className="grid gap-1">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary text-sm"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  {l.label}
                </Link>
              );
            })}
            <Link
              to="/watchlist"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary text-sm"
            >
              <Bookmark className="w-4 h-4 text-primary" />
              Watchlist {watch.length > 0 && <span className="text-xs text-muted-foreground">({watch.length})</span>}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}