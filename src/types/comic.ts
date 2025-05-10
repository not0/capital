import type { Episode } from "./episode";

export type ComicCategory = "original" | "collaboration";
export type ComicViewer = "horizontal" | "vertical";
export type StartSide = "left" | "right";

export interface Comic {
  id: string;
  title: string;
  description?: string;
  thumbnailExt: string;
  category: ComicCategory;
  viewer: ComicViewer;
  startSide?: StartSide;
  updatedAt: Date;
  episodes: Episode[];
}
