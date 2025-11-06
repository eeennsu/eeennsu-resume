import { FC } from 'react';

import CertificationsWidget from '@widgets/Certification';
import EducationWidget from '@widgets/Eduction';
import ExperienceWidget from '@widgets/Experience';
import IntroduceWidget from '@widgets/Introduce';
import PortfolioWidget from '@widgets/Portfolio';
import ProfileWidget from '@widgets/Profile';
import SkillsWidget from '@widgets/Skill';

const HomePage: FC = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/ip`);

  console.log('res', res);

  return (
    <main className='flex flex-col gap-10 md:gap-16'>
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
