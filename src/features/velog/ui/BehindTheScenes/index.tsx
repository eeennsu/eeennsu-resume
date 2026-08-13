import dayjs from 'dayjs';
import { type FC } from 'react';

import type { IVelogArchive } from '@shared/types/velog';

import Diagram from './Diagram';
import FadeInWrapper from './FadeInWrapper';

interface Props {
  archive: IVelogArchive;
  labels: {
    title: string;
    description: string;
    cronNote: string;
    stack: string[];
    stats: {
      posts: string;
      tags: string;
      lastFetched: string;
    };
    steps: {
      source: string;
      fetch: string;
      seed: string;
      render: string;
      output: string;
    };
  };
}

const EMPTY_ISO = new Date(0).toISOString();

const BehindTheScenes: FC<Props> = ({ archive, labels }) => {
  const fetchedLabel =
    archive.fetchedAt && archive.fetchedAt !== EMPTY_ISO
      ? dayjs(archive.fetchedAt).format('YYYY.MM.DD HH:mm')
      : '—';

  return (
    <section
      aria-labelledby='writings-behind-heading'
      className='border-border mx-6 rounded-2xl border bg-gray-50 p-6 md:mx-auto md:max-w-6xl md:p-10 dark:bg-gray-900/40'
    >
      <FadeInWrapper className='flex flex-col gap-5'>
        <header className='flex flex-col gap-2'>
          <h2
            id='writings-behind-heading'
            className='text-foreground text-lg font-semibold tracking-tight md:text-xl'
          >
            {labels.title}
          </h2>
          <p className='text-muted-foreground text-[14px] leading-relaxed'>{labels.description}</p>
        </header>

        <Diagram
          labels={{
            steps: labels.steps,
            cronNote: labels.cronNote,
          }}
        />

        <dl className='text-body-s grid grid-cols-2 gap-3 text-gray-700 md:grid-cols-3 dark:text-gray-300'>
          <div className='border-border rounded-lg border bg-white/80 px-3 py-2 dark:bg-gray-950/40'>
            <dt className='text-caption text-muted-foreground font-semibold tracking-wider uppercase'>
              posts
            </dt>
            <dd className='mt-0.5 tabular-nums'>
              {labels.stats.posts.replace('{{count}}', String(archive.posts.length))}
            </dd>
          </div>
          <div className='border-border rounded-lg border bg-white/80 px-3 py-2 dark:bg-gray-950/40'>
            <dt className='text-caption text-muted-foreground font-semibold tracking-wider uppercase'>
              tags
            </dt>
            <dd className='mt-0.5 tabular-nums'>
              {labels.stats.tags.replace('{{count}}', String(archive.tagStats.length))}
            </dd>
          </div>
          <div className='border-border rounded-lg border bg-white/80 px-3 py-2 dark:bg-gray-950/40'>
            <dt className='text-caption text-muted-foreground font-semibold tracking-wider uppercase'>
              fetched
            </dt>
            <dd className='mt-0.5 tabular-nums'>
              {labels.stats.lastFetched.replace('{{when}}', fetchedLabel)}
            </dd>
          </div>
        </dl>

        <ul className='flex flex-wrap gap-2'>
          {labels.stack.map(item => (
            <li
              key={item}
              className='border-border text-caption inline-flex items-center rounded-full border bg-white px-2.5 py-1 font-medium text-gray-700 dark:bg-gray-950/40 dark:text-gray-300'
            >
              {item}
            </li>
          ))}
        </ul>
      </FadeInWrapper>
    </section>
  );
};

export default BehindTheScenes;
