'use client';

import useVisibilityObserver from '@shared/hooks/useVisibilityObserver';
import { type FC } from 'react';

import Header from '@widgets/Header';

interface Props {
  latestVelogReleasedAt: string | null;
}

const ProfileHeader: FC<Props> = ({ latestVelogReleasedAt }) => {
  const [isHeaderVisible, profileRef] = useVisibilityObserver<HTMLDivElement>();

  return (
    <section ref={profileRef}>
      <Header isHeaderVisible={isHeaderVisible} latestVelogReleasedAt={latestVelogReleasedAt} />
    </section>
  );
};

export default ProfileHeader;
