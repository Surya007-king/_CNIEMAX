import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { tmdb, type Movie } from "@/lib/tmdb";
import { MovieCard, MovieCardSkeleton } from "./MovieCard";

type Page = { results: Movie[]; page: number; total_pages: number };

export function CategoryPage({
  title,
  subtitle,
  endpoint,
}: {
  title: string;
  subtitle?: string;
  endpoint: string;
}) {
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<Page>({
      queryKey: ["category", endpoint],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => tmdb<Page>(endpoint, { page: Number(pageParam) }),
      getNextPageParam: (last) => (last.page < last.total_pages ? last.page + 1 : undefined),
      staleTime: 5 * 60_000,
    });

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const movies = data?.pages.flatMap((p) => p.results) ?? [];

  return (
    <div className="pt-28 pb-16 max-w-[1600px] mx-auto px-4 sm:px-8">
      <header className="mb-10 animate-fade-up">
        <h1 className="font-display text-4xl sm:text-6xl">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </header>

      {isError && <p className="text-destructive">Couldn't load. Try refreshing.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 [&>*]:w-full">
        {isLoading &&
          Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} className="w-full sm:w-full md:w-full" />
        ))}
      </div>

      <div ref={sentinelRef} className="h-20 grid place-items-center mt-8">
        {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
        {!hasNextPage && movies.length > 0 && (
          <p className="text-sm text-muted-foreground">You've reached the end.</p>
        )}
      </div>
    </div>
  );
}