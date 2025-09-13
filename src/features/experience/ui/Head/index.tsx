import { getCompanyServiceDuration } from '@shared/libs/date';
import { ICompanyExperience } from '@shared/types/subjects';
import { CircleHelp } from 'lucide-react';
import type { FC } from 'react';

import NoteModal from '../NoteModal';

type Props = {
  experience: ICompanyExperience;
};

const ExperienceHead: FC<Props> = ({ experience }) => {
  return (
    <div className='flex flex-col gap-2 md:flex-row md:justify-between md:gap-0'>
      <div className='flex h-fit items-center gap-2'>
        <h3 className='rounded-sm bg-gray-900 p-2 text-sm font-semibold text-white md:px-3 md:py-1.5 md:text-2xl'>
          {experience.companyName}
        </h3>
        {experience.endDate && experience.note && (
          <NoteModal description={experience.note.description}>
            <CircleHelp className='text-gray-600' size={24} />
          </NoteModal>
        )}
      </div>

      <div className='flex items-center justify-between gap-1 md:flex-col md:items-end'>
        <p className='font-bold'>
          {experience.startDate} ~ {experience?.endDate || '현재'}
        </p>
        {experience.endDate && (
          <span className='inline-flex items-center gap-1 text-xs text-gray-500'>
            (총 {getCompanyServiceDuration(experience.startDate, experience.endDate)} 근무)
          </span>
        )}
      </div>
    </div>
  );
};

export default ExperienceHead;
