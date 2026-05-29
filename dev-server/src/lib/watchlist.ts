// LocalStorage-backed watchlist with a tiny event bus so components refresh.
import * as React from "react";
import type { Movie } from "./tmdb";

const KEY = "cinemax:watchlist:v1";
const EVT = "cinemax:watchlist:update";

export type WatchItem = Pick<Movie, "id" | "title" | "name" | "poster_path" | "backdrop_path" | "vote_average" | "release_date" | "first_air_date" | "overview">;

const read = (): WatchItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};
const write = (items: WatchItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
};

export const toggleWatchlist = (item: WatchItem) => {
  const items = read();
  const exists = items.some((m) => m.id === item.id);
  write(exists ? items.filter((m) => m.id !== item.id) : [item, ...items]);
  return !exists;
};

export const useWatchlist = () => {
  const [items, setItems] = React.useState<WatchItem[]>([]);
  React.useEffect(() => {
    setItems(read());
    const onUpdate = () => setItems(read());
    window.addEventListener(EVT, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(EVT, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);
  return items;
};

export const useIsSaved = (id: number) => {
  const items = useWatchlist();
  return items.some((m) => m.id === id);
};