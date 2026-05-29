import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/trending")({
  head: () => ({
    meta: [
      { title: "Trending Movies — CINEMAX" },
      { name: "description", content: "What everyone is watching this week." },
    ],
  }),
  component: () => (
    <CategoryPage
      title="Trending"
      subtitle="What everyone is watching this week"
      endpoint="trending/movie/week"
    />
  ),
});