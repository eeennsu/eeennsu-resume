import 'server-only';

import type { IVelogArchive } from '@shared/types/velog';
import fs from 'fs';
import path from 'path';

const ARCHIVE_PATH = path.join(process.cwd(), 'src', 'data', 'velog-posts.json');

const buildEmptyArchive = (): IVelogArchive => ({
  fetchedAt: new Date(0).toISOString(),
  posts: [],
  tagStats: [],
});

export const fetchVelogArchive = (): IVelogArchive => {
  try {
    if (!fs.existsSync(ARCHIVE_PATH)) return buildEmptyArchive();
    const raw = fs.readFileSync(ARCHIVE_PATH, 'utf8');
    return JSON.parse(raw) as IVelogArchive;
  } catch (err) {
    console.error(`Failed to load velog archive from ${ARCHIVE_PATH}`, err);
    return buildEmptyArchive();
  }
};
