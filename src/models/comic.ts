import raw from "../data/comics.json" assert { type: "json" };
import type { Comic } from "../types/comic";

const comics: Comic[] = raw.map(
  (c): Comic => ({
    ...c,
    updatedAt: new Date(c.updatedAt),
  })
);

export function getAllComics(): Comic[] {
  return comics;
}

export function getComicById(id: string): Comic | undefined {
  return comics.find((c) => c.id === id);
}
