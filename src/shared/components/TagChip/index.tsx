import { type SkillId } from '@shared/consts/skills';
import { cn } from '@shared/shadcn-ui/utils';
import { getPaletteForSkill } from '@shared/utils/tagColor';
import { type FC } from 'react';

interface Props {
  label: string;
  skillId: SkillId | null;
  size?: 'sm' | 'md';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
} as const;

const TagChip: FC<Props> = ({ label, skillId, size = 'md', className }) => {
  const palette = getPaletteForSkill(skillId);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium tracking-tight',
        SIZE_CLASSES[size],
        palette.chip,
        palette.border,
        className,
      )}
    >
      {label}
    </span>
  );
};

export default TagChip;
