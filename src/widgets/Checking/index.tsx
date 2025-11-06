'use client';

import useGetIp from '@shared/hooks/useGetIp';
import { FC } from 'react';

const CheckingWidget: FC = () => {
  const { ip } = useGetIp();

  console.log('ip', ip);

  return null;
};

export default CheckingWidget;
