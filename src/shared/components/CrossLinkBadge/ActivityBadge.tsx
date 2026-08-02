import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

import type { Locale } from '@shared/i18n/config';
import type { IActivity } from '@shared/types/subjects';

interface Props {
  activity: IActivity;
  locale: Locale;
  label: string;
}

const ActivityBadge: FC<Props> = ({ activity, locale, label }) => (
  <Link
    href={`/${locale}#experience-${activity.id}`}
    className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11.5px] font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20'
  >
    <Briefcase className='size-3.5' aria-hidden />
    <span>
      {label} · <span className='font-semibold'>{activity.title}</span>
    </span>
  </Link>
);

export default ActivityBadge;
