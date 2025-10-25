import dayjs from 'dayjs';

export const getEstimatedDuration = (startDate: string, endDate: string, offsetDay = 15) => {
  const diffMonth = dayjs(endDate).diff(dayjs(startDate), 'month');
  const diffDays = dayjs(endDate).diff(dayjs(startDate), 'day');

  // 1개월 미만
  if (diffMonth < 1) {
    // 일 단위 차이가 offsetDay 이상이면 "1개월"
    if (diffDays >= offsetDay) return '1개월';
    // 그 외에는 주 단위로 표시
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}주`;
  }

  const remainingDays = diffDays - diffMonth * 30;
  const estimatedMonths = remainingDays > offsetDay ? diffMonth + 1 : diffMonth;

  return `${estimatedMonths}개월`;
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

export const getCompanyServiceDuration = (startDate: string, endDate: string) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const years = end.year() - start.year();
  const months = end.month() - start.month();

  const adjustedYears = years + (months < 0 ? -1 : 0);
  const adjustedMonths = (months + 12) % 12;
  const adjustedDay = end.date() - start.date();

  const result = [];

  if (adjustedYears > 0) result.push(`${adjustedYears}년`);
  if (adjustedMonths > 0) result.push(`${adjustedMonths}개월`);
  if (adjustedDay > 0) result.push(`${adjustedDay}일`);

  return result.join(' ');
};

export const getWorkAnniversary = (startDate: string): string => {
  const now = dayjs();
  const start = dayjs(startDate);

  const totalMonths = now.diff(start, 'M');
  const years = Math.floor(totalMonths / 12);
  const months = (totalMonths % 12) - 1;

  return `${years}년 ${months}개월`;
};
