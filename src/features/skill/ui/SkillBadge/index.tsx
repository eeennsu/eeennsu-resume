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
        'text-body-s rounded-md border px-2.5 py-1 md:text-sm',
        isCore
          ? 'border-blue-200 bg-blue-50 font-semibold text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-200'
          : 'border-border text-muted-foreground bg-white font-medium dark:bg-gray-900/60',
      )}
    >
      {label}
    </span>
    {slot}
  </li>
);

export default SkillBadge;
