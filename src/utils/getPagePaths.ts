import fs from "fs";
import path from "path";

export function getPagePaths(
  comicId: string,
  episodeNumber?: string
): string[] {
  const base = import.meta.env.BASE_URL;
  const pagesBase = episodeNumber
    ? `assets/comics/${comicId}/episodes/${episodeNumber}/pages`
    : `assets/comics/${comicId}/pages`;
  const pagesDir = path.resolve(`./public/${pagesBase}`);

  let pages: string[] = [];
  try {
    pages = fs.readdirSync(pagesDir).sort();
  } catch (err) {
    console.error(`Error reading images for comic ID ${comicId}:`, err);
  }

  if (pages.length === 0) {
    throw new Error(
      `No images found for comic ID ${comicId} in directory ${pagesDir}`
    );
  }

  return pages.map((name) => {
    return `${base}${pagesBase}/${name}`;
  });
}
