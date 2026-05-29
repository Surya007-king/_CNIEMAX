import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/upcoming")({
  head: () => ({
    meta: [
      { title: "Upcoming Movies — CINEMAX" },
      { name: "description", content: "Movies arriving in theaters soon." },
    ],
  }),
  component: () => (
    <CategoryPage
      title="Upcoming"
      subtitle="Hitting theaters soon"
      endpoint="movie/upcoming"
    />
  ),
});