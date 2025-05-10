import { comics } from "../data/comics";
import type { Comic, ComicCategory } from "@types/comic";
import type { Episode } from "@types/episode";

export function getAllComics(): Comic[] {
  return comics;
}

export function getComicsByCategory(category: ComicCategory): Comic[] {
  return comics.filter((c) => c.category === category);
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
