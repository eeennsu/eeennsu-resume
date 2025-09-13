import SectionTitle from '@shared/components/SectionTitle';
import { IPortfolio } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

import PortfolioCard from '@features/portfolio/ui/Card';

const PortfolioWidget: FC = () => {
  const portfolios = loadSubjects<IPortfolio[]>('portfolio.yaml') || [];

  return (
    <section className='flex w-full max-md:flex-col max-md:gap-2'>
      <SectionTitle>Portfolio</SectionTitle>

      <div className='grid w-full md:grid-cols-2'>
        {portfolios.map(portfolio => (
          <PortfolioCard
            key={portfolio.name}
            name={portfolio.name}
            descriptionList={portfolio.descriptionList}
            githubLink={portfolio.githubLink}
            siteLink={portfolio?.siteLink}
            tools={portfolio.tools}
          />
        ))}
      </div>
    </section>
  );
};

export default PortfolioWidget;
