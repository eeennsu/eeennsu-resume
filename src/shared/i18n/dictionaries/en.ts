import type { Dictionary } from './ko';

export const en: Dictionary = {
  meta: {
    title: 'Bang Eunsu | Frontend Developer Resume',
    titleTemplate: '%s | Bang Eunsu',
    description:
      'Resume of Bang Eunsu, a frontend developer working with TypeScript, React.js, and Next.js. Check out his career, skill stack, and project portfolio.',
    siteName: "Bang Eunsu's Resume",
    twitterDescription:
      'Resume of Bang Eunsu, a frontend developer working with TypeScript, React.js, and Next.js.',
    profileAlt: 'Bang Eunsu, Frontend Developer',
    keywords: [
      'Frontend Developer',
      'Bang Eunsu',
      'Resume',
      'Portfolio',
      '방은수',
      'React.js',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Web Developer',
    ],
  },
  jsonLd: {
    name: 'Bang Eunsu',
    alternateName: '방은수',
    jobTitle: 'Frontend Developer',
    description:
      'Resume of Bang Eunsu, a frontend developer working with TypeScript, React.js, and Next.js.',
  },
  notFoundMeta: {
    title: 'Page Not Found',
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
    photoAlt: 'Bang Eunsu, Frontend Developer profile photo',
    age: '(age {{age}})',
    itemAriaLabel: '{{label}} - {{value}}',
    iconLabel: {
      'email': 'Email',
      'github': 'GitHub',
      'velog': 'Velog',
      'self-blog': 'Personal blog',
    },
  },
  header: {
    githubAriaLabel: 'GitHub profile',
  },
  experience: {
    present: 'Present',
    totalDuration: '{{duration}} of total experience',
    daysWorking: 'Day {{days}} on the job',
    activityInProgress: 'In progress',
    problemLabel: 'Problem',
    solutionLabel: 'Solution',
  },
  lastUpdate: {
    label: 'Last update',
    dDayPositive: 'D + {{days}}',
    dDayZero: 'D - Day',
    loading: 'Loading update info',
  },
  notFound: {
    heading: '404 - Not Found',
    description: 'The page you are looking for does not exist.',
    home: 'Return Home',
  },
  error: {
    heading: 'Something went wrong!',
    description: 'Please try again in a moment.',
    retry: 'Try again',
    home: 'Return Home',
  },
  externalLink: {
    newTab: 'opens in new tab',
  },
  footer: {
    thanks: 'Thanks for reading!',
  },
  languageToggle: {
    label: 'Change language',
  },
  theme: {
    ariaLabel: 'Toggle theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    currentTemplate: 'Theme: {{current}} (click to switch to {{next}})',
  },
};
