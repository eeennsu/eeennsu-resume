const RECENT_WINDOW_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const isRecentPost = (
  releasedAt: string | null | undefined,
  referenceMs: number,
  windowDays: number = RECENT_WINDOW_DAYS,
): boolean => {
  if (!releasedAt) return false;
  const releasedMs = Date.parse(releasedAt);
  if (Number.isNaN(releasedMs)) return false;
  const diff = referenceMs - releasedMs;
  return diff >= 0 && diff <= windowDays * MS_PER_DAY;
};
