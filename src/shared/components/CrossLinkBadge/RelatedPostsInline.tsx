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
      className='ml-1 inline-flex items-center rounded-full border border-blue-300 bg-transparent px-1.5 py-0.5 text-[10.5px] font-semibold text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-blue-500/40 dark:text-blue-300 dark:hover:border-blue-400/60 dark:hover:bg-blue-500/10'
    >
      +{count}
    </Link>
  );
};

export default RelatedPostsInline;
