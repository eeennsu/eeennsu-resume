import { SKILL_KEYS, type SkillId } from '@shared/consts/skills';

export type TagColorCategory = 'frontend' | 'backend' | 'cs' | 'retrospect' | 'etc';

interface TagColorPalette {
  chip: string;
  border: string;
}

export const TAG_CATEGORY_COLORS: Record<TagColorCategory, TagColorPalette> = {
  frontend: {
    chip: 'bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-500/25',
  },
  backend: {
    chip: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200',
    border: 'border-emerald-200 dark:border-emerald-500/25',
  },
  cs: {
    chip: 'bg-violet-50 text-violet-800 dark:bg-violet-500/10 dark:text-violet-200',
    border: 'border-violet-200 dark:border-violet-500/25',
  },
  retrospect: {
    chip: 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200',
    border: 'border-amber-200 dark:border-amber-500/25',
  },
  etc: {
    chip: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
  },
};

const SKILL_TO_CATEGORY: Record<SkillId, TagColorCategory> = {
  [SKILL_KEYS.react]: 'frontend',
  [SKILL_KEYS.reactNative]: 'frontend',
  [SKILL_KEYS.nextjs]: 'frontend',
  [SKILL_KEYS.typescript]: 'frontend',
  [SKILL_KEYS.javascript]: 'frontend',
  [SKILL_KEYS.css]: 'frontend',
  [SKILL_KEYS.stateManagement]: 'frontend',
  [SKILL_KEYS.test]: 'backend',
  [SKILL_KEYS.cs]: 'cs',
  [SKILL_KEYS.retrospect]: 'retrospect',
};

export const getCategoryForSkill = (skillId: SkillId | null): TagColorCategory => {
  if (!skillId) return 'etc';
  return SKILL_TO_CATEGORY[skillId] ?? 'etc';
};

export const getPaletteForSkill = (skillId: SkillId | null): TagColorPalette => {
  return TAG_CATEGORY_COLORS[getCategoryForSkill(skillId)];
};
