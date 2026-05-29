import { createFileRoute } from "@tanstack/react-router";

// Server proxy for The Movie Database (TMDb) API.
// Keeps the API key on the server. The client fetches /api/tmdb/<path>?<params>.
export const Route = createFileRoute("/api/tmdb/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const key = process.env.TMDB_API_KEY;
        if (!key) {
          return Response.json({ error: "TMDB_API_KEY not configured" }, { status: 500 });
        }

        const path = (params as { _splat?: string })._splat ?? "";
        const incoming = new URL(request.url);
        const upstream = new URL(`https://api.themoviedb.org/3/${path}`);
        incoming.searchParams.forEach((v, k) => upstream.searchParams.set(k, v));

        // Support both v4 bearer tokens (long JWT-ish) and v3 api_key query keys.
        const isBearer = key.length > 60;
        if (!isBearer) {
          upstream.searchParams.set("api_key", key);
        }

        try {
          const res = await fetch(upstream.toString(), {
            headers: isBearer
              ? { Authorization: `Bearer ${key}`, accept: "application/json" }
              : { accept: "application/json" },
          });
          const body = await res.text();
          return new Response(body, {
            status: res.status,
            headers: {
              "content-type": res.headers.get("content-type") ?? "application/json",
              "cache-control": "public, max-age=120, s-maxage=300",
            },
          });
        } catch (err) {
          return Response.json(
            { error: "Upstream TMDb request failed", details: String(err) },
            { status: 502 },
          );
        }
      },
    },
  },
});