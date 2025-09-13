import { IProfile } from '@shared/types/subjects';
import { loadSubjects } from '@shared/utils/utilFetchSubjects';
import { type FC } from 'react';

import ProfileHeader from '@features/portfolio/ui/Header';
import ProfileItem from '@features/profile/ui/Item';
import LastUpdate from '@features/profile/ui/LastUpdate';

const ProfileWidget: FC = () => {
  const profile = loadSubjects<IProfile>('profile.yaml');

  return (
    <section className='w-full pt-6 md:py-10'>
      <ProfileHeader />

      <div className='flex flex-col gap-8 px-6 md:mx-auto md:max-w-6xl md:flex-row md:justify-between md:px-12'>
        <div className='flex flex-col items-center gap-6 md:flex-row md:items-start'>
          <figure className='relative w-40 shrink-0 md:w-48'>
            <img
              src='images/profile.jpg'
              alt='profile'
              className='w-full rounded-2xl object-cover shadow'
            />
          </figure>

          <div className='flex flex-col items-center gap-5 md:items-start'>
            <div className='text-center md:text-left'>
              <h1 className='font-serif text-3xl font-semibold text-gray-900'>{profile?.name}</h1>
              <p className='mt-1 text-gray-500'>{profile?.birthDay}</p>
            </div>

            <div className='flex flex-col gap-2 text-sm text-gray-700 md:text-base'>
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
