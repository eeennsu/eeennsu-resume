import AnimatedSection from '@shared/components/AnimatedSection';
import SectionTitle from '@shared/components/SectionTitle';
import { MY_PROFILE } from '@shared/consts/commons';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { getKoreanAge, getWorkAnniversary } from '@shared/libs/date';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

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
      <div className='flex grow flex-col'>
        <div className='flex flex-col gap-5 break-keep'>
          {introduce.map((intro, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? 'text-[17px] leading-[1.85] font-medium text-gray-900 md:text-lg dark:text-gray-100'
                  : 'text-[15px] leading-[1.85] text-gray-700 md:text-base dark:text-gray-300'
              }
            >
              {intro}
            </p>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default IntroduceWidget;
