import type { FC } from 'react';

import PortfolioCard from '@features/portfolio/ui/Card';

import AnimatedSection from '@shared/components/AnimatedSection';
import SectionTitle from '@shared/components/SectionTitle';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { IPortfolio } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';

interface Props {
  locale: Locale;
}

const PortfolioWidget: FC<Props> = ({ locale }) => {
  const portfolios = loadSubjects<IPortfolio[]>('portfolio.yaml', locale) || [];
  const dict = getDictionary(locale);

  if (portfolios.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[PortfolioWidget] portfolio.yaml is empty for locale "${locale}"`);
    }
    return null;
  }

  return (
    <AnimatedSection className='flex w-full max-md:flex-col max-md:gap-4'>
      <SectionTitle>{dict.sections.portfolio}</SectionTitle>

      <div className='border-border grow overflow-hidden rounded-xl border bg-white dark:bg-gray-950/40'>
        <div className='grid w-full md:grid-cols-2'>
          {portfolios.map(portfolio => (
            <PortfolioCard
              key={portfolio.name}
              name={portfolio.name}
              descriptionList={portfolio.descriptionList}
              githubLink={portfolio.githubLink}
              siteLink={portfolio?.siteLink}
              tools={portfolio.tools}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PortfolioWidget;
