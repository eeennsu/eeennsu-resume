import SectionTitle from '@shared/components/SectionTitle';
import { ISkill } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

import SkillCard from '@features/skill/ui/Card';

const SkillsWidget: FC = () => {
  const skills = loadSubjects<ISkill[]>('skill.yml') || [];

  return (
    <section className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>Skills</SectionTitle>
      <div className='flex w-full flex-col gap-2'>
        <div className='flex flex-col'>
          {skills.map((skill, index) => (
            <SkillCard key={index} name={skill?.category} detailList={skill?.items} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsWidget;
