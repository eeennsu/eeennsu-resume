import SectionTitle from '@shared/components/SectionTitle';
import { ICertification } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

const CertificationsWidget: FC = () => {
  const certifications = loadSubjects<ICertification[]>('certification.yml') || [];

  return (
    <section className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>Certifications</SectionTitle>

      <div className='flex flex-col gap-7'>
        <ul className='list-inside list-disc'>
          {certifications.map((certification, index) => (
            <li key={index}>
              {certification.title}
              <span className='text-sm'>
                {certification.detail && ` (${certification.detail})`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CertificationsWidget;
