import raw from "../data/comics.json" assert { type: "json" };
import type { Comic } from "../types/comic";
import type { Episode } from "../types/episode";

const comics: Comic[] = raw.map(
  (c): Comic => ({
    ...c,
    updatedAt: new Date(c.updatedAt),
    episodes: c.episodes,
  })
);

export function getAllComics(): Comic[] {
  return comics;
}

export function getComicById(id: string): Comic | undefined {
  return comics.find((c) => c.id === id);
}

export function getEpisodesByComicId(comicId: string): Episode[] {
  const comic = getComicById(comicId);
  if (!comic) return [];
  return comic.episodes;
}

export function getEpisodeByComicIdAndNumber(
  comicId: string,
  episodeNumber: number
): Episode | undefined {
  const comic = getComicById(comicId);
  if (!comic) return undefined;
  return comic.episodes.find((e) => e.number === episodeNumber);
}
