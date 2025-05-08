import type { Episode } from "./episode";

export type ComicCategory = "original" | "collaboration";
export type ComicViewer = "horizontal" | "vertical";

export interface Comic {
  id: string;
  title: string;
  description?: string;
  thumbnailExt: string;
  category: ComicCategory;
  viewer: ComicViewer;
  updatedAt: Date;
  episodes: Episode[];
}
