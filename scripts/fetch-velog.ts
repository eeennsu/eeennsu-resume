import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { VELOG_GRAPHQL_ENDPOINT, VELOG_USERNAME } from '../src/shared/consts/velog';
import type { IVelogArchive, IVelogPost, IVelogTagStat } from '../src/shared/types/velog';

const OUTPUT_PATH = join(process.cwd(), 'src', 'data', 'velog-posts.json');
const PAGE_LIMIT = 100;
const MAX_PAGES = 50;

interface RawVelogPost {
  id: string;
  title: string | null;
  short_description: string | null;
  thumbnail: string | null;
  url_slug: string;
  released_at: string | null;
  tags: string[] | null;
}

const POSTS_QUERY = `
  query Posts($username: String!, $cursor: ID, $limit: Int) {
    posts(username: $username, cursor: $cursor, limit: $limit) {
      id
      title
      short_description
      thumbnail
      url_slug
      released_at
      tags
    }
  }
`;

const readExistingArchive = (): IVelogArchive | null => {
  try {
    if (!existsSync(OUTPUT_PATH)) return null;
    const raw = readFileSync(OUTPUT_PATH, 'utf8');
    return JSON.parse(raw) as IVelogArchive;
  } catch (error) {
    console.error(`[fetch-velog] failed to read existing archive: ${String(error)}`);
    return null;
  }
};

const writeArchive = (archive: IVelogArchive): void => {
  const outputDir = dirname(OUTPUT_PATH);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(archive, null, 2)}\n`, 'utf8');
};

const normalizePost = (raw: RawVelogPost): IVelogPost => ({
  id: raw.id,
  title: raw.title ?? '',
  description: raw.short_description ?? '',
  thumbnail: raw.thumbnail,
  urlSlug: raw.url_slug,
  releasedAt: raw.released_at ?? '',
  tags: raw.tags ?? [],
});

const computeTagStats = (posts: IVelogPost[]): IVelogTagStat[] => {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

const fetchPage = async (cursor: string | null): Promise<RawVelogPost[]> => {
  const response = await fetch(VELOG_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: POSTS_QUERY,
      variables: { username: VELOG_USERNAME, cursor, limit: PAGE_LIMIT },
    }),
  });
  if (!response.ok) {
    throw new Error(`GraphQL HTTP ${response.status} ${response.statusText}`);
  }
  const payload = (await response.json()) as {
    data?: { posts?: RawVelogPost[] };
    errors?: Array<{ message: string }>;
  };
  if (payload.errors && payload.errors.length > 0) {
    throw new Error(`GraphQL errors: ${payload.errors.map(e => e.message).join('; ')}`);
  }
  return payload.data?.posts ?? [];
};

const fetchAllPosts = async (): Promise<IVelogPost[]> => {
  const all: IVelogPost[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const raw = await fetchPage(cursor);
    if (raw.length === 0) break;
    for (const p of raw) all.push(normalizePost(p));
    cursor = raw[raw.length - 1]?.id ?? null;
    if (!cursor || raw.length < PAGE_LIMIT) break;
  }
  return all;
};

const buildEmptyArchive = (): IVelogArchive => ({
  fetchedAt: new Date().toISOString(),
  posts: [],
  tagStats: [],
});

const run = async (): Promise<void> => {
  const existing = readExistingArchive();
  try {
    const posts = await fetchAllPosts();
    const archive: IVelogArchive = {
      fetchedAt: new Date().toISOString(),
      posts,
      tagStats: computeTagStats(posts),
    };
    writeArchive(archive);
    console.log(
      `[fetch-velog] OK — ${posts.length} posts, ${archive.tagStats.length} tags. written to ${OUTPUT_PATH}`,
    );
  } catch (error) {
    console.error(`[fetch-velog] FAIL — ${String(error)}`);
    if (existing) {
      console.error('[fetch-velog] keeping previous velog-posts.json (seed retained)');
    } else {
      try {
        writeArchive(buildEmptyArchive());
        console.error('[fetch-velog] wrote empty archive as fallback');
      } catch (writeError) {
        console.error(`[fetch-velog] failed to write empty archive: ${String(writeError)}`);
      }
    }
  }
};

void run().finally(() => {
  process.exit(0);
});
