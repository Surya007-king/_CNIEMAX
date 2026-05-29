import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/top-rated")({
  head: () => ({
    meta: [
      { title: "Top Rated Movies — CINEMAX" },
      { name: "description", content: "The highest rated movies of all time." },
    ],
  }),
  component: () => (
    <CategoryPage
      title="Top Rated"
      subtitle="The highest scoring movies of all time"
      endpoint="movie/top_rated"
    />
  ),
});