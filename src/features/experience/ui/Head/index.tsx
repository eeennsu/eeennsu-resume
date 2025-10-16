import { getCompanyServiceDuration } from '@shared/libs/date';
import { ICompanyExperience } from '@shared/types/subjects';
import dayjs from 'dayjs';
import { CircleHelp } from 'lucide-react';
import type { FC } from 'react';

import NoteModal from '../NoteModal';

type Props = {
  experience: ICompanyExperience;
};

const ExperienceHead: FC<Props> = ({ experience }) => {
  return (
    <div className='flex flex-col justify-between gap-3 md:flex-row md:items-end'>
      <div className='flex items-center gap-2'>
        <h3 className='rounded-md bg-gray-800 px-3 py-1.5 text-xl font-semibold tracking-tight text-white'>
          {experience.companyName}
        </h3>

        {experience.endDate && experience.note && (
          <NoteModal description={experience.note.description}>
            <CircleHelp className='size-5 text-gray-500' />
          </NoteModal>
        )}
      </div>

      <div className='flex flex-col items-start gap-0.5 md:items-end'>
        <p className='text-base font-medium text-gray-800'>
          {experience.startDate} ~ {experience?.endDate || '현재'}
        </p>

        <span className='text-xs text-gray-500'>
          {experience.endDate ? (
            <>총 {getCompanyServiceDuration(experience.startDate, experience.endDate)} 근무</>
          ) : (
            <>{dayjs().diff(dayjs(experience.startDate), 'days')}일째 근무 중</>
          )}
        </span>
      </div>
    </div>
  );
};

export default ExperienceHead;
