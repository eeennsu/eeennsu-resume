import { isLocale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { notFound } from 'next/navigation';
import { FC } from 'react';

import CertificationsWidget from '@widgets/Certification';
import CheckingWidget from '@widgets/Checking';
import EducationWidget from '@widgets/Eduction';
import ExperienceWidget from '@widgets/Experience';
import IntroduceWidget from '@widgets/Introduce';
import JdMatchWidget from '@widgets/JdMatch';
import PortfolioWidget from '@widgets/Portfolio';
import ProfileWidget from '@widgets/Profile';
import RecentWritings from '@widgets/RecentWritings';
import SkillsWidget from '@widgets/Skill';

interface Props {
  params: Promise<{ locale: string }>;
}

const HomePage: FC<Props> = async ({ params }) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

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
      <JdMatchWidget locale={locale} labels={dict.jdMatch} />
    </main>
  );
};

export default HomePage;
