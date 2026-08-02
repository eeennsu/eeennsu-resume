'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type FC } from 'react';

import { cn } from '@shared/shadcn-ui/utils';
import type { IVelogTagStat } from '@shared/types/velog';
import { getPaletteForSkill } from '@shared/utils/tagColor';
import { mapTagToSkillId } from '@shared/utils/utilMapTagToSkill';

interface Props {
  tagStats: IVelogTagStat[];
  activeTag: string | null;
  allLabel: string;
}

const TagCloudFilter: FC<Props> = ({ tagStats, activeTag, allLabel }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (tag: string | null): string => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('view', 'tag');
    if (tag) params.set('tag', tag);
    else params.delete('tag');
    return `${pathname}?${params.toString()}`;
  };

  return (
    <ul className='flex flex-wrap gap-2'>
      <li>
        <Link
          href={buildHref(null)}
          scroll={false}
          aria-current={activeTag === null ? 'true' : undefined}
          className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors',
            activeTag === null
              ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300 dark:hover:border-gray-700',
          )}
        >
          {allLabel}
        </Link>
      </li>
      {tagStats.map(tag => {
        const isActive = tag.name === activeTag;
        const palette = getPaletteForSkill(mapTagToSkillId(tag.name));
        return (
          <li key={tag.name}>
            <Link
              href={buildHref(tag.name)}
              scroll={false}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors',
                isActive
                  ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                  : `${palette.chip} ${palette.border} hover:brightness-95`,
              )}
            >
              <span>{tag.name}</span>
              <span className='tabular-nums opacity-70'>{tag.count}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default TagCloudFilter;
