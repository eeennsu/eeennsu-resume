import dayjs from 'dayjs';
import Link from 'next/link';
import { type FC, type ReactNode } from 'react';

import { VELOG_BASE_URL } from '@shared/consts/velog';
import type { IVelogPost } from '@shared/types/velog';

interface Props {
  post: IVelogPost;
  isRecent?: boolean;
  recentLabel?: string;
  children?: ReactNode;
}

const VelogPostCard: FC<Props> = ({ post, isRecent, recentLabel, children }) => (
  <article className='border-border flex flex-col gap-3 rounded-xl border bg-white p-5 transition-colors hover:border-gray-300 md:p-6 dark:bg-gray-950/40 dark:hover:border-gray-700'>
    <Link
      href={`${VELOG_BASE_URL}/${post.urlSlug}`}
      target='_blank'
      rel='noopener noreferrer'
      className='flex flex-col gap-2'
    >
      <div className='flex items-baseline justify-between gap-4'>
        <h3 className='text-foreground inline-flex items-baseline gap-2 text-base leading-snug font-semibold break-keep md:text-lg'>
          {post.title}
          {isRecent && recentLabel && (
            <span className='shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase dark:bg-rose-500/90'>
              {recentLabel}
            </span>
          )}
        </h3>
        <time
          dateTime={post.releasedAt}
          className='shrink-0 text-xs text-gray-500 tabular-nums dark:text-gray-500'
        >
          {dayjs(post.releasedAt).format('YYYY.MM.DD')}
        </time>
      </div>
      {post.description && (
        <p className='text-muted-foreground line-clamp-1 text-[13.5px] leading-relaxed'>
          {post.description}
        </p>
      )}
    </Link>
    {children && <div className='pt-2'>{children}</div>}
  </article>
);

export default VelogPostCard;
