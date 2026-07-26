import ActivityBadge from '@shared/components/CrossLinkBadge/ActivityBadge';
import { VELOG_BASE_URL, VELOG_RSS_URL } from '@shared/consts/velog';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import type { IActivity, IActivityVelogMapping, ICompanyExperience } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import { fetchVelogArchive } from '@shared/utils/utilFetchVelogArchive';
import { isRecentPost } from '@shared/utils/utilIsRecentPost';
import { loadYaml } from '@shared/utils/utilLoadYaml';
import { mapActivityToVelog } from '@shared/utils/utilMapActivityToVelog';
import dayjs from 'dayjs';
import { ArrowLeft, CalendarClock, ExternalLink, Rss } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

import BehindTheScenes from '@widgets/BehindTheScenes';

import SkillMap from '@features/velog/ui/SkillMap';
import TabTriggers, { type WritingsView } from '@features/velog/ui/TabTriggers';
import TagCloud from '@features/velog/ui/TagCloud';
import Timeline from '@features/velog/ui/Timeline';

interface Props {
  locale: Locale;
  currentView: WritingsView;
  activeTag: string | null;
}

const EMPTY_ISO = new Date(0).toISOString();

const VelogArchiveWidget: FC<Props> = ({ locale, currentView, activeTag }) => {
  const archive = fetchVelogArchive();
  const dict = getDictionary(locale);
  const t = dict.writings;

  const experiences = loadSubjects<ICompanyExperience[]>('experience.yaml', locale) ?? [];
  const mappings = loadYaml<IActivityVelogMapping[]>('src/data/activity-velog-mapping.yaml') ?? [];
  const allActivities: IActivity[] = experiences.flatMap(e => e.activities);
  const activityPosts = mapActivityToVelog(allActivities, mappings, archive);

  const activityById = new Map<string, IActivity>();
  for (const activity of allActivities) activityById.set(activity.id, activity);

  const postToActivity = new Map<string, IActivity>();
  for (const [activityId, posts] of activityPosts.entries()) {
    const activity = activityById.get(activityId);
    if (!activity) continue;
    for (const post of posts) {
      if (!postToActivity.has(post.id)) postToActivity.set(post.id, activity);
    }
  }

  const buildTimeMs = Date.now();
  const isRecent = (releasedAt: string) => isRecentPost(releasedAt, buildTimeMs);

  const renderActivityLink = (postId: string) => {
    const activity = postToActivity.get(postId);
    if (!activity) return null;
    return <ActivityBadge activity={activity} locale={locale} label={t.activityBadge.label} />;
  };

  const fetchedLabel =
    archive.fetchedAt && archive.fetchedAt !== EMPTY_ISO
      ? dayjs(archive.fetchedAt).format('YYYY.MM.DD HH:mm')
      : '—';

  return (
    <main className='flex flex-col gap-12 pt-10 pb-20 md:gap-16 md:pt-16'>
      <header className='flex flex-col gap-5 px-6 md:mx-auto md:max-w-6xl md:px-12'>
        <Link
          href={`/${locale}`}
          className='inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200/60 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-blue-400/60 dark:focus-visible:ring-offset-gray-950'
        >
          <ArrowLeft className='size-4' aria-hidden />
          {t.nav.back}
        </Link>
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
          <SkillMap archive={archive} emptyLabel={t.skillMap.empty} countLabel={t.skillMap.count} />

          <div className='flex flex-col gap-6'>
            <TabTriggers
              currentView={currentView}
              labels={{ tag: t.tab.tagCloud, timeline: t.tab.timeline }}
            />

            {currentView === 'tag' ? (
              <TagCloud
                archive={archive}
                activeTag={activeTag}
                labels={{
                  allLabel: t.tagCloud.all,
                  emptyLabel: t.tagCloud.empty,
                  recentBadge: t.recent.badge,
                }}
                isRecent={isRecent}
                renderCrossLink={post => renderActivityLink(post.id)}
              />
            ) : (
              <Timeline
                archive={archive}
                labels={{
                  emptyLabel: t.empty,
                  recentBadge: t.recent.badge,
                }}
                isRecent={isRecent}
                renderCrossLink={post => renderActivityLink(post.id)}
              />
            )}
          </div>

          <BehindTheScenes
            archive={archive}
            labels={{
              title: t.behindTheScenes.title,
              description: t.behindTheScenes.description,
              cronNote: t.behindTheScenes.cronNote,
              stack: t.behindTheScenes.stack,
              stats: {
                posts: t.stats.posts,
                tags: t.stats.tags,
                lastFetched: t.lastFetched,
              },
              steps: t.behindTheScenes.steps,
            }}
          />
        </>
      )}
    </main>
  );
};

export default VelogArchiveWidget;
