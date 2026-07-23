import TagChip from '@shared/components/TagChip';
import { VELOG_BASE_URL, VELOG_RSS_URL } from '@shared/consts/velog';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { fetchVelogArchive } from '@shared/utils/utilFetchVelogArchive';
import { mapTagToSkillId } from '@shared/utils/utilMapTagToSkill';
import dayjs from 'dayjs';
import { CalendarClock, ExternalLink, Rss } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

interface Props {
  locale: Locale;
}

const PREVIEW_COUNT = 10;
const EMPTY_ISO = new Date(0).toISOString();

const VelogArchiveWidget: FC<Props> = ({ locale }) => {
  const archive = fetchVelogArchive();
  const dict = getDictionary(locale);
  const t = dict.writings;

  const fetchedLabel =
    archive.fetchedAt && archive.fetchedAt !== EMPTY_ISO
      ? dayjs(archive.fetchedAt).format('YYYY.MM.DD HH:mm')
      : '—';

  const previewPosts = archive.posts.slice(0, PREVIEW_COUNT);
  const previewTags = archive.tagStats.slice(0, 12);

  return (
    <main className='flex flex-col gap-14 pt-10 pb-20 md:gap-20 md:pt-16'>
      <header className='flex flex-col gap-5 px-6 md:mx-auto md:max-w-6xl md:px-12'>
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='font-pretendard text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-gray-100'>
            {t.pageTitle}
          </h1>
          <Link
            href={VELOG_BASE_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20'
          >
            <ExternalLink className='size-3.5' aria-hidden />
            velog.io/@diso592
          </Link>
          <Link
            href={VELOG_RSS_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11.5px] font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-200 dark:hover:bg-orange-500/20'
          >
            <Rss className='size-3.5' aria-hidden />
            RSS
          </Link>
        </div>
        <p className='max-w-3xl text-[15px] leading-relaxed text-gray-600 md:text-base dark:text-gray-400'>
          {t.pageDescription}
        </p>
        <dl className='flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-gray-500 dark:text-gray-400'>
          <div className='flex items-center gap-1.5'>
            <CalendarClock className='size-4' aria-hidden />
            <dd>{t.lastFetched.replace('{{when}}', fetchedLabel)}</dd>
          </div>
          <div>
            <dd>{t.stats.posts.replace('{{count}}', String(archive.posts.length))}</dd>
          </div>
          <div>
            <dd>{t.stats.tags.replace('{{count}}', String(archive.tagStats.length))}</dd>
          </div>
        </dl>
      </header>

      {archive.posts.length === 0 ? (
        <section className='mx-6 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500 md:mx-auto md:max-w-6xl dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-400'>
          {t.empty}
        </section>
      ) : (
        <>
          <section
            aria-labelledby='writings-tags-heading'
            className='flex flex-col gap-4 px-6 md:mx-auto md:max-w-6xl md:px-12'
          >
            <h2
              id='writings-tags-heading'
              className='text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-200'
            >
              {t.tab.tagCloud}
            </h2>
            <ul className='flex flex-wrap gap-2'>
              {previewTags.map(tag => (
                <li key={tag.name}>
                  <TagChip
                    label={`${tag.name} · ${tag.count}`}
                    skillId={mapTagToSkillId(tag.name)}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby='writings-timeline-heading'
            className='flex flex-col gap-5 px-6 md:mx-auto md:max-w-6xl md:px-12'
          >
            <h2
              id='writings-timeline-heading'
              className='text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-200'
            >
              {t.tab.timeline}
            </h2>
            <ol className='flex flex-col gap-4'>
              {previewPosts.map(post => (
                <li
                  key={post.id}
                  className='rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300 md:p-6 dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-gray-700'
                >
                  <Link
                    href={`${VELOG_BASE_URL}/${post.urlSlug}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex flex-col gap-2'
                  >
                    <div className='flex items-baseline justify-between gap-4'>
                      <h3 className='text-base leading-snug font-semibold break-keep text-gray-900 md:text-lg dark:text-gray-100'>
                        {post.title}
                      </h3>
                      <time
                        dateTime={post.releasedAt}
                        className='shrink-0 text-[12px] text-gray-500 tabular-nums dark:text-gray-500'
                      >
                        {dayjs(post.releasedAt).format('YYYY.MM.DD')}
                      </time>
                    </div>
                    {post.description && (
                      <p className='line-clamp-2 text-[13.5px] leading-relaxed text-gray-600 dark:text-gray-400'>
                        {post.description}
                      </p>
                    )}
                    {post.tags.length > 0 && (
                      <ul className='flex flex-wrap gap-1.5 pt-1'>
                        {post.tags.map(tag => (
                          <li key={tag}>
                            <TagChip label={tag} skillId={mapTagToSkillId(tag)} size='sm' />
                          </li>
                        ))}
                      </ul>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby='writings-behind-heading'
            className='mx-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:mx-auto md:max-w-6xl md:p-10 dark:border-gray-800 dark:bg-gray-900/40'
          >
            <h2
              id='writings-behind-heading'
              className='text-lg font-semibold tracking-tight text-gray-900 md:text-xl dark:text-gray-100'
            >
              {t.behindTheScenes.title}
            </h2>
            <p className='mt-2 text-[14px] leading-relaxed text-gray-600 dark:text-gray-400'>
              {t.behindTheScenes.description}
            </p>
          </section>
        </>
      )}
    </main>
  );
};

export default VelogArchiveWidget;
