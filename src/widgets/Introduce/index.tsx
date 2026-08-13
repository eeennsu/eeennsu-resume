import type { FC } from 'react';

import AnimatedSection from '@shared/components/AnimatedSection';
import SectionTitle from '@shared/components/SectionTitle';
import { MY_PROFILE } from '@shared/consts/commons';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { getKoreanAge, getWorkAnniversary } from '@shared/libs/date';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';

interface Props {
  locale: Locale;
}

const IntroduceWidget: FC<Props> = ({ locale }) => {
  const raw = loadSubjects<string[]>('introduce.yaml', locale) || [];
  const dict = getDictionary(locale);

  const age = getKoreanAge(MY_PROFILE.BIRTHDAY);
  const career = getWorkAnniversary(MY_PROFILE.CAREER_START_DATE, locale);

  const introduce =
    raw.map(intro => intro.replace('{{age}}', age.toString()).replace('{{career}}', career)) || [];

  return (
    <AnimatedSection className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>{dict.sections.introduce}</SectionTitle>
      <div className='flex grow flex-col gap-2 break-keep'>
        {introduce.map((intro, index) =>
          index === 0 ? (
            <p
              key={index}
              className='text-foreground mb-2 text-xl leading-[1.65] font-semibold tracking-tight text-balance md:text-[22px] md:leading-[1.55]'
            >
              {intro}
            </p>
          ) : (
            <p
              key={index}
              className='text-body-m text-muted-foreground leading-[1.85] text-pretty md:text-base'
            >
              {intro}
            </p>
          ),
        )}
      </div>
    </AnimatedSection>
  );
};

export default IntroduceWidget;
