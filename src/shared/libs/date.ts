import type { Locale } from '@shared/i18n/config';
import dayjs from 'dayjs';

const DURATION_LABELS = {
  ko: { y: '년', m: '개월', d: '일', w: '주', zero: '0개월' },
  en: { y: 'y', m: 'mo', d: 'd', w: 'w', zero: '0mo' },
} as const;

export const getEstimatedDuration = (
  startDate: string,
  endDate: string,
  locale: Locale = 'ko',
  offsetDay = 15,
) => {
  const labels = DURATION_LABELS[locale];
  const diffMonth = dayjs(endDate).diff(dayjs(startDate), 'month');
  const diffDays = dayjs(endDate).diff(dayjs(startDate), 'day');

  if (diffMonth < 1) {
    if (diffDays >= offsetDay) return `1${labels.m}`;
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}${labels.w}`;
  }

  const remainingDays = diffDays - diffMonth * 30;
  const estimatedMonths = remainingDays > offsetDay ? diffMonth + 1 : diffMonth;

  return `${estimatedMonths}${labels.m}`;
};

export const getKoreanAge = (birthDate: string) => {
  const today = dayjs();
  const birthday = dayjs(birthDate);
  let age = today.year() - birthday.year();

  const todayMonth = today.month() + 1;
  const birthdayMonth = birthday.month() + 1;

  if (
    birthdayMonth > todayMonth ||
    (birthdayMonth === todayMonth && birthday.date() > today.date())
  ) {
    age -= 1;
  }

  return age;
};

export const getCompanyServiceDuration = (
  startDate: string,
  endDate: string,
  locale: Locale = 'ko',
) => {
  const labels = DURATION_LABELS[locale];
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const years = end.year() - start.year();
  const months = end.month() - start.month();

  const adjustedYears = years + (months < 0 ? -1 : 0);
  const adjustedMonths = (months + 12) % 12;
  const adjustedDay = end.date() - start.date();

  const result = [];

  if (adjustedYears > 0) result.push(`${adjustedYears}${labels.y}`);
  if (adjustedMonths > 0) result.push(`${adjustedMonths}${labels.m}`);
  if (adjustedDay > 0) result.push(`${adjustedDay}${labels.d}`);

  return result.join(' ');
};

export const getWorkAnniversary = (startDate: string, locale: Locale = 'ko'): string => {
  const labels = DURATION_LABELS[locale];
  const now = dayjs();
  const start = dayjs(startDate);

  const totalMonths = now.diff(start, 'M');
  const years = Math.floor(totalMonths / 12);
  const months = (totalMonths % 12) - 1;

  const result = [];

  if (years > 0) result.push(`${years}${labels.y}`);
  if (months > 0) result.push(`${months}${labels.m}`);

  return result.length > 0 ? result.join(' ') : labels.zero;
};
