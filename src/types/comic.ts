import type { Episode } from "./episode";

export interface Comic {
  id: string;
  title: string;
  description?: string;
  ext: string;
  updatedAt: Date;
  episodes: Episode[];
}
