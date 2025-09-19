import { MY_PROFILE } from '@shared/consts/commons';
import { getKoreanAge } from '@shared/libs/date';
import { IProfile } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import { type FC } from 'react';

import ProfileHeader from '@features/portfolio/ui/Header';
import ProfileItem from '@features/profile/ui/Item';
import LastUpdate from '@features/profile/ui/LastUpdate';

const ProfileWidget: FC = () => {
  const profile = loadSubjects<IProfile>('profile.yml');

  return (
    <section className='w-full pt-6 md:pt-10'>
      <ProfileHeader />

      <div className='flex flex-col gap-10 px-6 md:mx-auto md:max-w-6xl md:flex-row md:items-start md:justify-between md:px-12'>
        <div className='flex flex-col items-center gap-6 md:flex-row'>
          <figure className='relative w-40 shrink-0 md:w-52'>
            <img
              src='images/profile.jpg'
              alt='profile'
              className='w-full rounded-2xl object-cover shadow'
            />
          </figure>

          <div className='flex flex-col items-center gap-10 md:ml-6 md:items-start'>
            <div className='text-center md:text-left'>
              <h1 className='text-3xl font-medium text-gray-900 md:text-4xl'>{profile?.name}</h1>
              <p className='mt-1 text-lg font-medium text-gray-500 md:mt-5'>
                {profile?.birthDay}
                <span className='ml-2 text-base'>(만{getKoreanAge(MY_PROFILE.BIRTHDAY)} 세)</span>
              </p>
            </div>

            <div className='space-y-3 gap-x-10 gap-y-4 text-sm text-gray-700 md:grid md:grid-cols-2 md:space-y-0 md:text-base'>
              {profile?.descriptions.map((description, index) => (
                <ProfileItem
                  key={index}
                  icon={description.type}
                  href={
                    description.type === 'email' ? `mailto:${description.value}` : description.value
                  }
                  value={description.value}
                />
              ))}
            </div>
          </div>
        </div>

        <div className='flex justify-center md:justify-end'>
          <LastUpdate />
        </div>
      </div>
    </section>
  );
};

export default ProfileWidget;
