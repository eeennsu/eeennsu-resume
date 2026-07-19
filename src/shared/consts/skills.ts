export const SKILL_KEYS = {
  react: 'react',
  reactNative: 'react-native',
  nextjs: 'nextjs',
  typescript: 'typescript',
  javascript: 'javascript',
  css: 'css',
  stateManagement: 'state-management',
  test: 'test',
  cs: 'cs',
  retrospect: 'retrospect',
} as const;

export type SkillId = (typeof SKILL_KEYS)[keyof typeof SKILL_KEYS];
