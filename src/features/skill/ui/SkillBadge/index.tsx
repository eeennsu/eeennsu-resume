import type { FC, ReactNode } from 'react';

import { cn } from '@shared/shadcn-ui/utils';

interface Props {
  label: string;
  slot?: ReactNode;
  isCore?: boolean;
}

const SkillBadge: FC<Props> = ({ label, slot, isCore }) => (
  <li className='inline-flex items-center gap-1.5'>
    <span
      className={cn(
        'rounded-md border px-2.5 py-1 text-[13px] md:text-sm',
        isCore
          ? 'border-blue-200 bg-blue-50 font-semibold text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-200'
          : 'border-gray-200 bg-white font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400',
      )}
    >
      {label}
    </span>
    {slot}
  </li>
);

export default SkillBadge;
