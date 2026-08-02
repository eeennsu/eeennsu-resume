import { notFound } from 'next/navigation';
import { FC } from 'react';

import CertificationsWidget from '@widgets/Certification';
import CheckingWidget from '@widgets/Checking';
import EducationWidget from '@widgets/Eduction';
import ExperienceWidget from '@widgets/Experience';
import IntroduceWidget from '@widgets/Introduce';
import PortfolioWidget from '@widgets/Portfolio';
import ProfileWidget from '@widgets/Profile';
import RecentWritings from '@widgets/RecentWritings';
import SkillsWidget from '@widgets/Skill';

import { isLocale } from '@shared/i18n/config';

interface Props {
  params: Promise<{ locale: string }>;
}

const HomePage: FC<Props> = async ({ params }) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className='flex flex-col gap-10 md:gap-16'>
      {process.env.NODE_ENV !== 'development' ? <CheckingWidget /> : null}
      <ProfileWidget locale={locale} />
      <IntroduceWidget locale={locale} />
      <ExperienceWidget locale={locale} />
      <SkillsWidget locale={locale} />
      <PortfolioWidget locale={locale} />
      <EducationWidget locale={locale} />
      <CertificationsWidget locale={locale} />
      <RecentWritings locale={locale} />
    </main>
  );
};

export default HomePage;
