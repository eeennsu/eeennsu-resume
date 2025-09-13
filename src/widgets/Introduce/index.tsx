import SectionTitle from '@shared/components/SectionTitle';
import { MY_PROFILE } from '@shared/consts/commons';
import { getKoreanAge, getWorkAnniversary } from '@shared/libs/date';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import type { FC } from 'react';

const IntroduceWidget: FC = () => {
  const raw = loadSubjects<string[]>('introduce.yaml') || [];

  const age = getKoreanAge(MY_PROFILE.BIRTHDAY);
  const career = getWorkAnniversary(MY_PROFILE.CAREER_START_DATE);

  const introduce =
    raw.map(intro => intro.replace('{{age}}', age.toString()).replace('{{career}}', career)) || [];

  return (
    <section className='flex w-full max-md:flex-col max-md:gap-2'>
      <SectionTitle>Introduce</SectionTitle>
      <div className='flex grow flex-col gap-2'>
        <div className='flex flex-col gap-4 text-lg break-keep'>
          {introduce.map((intro, index) => (
            <p key={index}>{intro}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntroduceWidget;
