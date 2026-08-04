import type { FC } from 'react';

import ActivityCard from '@features/experience/ui/ActivityCard';
import ExperienceHead from '@features/experience/ui/Head';

import AnimatedSection from '@shared/components/AnimatedSection';
import RelatedPostsBadge from '@shared/components/CrossLinkBadge/RelatedPostsBadge';
import SectionTitle from '@shared/components/SectionTitle';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { Accordion } from '@shared/shadcn-ui/ui/accordion';
import { IActivityVelogMapping, ICompanyExperience } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import { fetchVelogArchive } from '@shared/utils/utilFetchVelogArchive';
import { loadYaml } from '@shared/utils/utilLoadYaml';
import { mapActivityToVelog } from '@shared/utils/utilMapActivityToVelog';

interface Props {
  locale: Locale;
}

const ExperienceWidget: FC<Props> = ({ locale }) => {
  const experiences = loadSubjects<ICompanyExperience[]>('experience.yaml', locale) || [];
  const dict = getDictionary(locale);

  if (experiences.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[ExperienceWidget] experience.yaml is empty for locale "${locale}"`);
    }
    return null;
  }

  const archive = fetchVelogArchive();
  const mappings = loadYaml<IActivityVelogMapping[]>('src/data/activity-velog-mapping.yaml') ?? [];
  const allActivities = experiences.flatMap(e => e.activities);
  const activityPosts = mapActivityToVelog(allActivities, mappings, archive);
  const relatedLabels = dict.writings.relatedPosts;

  return (
    <AnimatedSection className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>{dict.sections.experience}</SectionTitle>
      <div className='flex grow flex-col gap-14 md:gap-20'>
        {experiences.map(experience => (
          <article key={experience.companyName} className='flex flex-col gap-6 md:gap-8'>
            <ExperienceHead experience={experience} locale={locale} />
            <Accordion
              type='multiple'
              defaultValue={['activity-0']}
              className='flex flex-col gap-3 md:gap-4'
            >
              {experience.activities.map((activity, j) => {
                const posts = activityPosts.get(activity.id) ?? [];
                return (
                  <ActivityCard
                    key={activity.id}
                    id={activity.id}
                    startDate={activity.startDate}
                    endDate={activity.endDate}
                    title={activity.title}
                    doneList={activity.doneList}
                    index={j}
                    locale={locale}
                  >
                    {posts.length > 0 && (
                      <RelatedPostsBadge
                        posts={posts}
                        label={relatedLabels.badgeLabel}
                        emptyLabel={relatedLabels.empty}
                      />
                    )}
                  </ActivityCard>
                );
              })}
            </Accordion>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default ExperienceWidget;
