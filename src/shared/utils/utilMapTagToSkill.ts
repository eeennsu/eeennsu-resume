import { SKILL_KEYS, type SkillId } from '@shared/consts/skills';

export const TAG_TO_SKILL: Record<SkillId, readonly string[]> = {
  [SKILL_KEYS.react]: ['react', 'reactjs', 'react-hooks'],
  [SKILL_KEYS.reactNative]: ['react-native', 'rn', 'expo'],
  [SKILL_KEYS.nextjs]: ['nextjs', 'next', 'app-router'],
  [SKILL_KEYS.typescript]: ['typescript', 'ts'],
  [SKILL_KEYS.javascript]: ['javascript', 'js', 'es6'],
  [SKILL_KEYS.css]: ['css', 'tailwind', 'tailwindcss', 'scss'],
  [SKILL_KEYS.stateManagement]: [
    'zustand',
    'redux',
    'react-query',
    'tanstack-query',
    'recoil',
    'jotai',
  ],
  [SKILL_KEYS.test]: ['jest', 'testing-library', 'vitest', 'playwright', 'cypress'],
  [SKILL_KEYS.cs]: ['algorithm', '자료구조', 'cs', 'data-structure'],
  [SKILL_KEYS.retrospect]: ['회고', 'retrospect', '회고록'],
};

export const LABEL_TO_SKILL: Record<string, SkillId> = {
  'JavaScript (ES6+)': SKILL_KEYS.javascript,
  'TypeScript': SKILL_KEYS.typescript,
  'React.js (vite)': SKILL_KEYS.react,
  'Next.js': SKILL_KEYS.nextjs,
  'React Native (CLI)': SKILL_KEYS.reactNative,
  'Tailwind CSS': SKILL_KEYS.css,
  'Tanstack Query': SKILL_KEYS.stateManagement,
  'Zustand': SKILL_KEYS.stateManagement,
  'Recoil': SKILL_KEYS.stateManagement,
};

const normalizeTag = (tag: string): string => tag.trim().toLowerCase().replace(/\s+/g, '-');

const TAG_LOOKUP: Map<string, SkillId> = (() => {
  const map = new Map<string, SkillId>();
  for (const [skillId, tags] of Object.entries(TAG_TO_SKILL) as Array<
    [SkillId, readonly string[]]
  >) {
    for (const tag of tags) map.set(normalizeTag(tag), skillId);
  }
  return map;
})();

export const mapTagToSkillId = (tag: string): SkillId | null => {
  return TAG_LOOKUP.get(normalizeTag(tag)) ?? null;
};

export const mapLabelToSkillId = (label: string): SkillId | null => {
  return LABEL_TO_SKILL[label] ?? null;
};
