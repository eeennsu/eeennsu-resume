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

// 뱃지 위계 부여용 — 핵심 스택만 파란 톤, 나머지는 outline 유지
export const CORE_SKILL_IDS: readonly SkillId[] = [
  SKILL_KEYS.react,
  SKILL_KEYS.nextjs,
  SKILL_KEYS.typescript,
];
