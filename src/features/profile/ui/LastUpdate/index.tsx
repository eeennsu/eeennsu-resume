'use client';

import dayjs, { Dayjs } from 'dayjs';
import { useParams } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

import apiGetBranchCommitDate from '@features/github/apis/getBranchCommitDate';

import { resolveDictionary } from '@shared/i18n/dictionaries';

const LastUpdate: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const { dict } = resolveDictionary(locale);
  const [commitDate, setCommitDate] = useState<Dayjs | null>(null);
  // const [commitDate] = useState<Dayjs>(dayjs('2025.11.02'));

  const setDefaultCommitDate = (date: string | Dayjs) => {
    setCommitDate(dayjs(date).subtract(14, 'days'));
  };

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const isoDate = await apiGetBranchCommitDate();

        if (!isoDate) {
          setDefaultCommitDate(dayjs());
          return;
        }

        setCommitDate(dayjs(isoDate));
      } catch (error) {
        console.log(error);
        setDefaultCommitDate(dayjs());
      }
    };

    fetchBranchData();
  }, []);

  const formattedDate = commitDate ? commitDate.format('YYYY.MM.DD') : null;
  const dayDiff = commitDate ? dayjs().startOf('day').diff(commitDate.startOf('day'), 'day') : null;

  const dDayLabel =
    dayDiff !== null && dayDiff > 0
      ? dict.lastUpdate.dDayPositive.replace('{{days}}', String(dayDiff))
      : dict.lastUpdate.dDayZero;

  return (
    <div className='flex h-fit flex-col items-center rounded-md text-base md:items-end md:text-sm'>
      <p className='text-muted-foreground text-sm md:text-right md:text-xs'>
        {dict.lastUpdate.label}
      </p>
      <div
        className='flex min-h-6 w-full flex-col items-center md:items-end'
        aria-live='polite'
        aria-busy={!formattedDate}
      >
        {formattedDate ? (
          <span className='font-semibold tracking-tight'>
            {formattedDate} ({dDayLabel})
          </span>
        ) : (
          <span
            className='h-5 w-40 animate-pulse rounded bg-gray-200/70 dark:bg-gray-800/70'
            aria-label={dict.lastUpdate.loading}
          />
        )}
      </div>
    </div>
  );
};

export default LastUpdate;
