import AnimatedSection from '@shared/components/AnimatedSection';
import { MY_PROFILE } from '@shared/consts/commons';
import type { Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { getKoreanAge } from '@shared/libs/date';
import { IProfile } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import { fetchVelogArchive } from '@shared/utils/utilFetchVelogArchive';
import { isRecentPost } from '@shared/utils/utilIsRecentPost';
import Image from 'next/image';
import { type FC } from 'react';

import ProfileHeader from '@features/portfolio/ui/Header';
import ProfileItem from '@features/profile/ui/Item';
import LastUpdate from '@features/profile/ui/LastUpdate';

interface Props {
  locale: Locale;
}

const ProfileWidget: FC<Props> = ({ locale }) => {
  const profile = loadSubjects<IProfile>('profile.yaml', locale);
  const dict = getDictionary(locale);

  const ageLabel = dict.profile.age.replace('{{age}}', String(getKoreanAge(MY_PROFILE.BIRTHDAY)));

  const archive = fetchVelogArchive();

  const latestVelogReleasedAt = archive.posts.reduce<string | null>((latest, post) => {
    if (!post.releasedAt) return latest;
    if (!latest) return post.releasedAt;
    return Date.parse(post.releasedAt) > Date.parse(latest) ? post.releasedAt : latest;
  }, null);
  const isNewVelogPost = isRecentPost(latestVelogReleasedAt, Date.now());

  return (
    <AnimatedSection className='w-full pt-6 md:pt-10'>
      <ProfileHeader isNewVelogPost={isNewVelogPost} />

      <div className='flex flex-col gap-10'>
        <div className='flex flex-col items-center gap-7 md:flex-row md:items-center md:gap-9'>
          <figure className='relative w-40 shrink-0 md:w-52 md:self-center'>
            <Image
              src='/images/profile.jpg'
              alt={dict.profile.photoAlt}
              width={208}
              height={208}
              priority
              sizes='(min-width: 768px) 208px, 160px'
              className='h-auto w-full rounded-2xl object-cover shadow-sm ring-1 ring-gray-100 dark:ring-gray-800'
            />
          </figure>

          <div className='flex w-full flex-col items-center gap-8 md:items-start md:gap-10'>
            <div className='flex w-full flex-col items-center gap-2 md:flex-row md:items-end md:justify-between md:gap-6'>
              <div className='text-center md:text-left'>
                <h1 className='font-pretendard text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-gray-100'>
                  {profile?.name}
                </h1>
                <p className='mt-2 flex items-baseline justify-center gap-2 text-gray-600 md:justify-start dark:text-gray-400'>
                  <span className='text-base font-medium tracking-tight text-gray-700 tabular-nums md:text-lg dark:text-gray-300'>
                    {profile?.birthDay}
                  </span>
                  <span aria-hidden='true' className='text-gray-300 dark:text-gray-600'>
                    ·
                  </span>
                  <span className='text-[13px] text-gray-500 md:text-sm dark:text-gray-500'>
                    {ageLabel}
                  </span>
                </p>
              </div>
              <div className='max-md:hidden md:self-end'>
                <LastUpdate />
              </div>
            </div>

            <div className='w-full gap-x-10 gap-y-3.5 text-sm text-gray-700 max-md:flex max-md:flex-col max-md:gap-3 md:grid md:grid-cols-2 md:text-[15px] dark:text-gray-300'>
              {profile?.descriptions.map((description, index) => (
                <ProfileItem
                  key={index}
                  icon={description.type}
                  href={
                    description.type === 'email' ? `mailto:${description.value}` : description.value
                  }
                  value={description.value}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </div>

        <div className='flex justify-center md:hidden'>
          <LastUpdate />
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ProfileWidget;
