import type { IVelogArchive } from '@shared/types/velog';
import dayjs from 'dayjs';
import { type FC } from 'react';

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
      className='mx-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:mx-auto md:max-w-6xl md:p-10 dark:border-gray-800 dark:bg-gray-900/40'
    >
      <FadeInWrapper className='flex flex-col gap-5'>
        <header className='flex flex-col gap-2'>
          <h2
            id='writings-behind-heading'
            className='text-lg font-semibold tracking-tight text-gray-900 md:text-xl dark:text-gray-100'
          >
            {labels.title}
          </h2>
          <p className='text-[14px] leading-relaxed text-gray-600 dark:text-gray-400'>
            {labels.description}
          </p>
        </header>

        <Diagram
          labels={{
            steps: labels.steps,
            cronNote: labels.cronNote,
          }}
        />

        <dl className='grid grid-cols-2 gap-3 text-[13px] text-gray-700 md:grid-cols-3 dark:text-gray-300'>
          <div className='rounded-lg border border-gray-200 bg-white/80 px-3 py-2 dark:border-gray-800 dark:bg-gray-950/40'>
            <dt className='text-[11px] font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400'>
              posts
            </dt>
            <dd className='mt-0.5 tabular-nums'>
              {labels.stats.posts.replace('{{count}}', String(archive.posts.length))}
            </dd>
          </div>
          <div className='rounded-lg border border-gray-200 bg-white/80 px-3 py-2 dark:border-gray-800 dark:bg-gray-950/40'>
            <dt className='text-[11px] font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400'>
              tags
            </dt>
            <dd className='mt-0.5 tabular-nums'>
              {labels.stats.tags.replace('{{count}}', String(archive.tagStats.length))}
            </dd>
          </div>
          <div className='rounded-lg border border-gray-200 bg-white/80 px-3 py-2 dark:border-gray-800 dark:bg-gray-950/40'>
            <dt className='text-[11px] font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400'>
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
              className='inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11.5px] font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300'
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
