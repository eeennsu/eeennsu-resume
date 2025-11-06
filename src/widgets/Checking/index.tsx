'use client';

import useGetIp from '@shared/hooks/useGetIp';
import { FC } from 'react';

const CheckingWidget: FC = () => {
  useGetIp();

  return null;
};

export default CheckingWidget;
