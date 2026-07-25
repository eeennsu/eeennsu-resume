import { SKILL_KEYS, type SkillId } from '@shared/consts/skills';
import { VELOG_BASE_URL } from '@shared/consts/velog';
import { cn } from '@shared/shadcn-ui/utils';
import type { IVelogArchive, IVelogPost } from '@shared/types/velog';
import { getPaletteForSkill } from '@shared/utils/tagColor';
import { mapTagToSkillId } from '@shared/utils/utilMapTagToSkill';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

interface Props {
  archive: IVelogArchive;
  emptyLabel: string;
  countLabel: string;
}

const SKILL_LABELS: Record<SkillId, string> = {
  [SKILL_KEYS.react]: 'React',
  [SKILL_KEYS.reactNative]: 'React Native',
  [SKILL_KEYS.nextjs]: 'Next.js',
  [SKILL_KEYS.typescript]: 'TypeScript',
  [SKILL_KEYS.javascript]: 'JavaScript',
  [SKILL_KEYS.css]: 'CSS · Tailwind',
  [SKILL_KEYS.stateManagement]: 'State Management',
  [SKILL_KEYS.test]: 'Test',
  [SKILL_KEYS.cs]: 'CS · 자료구조',
  [SKILL_KEYS.retrospect]: '회고',
};

const groupPostsBySkill = (posts: IVelogPost[]): Map<SkillId, IVelogPost[]> => {
  const map = new Map<SkillId, IVelogPost[]>();
  for (const post of posts) {
    const seen = new Set<SkillId>();
    for (const tag of post.tags) {
      const skillId = mapTagToSkillId(tag);
      if (!skillId || seen.has(skillId)) continue;
      seen.add(skillId);
      const list = map.get(skillId) ?? [];
      list.push(post);
      map.set(skillId, list);
    }
  }
  return map;
};

const SkillMap: FC<Props> = ({ archive, emptyLabel, countLabel }) => {
  const grouped = groupPostsBySkill(archive.posts);
  const entries = (Object.values(SKILL_KEYS) as SkillId[])
    .map(skillId => ({ skillId, posts: grouped.get(skillId) ?? [] }))
    .filter(entry => entry.posts.length > 0);

  if (entries.length === 0) {
    return (
      <section
        aria-labelledby='writings-skillmap-heading'
        className='mx-6 rounded-2xl border border-dashed border-gray-300 bg-white/50 px-6 py-10 text-center text-sm text-gray-500 md:mx-auto md:max-w-6xl dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-400'
      >
        <h2 id='writings-skillmap-heading' className='sr-only'>
          Skill Map
        </h2>
        {emptyLabel}
      </section>
    );
  }

  return (
    <section
      aria-labelledby='writings-skillmap-heading'
      className='flex flex-col gap-4 px-6 md:mx-auto md:max-w-6xl md:px-12'
    >
      <h2
        id='writings-skillmap-heading'
        className='text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-200'
      >
        Skill Map
      </h2>
      <ul className='grid gap-3 md:grid-cols-2'>
        {entries.map(({ skillId, posts }) => {
          const palette = getPaletteForSkill(skillId);
          return (
            <li key={skillId} id={`skill-map-${skillId}`}>
              <details className='group rounded-xl border border-gray-200 bg-white transition-colors open:border-gray-300 dark:border-gray-800 dark:bg-gray-950/40 open:dark:border-gray-700'>
                <summary
                  className={cn(
                    'flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 select-none',
                    palette.chip,
                  )}
                >
                  <span className='flex items-baseline gap-2 text-[14px] font-semibold tracking-tight'>
                    {SKILL_LABELS[skillId]}
                    <span className='text-[11px] tabular-nums opacity-70'>
                      {countLabel.replace('{{count}}', String(posts.length))}
                    </span>
                  </span>
                  <ChevronDown
                    className='size-4 transition-transform group-open:rotate-180'
                    aria-hidden
                  />
                </summary>
                <ol className='flex flex-col divide-y divide-gray-100 border-t border-gray-100 dark:divide-gray-800 dark:border-gray-800'>
                  {posts.slice(0, 5).map(post => (
                    <li key={post.id}>
                      <Link
                        href={`${VELOG_BASE_URL}/${post.urlSlug}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block px-4 py-3 text-[13px] text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900/40'
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default SkillMap;
