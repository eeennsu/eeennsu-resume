import type { FC, ReactNode } from 'react';

interface Props {
  label: string;
  slot?: ReactNode;
}

const SkillBadge: FC<Props> = ({ label, slot }) => (
  <li className='inline-flex items-center gap-1.5'>
    <span className='rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[13px] font-medium text-gray-800 md:text-sm dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200'>
      {label}
    </span>
    {slot}
  </li>
);

export default SkillBadge;
