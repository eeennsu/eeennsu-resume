'use client';

import useVisibilityObserver from '@shared/hooks/useVisibilityObserver';
import { type FC } from 'react';

import Header from '@widgets/Header';

interface Props {
  isNewVelogPost: boolean;
}

const ProfileHeader: FC<Props> = ({ isNewVelogPost }) => {
  const [isHeaderVisible, profileRef] = useVisibilityObserver<HTMLDivElement>();

  return (
    <section ref={profileRef}>
      <Header isHeaderVisible={isHeaderVisible} isNewVelogPost={isNewVelogPost} />
    </section>
  );
};

export default ProfileHeader;
