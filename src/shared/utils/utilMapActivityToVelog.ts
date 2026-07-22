import type { IActivity, IActivityVelogMapping } from '@shared/types/subjects';
import type { IVelogArchive, IVelogPost } from '@shared/types/velog';

const normalize = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, '-');

export const mapActivityToVelog = (
  activities: IActivity[],
  mappings: IActivityVelogMapping[],
  archive: IVelogArchive,
): Map<string, IVelogPost[]> => {
  const result = new Map<string, IVelogPost[]>();
  const postsBySlug = new Map<string, IVelogPost>();
  for (const post of archive.posts) postsBySlug.set(post.urlSlug, post);

  const mappingById = new Map<string, IActivityVelogMapping>();
  for (const m of mappings) mappingById.set(m.activityId, m);

  for (const activity of activities) {
    const mapping = mappingById.get(activity.id);
    if (!mapping) {
      result.set(activity.id, []);
      continue;
    }

    const techTagSet = new Set(mapping.techTags.map(normalize));
    const excludeSet = new Set(mapping.excludeVelogSlugs ?? []);
    const collected = new Map<string, IVelogPost>();

    for (const slug of mapping.featuredVelogSlugs ?? []) {
      const post = postsBySlug.get(slug);
      if (post && !excludeSet.has(post.urlSlug)) collected.set(post.id, post);
    }

    for (const post of archive.posts) {
      if (excludeSet.has(post.urlSlug)) continue;
      const matched = post.tags.some(tag => techTagSet.has(normalize(tag)));
      if (matched) collected.set(post.id, post);
    }

    result.set(activity.id, Array.from(collected.values()));
  }

  return result;
};
