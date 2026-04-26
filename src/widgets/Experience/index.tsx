import AnimatedSection from '@shared/components/AnimatedSection';
import SectionTitle from '@shared/components/SectionTitle';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { Accordion } from '@shared/shadcn-ui/ui/accordion';
import { ICompanyExperience } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

import ActivityCard from '@features/experience/ui/ActivityCard';
import ExperienceHead from '@features/experience/ui/Head';

interface Props {
  locale: Locale;
}

const ExperienceWidget: FC<Props> = ({ locale }) => {
  const experiences = loadSubjects<ICompanyExperience[]>('experience.yaml', locale) || [];
  const dict = getDictionary(locale);

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
              {experience.activities.map((activity, j) => (
                <ActivityCard
                  key={activity.title}
                  startDate={activity.startDate}
                  endDate={activity.endDate}
                  title={activity.title}
                  doneList={activity.doneList}
                  index={j}
                  locale={locale}
                />
              ))}
            </Accordion>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default ExperienceWidget;
