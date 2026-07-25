import RelatedPostsInline from '@shared/components/CrossLinkBadge/RelatedPostsInline';
import { type SkillId } from '@shared/consts/skills';
import type { Locale } from '@shared/i18n/config';
import { FC } from 'react';

import SkillBadge from '@features/skill/ui/SkillBadge';

export interface SkillLabelInfo {
  count: number;
  skillId: SkillId;
}

interface Props {
  name: string;
  detailList: string[];
  labelSkills?: Record<string, SkillLabelInfo>;
  locale?: Locale;
  inlineAria?: string;
}

const SkillCard: FC<Props> = ({ name, detailList, labelSkills, locale, inlineAria }) => {
  return (
    <div className='grid grid-cols-1 gap-3 py-5 md:grid-cols-7 md:gap-x-10 md:py-6'>
      <h3 className='text-[11px] font-semibold tracking-[0.18em] text-blue-500 uppercase md:col-span-2 md:mt-1 md:text-xs dark:text-blue-400'>
        {name}
      </h3>
      <ul className='flex flex-wrap gap-x-2 gap-y-2 md:col-span-5'>
        {detailList.map((detail, index) => {
          const info = labelSkills?.[detail];
          const slot =
            info && locale && inlineAria ? (
              <RelatedPostsInline
                count={info.count}
                skillId={info.skillId}
                locale={locale}
                ariaLabel={inlineAria}
              />
            ) : undefined;
          return <SkillBadge key={index} label={detail} slot={slot} />;
        })}
      </ul>
    </div>
  );
};

export default SkillCard;
