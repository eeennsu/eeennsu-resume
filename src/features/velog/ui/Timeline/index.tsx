import dayjs from 'dayjs';
import { type FC, type ReactNode } from 'react';

import VelogPostCard from '@features/velog/ui/VelogPostCard';

import type { IVelogArchive, IVelogPost } from '@shared/types/velog';

interface Props {
  archive: IVelogArchive;
  labels: {
    emptyLabel: string;
    recentBadge: string;
  };
  isRecent?: (releasedAt: string) => boolean;
  renderCrossLink?: (post: IVelogPost) => ReactNode;
}

const groupByYearMonth = (
  posts: IVelogPost[],
): Array<{ key: string; label: string; posts: IVelogPost[] }> => {
  const sorted = [...posts].sort((a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt));
  const buckets = new Map<string, IVelogPost[]>();
  for (const post of sorted) {
    const key = dayjs(post.releasedAt).format('YYYY.MM');
    const bucket = buckets.get(key) ?? [];
    bucket.push(post);
    buckets.set(key, bucket);
  }
  return Array.from(buckets.entries()).map(([key, group]) => ({
    key,
    label: key,
    posts: group,
  }));
};

const Timeline: FC<Props> = ({ archive, labels, isRecent, renderCrossLink }) => {
  if (archive.posts.length === 0) {
    return (
      <p className='text-muted-foreground mx-6 rounded-xl border border-dashed border-gray-300 bg-white/50 px-6 py-10 text-center text-sm md:mx-auto md:max-w-6xl dark:border-gray-700 dark:bg-gray-950/40'>
        {labels.emptyLabel}
      </p>
    );
  }

  const groups = groupByYearMonth(archive.posts);

  return (
    <section
      aria-labelledby='writings-timeline-heading'
      className='flex flex-col gap-8 px-6 md:mx-auto md:max-w-6xl md:px-12'
    >
      <h2 id='writings-timeline-heading' className='sr-only'>
        Timeline
      </h2>
      <ol className='border-border flex flex-col gap-10 border-l pl-6'>
        {groups.map(group => (
          <li key={group.key} className='relative flex flex-col gap-4'>
            <span
              aria-hidden
              className='absolute top-1.5 -left-[29px] flex size-3 items-center justify-center rounded-full border-2 border-white bg-blue-500 dark:border-gray-950 dark:bg-blue-400'
            />
            <h3 className='text-body-s text-muted-foreground font-semibold tracking-wider uppercase tabular-nums'>
              {group.label}
            </h3>
            <ul className='flex flex-col gap-3'>
              {group.posts.map(post => (
                <li key={post.id}>
                  <VelogPostCard
                    post={post}
                    isRecent={isRecent?.(post.releasedAt)}
                    recentLabel={labels.recentBadge}
                  >
                    {renderCrossLink?.(post)}
                  </VelogPostCard>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Timeline;
