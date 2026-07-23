import type { IVelogArchive } from '@shared/types/velog';
import { type FC } from 'react';

import VelogPostCard from '@features/velog/ui/VelogPostCard';

import TagCloudFilter from './TagCloudFilter';

interface Props {
  archive: IVelogArchive;
  activeTag: string | null;
  labels: {
    allLabel: string;
    emptyLabel: string;
    recentBadge: string;
  };
  isRecent?: (releasedAt: string) => boolean;
}

const TagCloud: FC<Props> = ({ archive, activeTag, labels, isRecent }) => {
  const filtered = activeTag
    ? archive.posts.filter(post => post.tags.includes(activeTag))
    : archive.posts;

  return (
    <section
      aria-labelledby='writings-tagcloud-heading'
      className='flex flex-col gap-5 px-6 md:mx-auto md:max-w-6xl md:px-12'
    >
      <h2 id='writings-tagcloud-heading' className='sr-only'>
        Tag Cloud
      </h2>
      <TagCloudFilter
        tagStats={archive.tagStats}
        activeTag={activeTag}
        allLabel={labels.allLabel}
      />
      {filtered.length === 0 ? (
        <p className='rounded-xl border border-dashed border-gray-300 bg-white/50 px-6 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-400'>
          {labels.emptyLabel}
        </p>
      ) : (
        <ul className='grid gap-4 md:grid-cols-2'>
          {filtered.map(post => (
            <li key={post.id}>
              <VelogPostCard
                post={post}
                isRecent={isRecent?.(post.releasedAt)}
                recentLabel={labels.recentBadge}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TagCloud;
