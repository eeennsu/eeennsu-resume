import AnimatedSection from '@shared/components/AnimatedSection';
import SectionTitle from '@shared/components/SectionTitle';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { ICertification } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

interface Props {
  locale: Locale;
}

const CertificationsWidget: FC<Props> = ({ locale }) => {
  const certifications = loadSubjects<ICertification[]>('certification.yaml', locale) || [];
  const dict = getDictionary(locale);

  if (certifications.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[CertificationsWidget] certification.yaml is empty for locale "${locale}"`);
    }
    return null;
  }

  return (
    <AnimatedSection className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>{dict.sections.certification}</SectionTitle>

      <div className='flex grow flex-col'>
        <ul className='flex flex-col divide-y divide-gray-100 dark:divide-gray-800'>
          {certifications.map((certification, index) => (
            <li
              key={index}
              className='flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0 md:flex-row md:items-baseline md:justify-between md:gap-6 md:py-4'
            >
              <span className='text-[15px] font-medium text-gray-900 md:text-base dark:text-gray-100'>
                {certification.title}
              </span>
              {certification.detail && (
                <span className='text-[13px] text-gray-500 tabular-nums md:text-sm dark:text-gray-400'>
                  {certification.detail}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
};

export default CertificationsWidget;
