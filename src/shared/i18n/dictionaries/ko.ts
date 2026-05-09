export const ko = {
  meta: {
    title: '방은수 | 프론트엔드 개발자 이력서',
    titleTemplate: '%s | 방은수',
    description:
      'TypeScript, React.js, Next.js 기반 프론트엔드 개발자 방은수의 이력서입니다. 경력, 기술 스택, 프로젝트 포트폴리오를 확인하세요.',
    siteName: '방은수 이력서',
    twitterDescription:
      'TypeScript, React.js, Next.js 기반 프론트엔드 개발자 방은수의 이력서입니다.',
    profileAlt: '방은수 프론트엔드 개발자',
    keywords: [
      '프론트엔드 개발자',
      '방은수',
      '이력서',
      '포트폴리오',
      'Bang Eunsu',
      'React.js',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Frontend Developer',
      'Resume',
      'Portfolio',
      '웹 개발자',
    ],
  },
  jsonLd: {
    name: '방은수',
    alternateName: 'Bang Eunsu',
    jobTitle: '프론트엔드 개발자',
    description: 'TypeScript, React.js, Next.js 기반 프론트엔드 개발자 방은수의 이력서입니다.',
  },
  notFoundMeta: {
    title: '페이지를 찾을 수 없습니다',
  },
  sections: {
    introduce: 'Introduce',
    experience: 'Experience',
    skills: 'Skills',
    portfolio: 'Portfolio',
    education: 'Education',
    certification: 'Certification',
  },
  profile: {
    photoAlt: '방은수 프론트엔드 개발자 프로필 사진',
    age: '(만 {{age}}세)',
    itemAriaLabel: '{{label}} - {{value}}',
    iconLabel: {
      'email': '이메일',
      'github': 'GitHub',
      'velog': 'Velog',
      'self-blog': '개인 블로그',
    },
  },
  header: {
    githubAriaLabel: 'GitHub 프로필',
  },
  experience: {
    present: '현재',
    totalDuration: '총 {{duration}} 근무',
    daysWorking: '{{days}}일째 근무 중',
    activityInProgress: '진행 중',
    problemLabel: 'Problem',
    solutionLabel: 'Solution',
  },
  lastUpdate: {
    label: '마지막 업데이트',
    dDayPositive: 'D + {{days}}',
    dDayZero: 'D - Day',
    loading: '업데이트 정보 불러오는 중',
  },
  notFound: {
    heading: '404 - Not Found',
    description: '찾으시는 페이지가 존재하지 않습니다.',
    home: '홈으로',
  },
  error: {
    heading: '문제가 발생했습니다.',
    description: '잠시 후 다시 시도해주세요.',
    retry: '다시 시도',
    home: '홈으로',
  },
  externalLink: {
    newTab: '새 창에서 열림',
  },
  footer: {
    thanks: 'Thanks for reading!',
  },
  languageToggle: {
    label: '언어 변경',
  },
  theme: {
    ariaLabel: '테마 전환',
    light: '라이트',
    dark: '다크',
    system: '시스템',
    currentTemplate: '테마: {{current}} (클릭 시 {{next}}로 전환)',
  },
};

export type Dictionary = typeof ko;
