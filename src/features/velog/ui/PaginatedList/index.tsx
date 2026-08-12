'use client';

import { ChevronDown } from 'lucide-react';
import { useState, type FC, type ReactNode } from 'react';

import { cn } from '@shared/shadcn-ui/utils';

interface Item {
  key: string;
  node: ReactNode;
}

interface Props {
  items: Item[];
  initial?: number;
  step?: number;
  className?: string;
  loadMoreLabel: string;
  showingLabel: string;
}

const PaginatedList: FC<Props> = ({
  items,
  initial = 12,
  step = 12,
  className,
  loadMoreLabel,
  showingLabel,
}) => {
  const [count, setCount] = useState(initial);
  const total = items.length;
  const shown = Math.min(count, total);
  const visible = items.slice(0, shown);
  const remaining = total - shown;

  return (
    <div className='flex flex-col gap-6'>
      <ul className={cn('grid gap-4 md:grid-cols-2', className)}>
        {visible.map(({ key, node }) => (
          <li key={key}>{node}</li>
        ))}
      </ul>
      {total > initial && (
        <div className='flex flex-col items-center gap-2'>
          <span
            aria-live='polite'
            className='text-[12px] text-gray-500 tabular-nums dark:text-gray-500'
          >
            {showingLabel.replace('{{shown}}', String(shown)).replace('{{total}}', String(total))}
          </span>
          {remaining > 0 && (
            <button
              type='button'
              onClick={() => setCount(c => c + step)}
              className='inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-950/60 dark:text-gray-200 dark:hover:bg-gray-900 dark:focus-visible:ring-blue-400/60 dark:focus-visible:ring-offset-gray-950'
            >
              {loadMoreLabel.replace('{{remaining}}', String(remaining))}
              <ChevronDown className='size-4' aria-hidden />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaginatedList;
