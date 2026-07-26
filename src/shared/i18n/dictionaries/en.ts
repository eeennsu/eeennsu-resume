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
    settingsAriaLabel: 'Settings',
    settingsLanguage: 'Language',
    settingsTheme: 'Theme',
    jdMatchLink: 'JD Match',
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
  aiChat: {
    launcher: 'Ask about my resume',
    title: 'AI Resume Chatbot',
    greeting: "Hi! Ask me anything about Bang Eunsu's experience, projects, or skills.",
    placeholder: 'e.g. What are the main projects?',
    send: 'Send',
    close: 'Close',
    thinking: 'Typing…',
    error: 'Something went wrong. Please try again in a moment.',
    limit: "Today's usage limit has been reached. Please try again tomorrow.",
    starters: ['Main projects?', 'React experience?', 'Biggest strengths?'],
    flow: {
      ariaLabel: 'View chatbot implementation flow',
      title: 'How was this built?',
      steps: [
        'Cloudflare Turnstile blocks bot requests.',
        'A global daily cap prevents free-tier abuse.',
        'YAML resume data is assembled into a system prompt.',
        'Gemini Flash streams the reply, falling back to another model on overload.',
        'Responses are rendered as markdown.',
      ],
    },
  },
  jdMatch: {
    sectionTitle: 'JD Match',
    title: 'JD Fit Analysis',
    description: 'Paste a job description and AI will analyze how well my resume fits it.',
    cta: 'Start analysis',
    placeholder: 'Paste the job description here…',
    analyze: 'Analyze',
    analyzing: 'Analyzing…',
    analyzingSteps: [
      'Reading the résumé…',
      'Digging into the job description…',
      'Matching core skills…',
      'Calculating fit…',
      'Spotting gaps…',
      'Drafting pitch points…',
      'Curating relevant experience…',
      'Wrapping up…',
    ],
    fitScore: 'Fit score',
    matchedSkills: 'Matched skills',
    gaps: 'Gaps',
    pitch: 'Pitch points',
    relevantExperience: 'Relevant experience',
    flow: {
      ariaLabel: 'View JD Match flow',
      title: 'How was this built?',
      steps: [
        'Cloudflare Turnstile blocks bot requests.',
        'A global daily cap prevents free-tier abuse.',
        'Resume YAML and your pasted JD are assembled into a system prompt together.',
        'Gemini Flash responds with structured JSON (fit score, matches, gaps, pitch, experience).',
        'Results render as a score band and tag lists.',
      ],
    },
    empty: 'Please enter a job description.',
    error: 'Analysis failed. Please try again in a moment.',
    limit: "Today's analysis limit has been reached. Please try again tomorrow.",
    disclaimer: 'An AI-generated reference analysis comparing the resume and the JD.',
  },
  writings: {
    pageTitle: 'Writings & Retrospectives',
    pageDescription:
      'A tag-first restructuring of my frontend and React Native learning notes and retrospectives, curated on Velog (@diso592).',
    tab: {
      tagCloud: 'By tag',
      timeline: 'By time',
    },
    empty: 'No writings collected yet.',
    lastFetched: 'Collected as of {{when}}',
    stats: {
      posts: '{{count}} writings',
      tags: '{{count}} tags',
    },
    skillMap: {
      count: '{{count}} posts',
      empty: 'No skill-mapped writings yet. Tag your Velog posts to fill this in.',
    },
    tagCloud: {
      all: 'All',
      empty: 'No writings for this tag yet.',
    },
    relatedPosts: {
      badgeLabel: '{{count}} related writings',
      empty: 'No related writings yet.',
      inlineAria: 'View {{count}} writings for this skill',
    },
    activityBadge: {
      label: 'Real-world link',
    },
    recent: {
      badge: 'NEW',
    },
    behindTheScenes: {
      title: 'How was this page built?',
      description: 'Velog GraphQL → deployment pipeline → RSC static rendering',
      cronNote:
        'A GitHub Actions cron polls the velog RSS and triggers a deploy webhook when a new post is detected.',
      stack: ['Velog GraphQL', 'Next.js RSC', 'TypeScript', 'GitHub Actions'],
      steps: {
        source: 'velog.io/@diso592 posts + tags',
        fetch: 'GraphQL cursor pagination on deploy',
        seed: 'committed seed, previous JSON retained on failure',
        render: 'server fs load, RSC static rendering',
        output: '/{locale}/writings static HTML',
      },
    },
    nav: {
      link: 'Writings',
      back: 'Back to resume',
    },
    cta: {
      viewAll: 'View all writings',
    },
  },
};
