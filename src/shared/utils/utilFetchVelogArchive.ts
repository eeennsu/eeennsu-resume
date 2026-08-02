import type { IVelogArchive } from '@shared/types/velog';

import archiveJson from '../../data/velog-posts.json';

const archive = archiveJson as IVelogArchive;

export const fetchVelogArchive = (): IVelogArchive => archive;
