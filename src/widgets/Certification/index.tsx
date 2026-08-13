import { BadgeCheck } from 'lucide-react';
import type { FC } from 'react';

import AnimatedSection from '@shared/components/AnimatedSection';
import SectionTitle from '@shared/components/SectionTitle';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { ICertification } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';

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
              className='flex items-center gap-3 py-3.5 first:pt-0 last:pb-0 md:gap-4 md:py-4'
            >
              <BadgeCheck
                aria-hidden='true'
                className='size-4 shrink-0 text-blue-500 md:size-[18px] dark:text-blue-400'
              />
              <span className='text-body-m text-foreground flex-1 font-medium md:text-base'>
                {certification.title}
              </span>
              {certification.detail && (
                <time className='text-body-s text-muted-foreground tabular-nums md:text-sm'>
                  {certification.detail}
                </time>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
};

export default CertificationsWidget;
