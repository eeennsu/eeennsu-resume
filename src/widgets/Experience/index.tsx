import SectionTitle from '@shared/components/SectionTitle';
import TextDivider from '@shared/components/TextDivider';
import { ICompanyExperience } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

import ActivityCard from '@features/experience/ui/ActivityCard';
import ExperienceHead from '@features/experience/ui/Head';

const ExperienceWidget: FC = () => {
  const experiences = loadSubjects<ICompanyExperience[]>('experience.yaml') || [];

  return (
    <section className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>Experience</SectionTitle>
      <div className='flex grow flex-col'>
        {experiences.map((experience, index, arr) => (
          <div key={experience.companyName}>
            <div className='flex flex-col gap-5'>
              <ExperienceHead experience={experience} />

              <div className='flex flex-col gap-7'>
                {experience.activities.map(activity => (
                  <ActivityCard
                    key={activity.title}
                    startDate={activity.startDate}
                    endDate={activity.endDate}
                    title={activity.title}
                    doneList={activity.doneList}
                    estimatedDuration={activity.estimatedDuration}
                  />
                ))}
              </div>
            </div>

            {index !== arr.length - 1 && <TextDivider text='Next' />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceWidget;
