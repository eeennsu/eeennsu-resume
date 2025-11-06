import useGetIp from '@shared/hooks/useGetIp';
import { FC } from 'react';

import CertificationsWidget from '@widgets/Certification';
import EducationWidget from '@widgets/Eduction';
import ExperienceWidget from '@widgets/Experience';
import IntroduceWidget from '@widgets/Introduce';
import PortfolioWidget from '@widgets/Portfolio';
import ProfileWidget from '@widgets/Profile';
import SkillsWidget from '@widgets/Skill';

const HomePage: FC = async () => {
  const { ip } = useGetIp();
  console.log('ip', ip);

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
export const dynamic = 'force-dynamic';

//https://eeennsu-github-io.vercel.app/
