import { FC } from 'react';

import CertificationsWidget from '@widgets/Certification';
import CheckingWidget from '@widgets/Checking';
import EducationWidget from '@widgets/Eduction';
import ExperienceWidget from '@widgets/Experience';
import IntroduceWidget from '@widgets/Introduce';
import PortfolioWidget from '@widgets/Portfolio';
import ProfileWidget from '@widgets/Profile';
import SkillsWidget from '@widgets/Skill';

const HomePage: FC = async () => {
  return (
    <main className='flex flex-col gap-10 md:gap-16'>
      {process.env.NODE_ENV !== 'development' ? <CheckingWidget /> : null}
      <ProfileWidget />
      <IntroduceWidget />
      <ExperienceWidget />
      <SkillsWidget />
      <PortfolioWidget />
      <EducationWidget />
      <CertificationsWidget />
    </main>
  );
};

export default HomePage;
