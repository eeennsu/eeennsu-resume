import SectionTitle from '@shared/components/SectionTitle';
import { IEducation } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

const EducationWidget: FC = () => {
  const education = loadSubjects<IEducation>('education.yml');

  return (
    <section className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>Education</SectionTitle>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col-reverse gap-0.5 md:flex-col'>
          <p className='text-sm md:text-xl'>
            {education?.startDate} ~ {education?.endDate}
          </p>
          <h3 className='text-xl font-semibold md:text-2xl'>
            {education?.schoolName}
            &nbsp;
            <span className='ml-1 text-sm font-medium text-gray-800 md:text-lg'>
              {education?.department}
            </span>
          </h3>
        </div>
        <ul className='ml-4 list-outside list-disc'>
          {education.activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EducationWidget;
