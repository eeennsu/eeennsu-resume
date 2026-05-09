import AnimatedSection from '@shared/components/AnimatedSection';
import SectionTitle from '@shared/components/SectionTitle';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { IEducation } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

interface Props {
  locale: Locale;
}

const EducationWidget: FC<Props> = ({ locale }) => {
  const education = loadSubjects<IEducation>('education.yaml', locale);
  const dict = getDictionary(locale);

  if (!education?.schoolName) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[EducationWidget] education.yaml is empty for locale "${locale}"`);
    }
    return null;
  }

  return (
    <AnimatedSection className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>{dict.sections.education}</SectionTitle>
      <div className='flex grow flex-col gap-6 md:gap-7'>
        <header className='flex flex-col gap-2 border-b border-gray-200 pb-5 max-md:items-center md:flex-row md:items-end md:justify-between md:gap-6 dark:border-gray-800'>
          <div className='flex flex-col gap-1 max-md:items-center md:flex-row md:items-baseline md:gap-3'>
            <h3 className='text-[22px] font-semibold tracking-tight text-gray-900 md:text-[26px] dark:text-gray-100'>
              {education?.schoolName}
            </h3>
            <span className='text-sm font-medium text-gray-600 md:text-[15px] dark:text-gray-400'>
              {education?.department}
            </span>
          </div>
          <p className='text-[13px] font-medium tracking-tight text-gray-700 tabular-nums md:text-sm dark:text-gray-300'>
            {education?.startDate} ~ {education?.endDate}
          </p>
        </header>

        <ul className='flex flex-col gap-2.5 pl-1'>
          {education?.activities.map((activity, index) => (
            <li
              key={index}
              className='flex gap-3 text-[15px] leading-relaxed break-keep text-gray-800 dark:text-gray-200'
            >
              <span className='mt-2.5 size-1 shrink-0 rounded-full bg-blue-500/60 dark:bg-blue-400/70' />
              <span className='flex-1'>{activity}</span>
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
};

export default EducationWidget;
