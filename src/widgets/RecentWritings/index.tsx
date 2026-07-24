import AnimatedSection from '@shared/components/AnimatedSection';
import SectionTitle from '@shared/components/SectionTitle';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { fetchVelogArchive } from '@shared/utils/utilFetchVelogArchive';
import { isRecentPost } from '@shared/utils/utilIsRecentPost';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { FC } from 'react';

import VelogPostMiniCard from '@features/velog/ui/VelogPostMiniCard';

interface Props {
  locale: Locale;
}

const RECENT_COUNT = 3;

const RecentWritings: FC<Props> = ({ locale }) => {
  const archive = fetchVelogArchive();
  if (archive.posts.length === 0) return null;

  const dict = getDictionary(locale);
  const t = dict.writings;

  const buildTimeMs = Date.now();
  const isRecent = (releasedAt: string) => isRecentPost(releasedAt, buildTimeMs);

  const recent = [...archive.posts]
    .sort((a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt))
    .slice(0, RECENT_COUNT);

  return (
    <AnimatedSection className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>{t.nav.link}</SectionTitle>
      <div className='flex grow flex-col gap-4'>
        <ul className='grid gap-3 md:grid-cols-3'>
          {recent.map(post => (
            <li key={post.id}>
              <VelogPostMiniCard
                post={post}
                isRecent={isRecent(post.releasedAt)}
                recentLabel={t.recent.badge}
              />
            </li>
          ))}
        </ul>
        <div className='flex justify-end'>
          <Link
            href={`/${locale}/writings`}
            className='inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200'
          >
            {t.cta.viewAll}
            <ArrowRight className='size-3.5' aria-hidden />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default RecentWritings;
