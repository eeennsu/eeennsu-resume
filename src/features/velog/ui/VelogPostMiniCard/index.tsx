import TagChip from '@shared/components/TagChip';
import { VELOG_BASE_URL } from '@shared/consts/velog';
import type { IVelogPost } from '@shared/types/velog';
import { mapTagToSkillId } from '@shared/utils/utilMapTagToSkill';
import dayjs from 'dayjs';
import Link from 'next/link';
import { type FC } from 'react';

interface Props {
  post: IVelogPost;
  isRecent?: boolean;
  recentLabel?: string;
}

const MAX_TAGS = 2;

const VelogPostMiniCard: FC<Props> = ({ post, isRecent, recentLabel }) => (
  <Link
    href={`${VELOG_BASE_URL}/${post.urlSlug}`}
    target='_blank'
    rel='noopener noreferrer'
    className='flex h-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 md:p-5 dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-gray-700'
  >
    <div className='flex items-baseline justify-between gap-3'>
      <time
        dateTime={post.releasedAt}
        className='text-[11.5px] text-gray-500 tabular-nums dark:text-gray-500'
      >
        {dayjs(post.releasedAt).format('YYYY.MM.DD')}
      </time>
      {isRecent && recentLabel && (
        <span className='shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9.5px] font-semibold tracking-wider text-white uppercase dark:bg-rose-500/90'>
          {recentLabel}
        </span>
      )}
    </div>
    <h3 className='line-clamp-2 text-[14.5px] leading-snug font-semibold break-keep text-gray-900 dark:text-gray-100'>
      {post.title}
    </h3>
    {post.tags.length > 0 && (
      <ul className='mt-auto flex flex-wrap gap-1.5 pt-1'>
        {post.tags.slice(0, MAX_TAGS).map(tag => (
          <li key={tag}>
            <TagChip label={tag} skillId={mapTagToSkillId(tag)} size='sm' />
          </li>
        ))}
      </ul>
    )}
  </Link>
);

export default VelogPostMiniCard;
