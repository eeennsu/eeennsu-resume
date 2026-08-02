import dayjs from 'dayjs';
import { CircleHelp } from 'lucide-react';
import type { FC } from 'react';

import SharedTooltip from '@shared/components/Tooltip';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { getCompanyServiceDuration } from '@shared/libs/date';
import { ICompanyExperience } from '@shared/types/subjects';

type Props = {
  experience: ICompanyExperience;
  locale: Locale;
};

const toYearMonth = (date: string) => {
  const parts = date.replace(/-/g, '.').split('.');
  if (parts.length < 2) return date;
  return `${parts[0]}.${parts[1]}`;
};

const ExperienceHead: FC<Props> = ({ experience, locale }) => {
  const dict = getDictionary(locale);
  const showNote = !!experience.endDate && !!experience.note?.description;

  const duration = experience.endDate
    ? getCompanyServiceDuration(experience.startDate, experience.endDate, locale)
    : null;
  const daysWorking = !experience.endDate
    ? dayjs().diff(dayjs(experience.startDate), 'days')
    : null;

  const summaryLabel = duration
    ? dict.experience.totalDuration.replace('{{duration}}', duration)
    : dict.experience.daysWorking.replace('{{days}}', String(daysWorking));

  return (
    <header className='flex flex-col gap-3 border-b border-gray-200 pb-5 max-md:items-center md:flex-row md:items-end md:justify-between md:gap-6 dark:border-gray-800'>
      <div className='flex items-center gap-2'>
        <h3 className='text-[22px] font-semibold tracking-tight text-gray-900 md:text-[26px] dark:text-gray-100'>
          {experience.companyName}
        </h3>
        {showNote && (
          <SharedTooltip content={experience.note!.description}>
            <span className='-m-2 inline-flex cursor-help items-center justify-center p-2 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'>
              <CircleHelp className='size-4' aria-hidden />
            </span>
          </SharedTooltip>
        )}
      </div>

      <div className='flex flex-col items-center gap-0.5 md:items-end'>
        <p className='text-[13px] font-medium text-gray-700 tabular-nums md:text-sm dark:text-gray-300'>
          {toYearMonth(experience.startDate)} ~{' '}
          {experience.endDate ? toYearMonth(experience.endDate) : dict.experience.present}
        </p>
        <span className='text-[13px] text-gray-500 tabular-nums md:text-sm dark:text-gray-400'>
          {summaryLabel}
        </span>
      </div>
    </header>
  );
};

export default ExperienceHead;
