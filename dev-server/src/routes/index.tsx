import { createFileRoute } from "@tanstack/react-router";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { MovieRow } from "@/components/MovieRow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CINEMAX — Discover trending movies & shows" },
      { name: "description", content: "Trending, popular, top rated and upcoming movies with trailers, cast and your personal watchlist." },
      { property: "og:title", content: "CINEMAX — Discover trending movies & shows" },
      { property: "og:description", content: "A cinematic movie discovery experience." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <HeroSlideshow />
      <div className="space-y-2 -mt-10 relative z-20">
        <MovieRow title="Trending This Week" subtitle="What everyone's watching" endpoint="trending/movie/week" />
        <MovieRow title="Popular" subtitle="Audience favorites right now" endpoint="movie/popular" />
        <MovieRow title="Top Rated" subtitle="Highest scoring of all time" endpoint="movie/top_rated" />
        <MovieRow title="Upcoming" subtitle="Coming soon to theaters" endpoint="movie/upcoming" />
        <MovieRow title="On TV" subtitle="Hit series on the air" endpoint="tv/popular" />
      </div>
    </div>
  );
}
