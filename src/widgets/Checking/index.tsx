'use client';

import { FC } from 'react';

import useGetIp from '@shared/hooks/useGetIp';

const CheckingWidget: FC = () => {
  useGetIp();

  return null;
};

export default CheckingWidget;
