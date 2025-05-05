import type { Episode } from "./episode";

export interface Comic {
  id: string;
  title: string;
  description?: string;
  thumbnailExt: string;
  updatedAt: Date;
  episodes: Episode[];
}
