import { type SkillId } from '@shared/consts/skills';
import type { Locale } from '@shared/i18n/config';
import Link from 'next/link';
import { type FC } from 'react';

interface Props {
  count: number;
  skillId: SkillId;
  locale: Locale;
  ariaLabel: string;
}

const RelatedPostsInline: FC<Props> = ({ count, skillId, locale, ariaLabel }) => {
  if (count === 0) return null;
  return (
    <Link
      href={`/${locale}/writings?view=skill&skill=${skillId}`}
      aria-label={ariaLabel.replace('{{count}}', String(count))}
      className='ml-1 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20'
    >
      +{count}
    </Link>
  );
};

export default RelatedPostsInline;
