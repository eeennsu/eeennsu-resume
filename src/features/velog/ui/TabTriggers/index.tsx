'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type FC } from 'react';

import { cn } from '@shared/shadcn-ui/utils';

export type WritingsView = 'tag' | 'timeline';

interface Props {
  currentView: WritingsView;
  labels: {
    tag: string;
    timeline: string;
  };
}

const buildHref = (pathname: string, search: URLSearchParams, view: WritingsView): string => {
  const params = new URLSearchParams(search);
  params.set('view', view);
  if (view !== 'tag') params.delete('tag');
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

const TabTriggers: FC<Props> = ({ currentView, labels }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = new URLSearchParams(searchParams?.toString());

  const tabs: Array<{ view: WritingsView; label: string }> = [
    { view: 'tag', label: labels.tag },
    { view: 'timeline', label: labels.timeline },
  ];

  return (
    <nav
      aria-label='writings view tabs'
      className='flex flex-wrap gap-2 px-6 md:mx-auto md:max-w-6xl md:px-12'
    >
      <ul className='flex gap-1 rounded-full border border-gray-200 bg-white p-1 text-[13px] dark:border-gray-800 dark:bg-gray-950/40'>
        {tabs.map(({ view, label }) => {
          const isActive = view === currentView;
          return (
            <li key={view}>
              <Link
                href={buildHref(pathname, search, view)}
                scroll={false}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1.5 font-medium transition-colors',
                  isActive
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900/60',
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TabTriggers;
