export interface IVelogPost {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  urlSlug: string;
  releasedAt: string;
  tags: string[];
}

export interface IVelogTagStat {
  name: string;
  count: number;
}

export interface IVelogArchive {
  fetchedAt: string;
  posts: IVelogPost[];
  tagStats: IVelogTagStat[];
}
