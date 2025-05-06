import type { Episode } from "./episode";

export type ComicCategory = "original" | "collaboration";

export interface Comic {
  id: string;
  title: string;
  description?: string;
  thumbnailExt: string;
  category: ComicCategory;
  updatedAt: Date;
  episodes: Episode[];
}
