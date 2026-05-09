import AnimatedSection from '@shared/components/AnimatedSection';
import SectionTitle from '@shared/components/SectionTitle';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { ISkill } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

import SkillCard from '@features/skill/ui/Card';

interface Props {
  locale: Locale;
}

const SkillsWidget: FC<Props> = ({ locale }) => {
  const skills = loadSubjects<ISkill[]>('skill.yaml', locale) || [];
  const dict = getDictionary(locale);

  if (skills.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[SkillsWidget] skill.yaml is empty for locale "${locale}"`);
    }
    return null;
  }

  return (
    <AnimatedSection className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>{dict.sections.skills}</SectionTitle>
      <div className='flex w-full grow flex-col'>
        <div className='flex flex-col divide-y divide-gray-100 dark:divide-gray-800'>
          {skills.map((skill, index) => (
            <SkillCard key={index} name={skill?.category} detailList={skill?.items} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default SkillsWidget;
