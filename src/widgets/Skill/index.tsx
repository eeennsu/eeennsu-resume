import AnimatedSection from '@shared/components/AnimatedSection';
import SectionTitle from '@shared/components/SectionTitle';
import { type SkillId } from '@shared/consts/skills';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { ISkill } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import { fetchVelogArchive } from '@shared/utils/utilFetchVelogArchive';
import { mapLabelToSkillId, mapTagToSkillId } from '@shared/utils/utilMapTagToSkill';
import type { FC } from 'react';

import SkillCard, { type SkillLabelInfo } from '@features/skill/ui/Card';

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

  const archive = fetchVelogArchive();
  const skillCounts = new Map<SkillId, number>();
  for (const post of archive.posts) {
    const seen = new Set<SkillId>();
    for (const tag of post.tags) {
      const id = mapTagToSkillId(tag);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      skillCounts.set(id, (skillCounts.get(id) ?? 0) + 1);
    }
  }

  const labelSkills: Record<string, SkillLabelInfo> = {};
  for (const skill of skills) {
    for (const label of skill.items) {
      const id = mapLabelToSkillId(label);
      if (!id) continue;
      const count = skillCounts.get(id) ?? 0;
      if (count === 0) continue;
      labelSkills[label] = { count, skillId: id };
    }
  }

  return (
    <AnimatedSection className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>{dict.sections.skills}</SectionTitle>
      <div className='flex w-full grow flex-col'>
        <div className='flex flex-col divide-y divide-gray-100 dark:divide-gray-800'>
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              name={skill?.category}
              detailList={skill?.items}
              labelSkills={labelSkills}
              locale={locale}
              inlineAria={dict.writings.relatedPosts.inlineAria}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default SkillsWidget;
