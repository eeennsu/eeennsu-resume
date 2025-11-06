'use server';

import db from '@db/index';
import { visitors, visits } from '@db/schema';
import { eq } from 'drizzle-orm';

export async function trackVisitor(
  ip?: string | null,
  ipError?: string | null,
  userAgent?: string,
) {
  const data = {
    ip: ip ?? null,
    ipError: ipError ?? null,
    userAgent: userAgent ?? 'unknown',
  };

  let visitorId: number;

  if (ip) {
    const existing = await db.select().from(visitors).where(eq(visitors.ip, ip)).limit(1);
    if (existing.length > 0) {
      visitorId = existing[0].id;
    } else {
      const inserted = await db.insert(visitors).values(data).returning({ id: visitors.id });
      visitorId = inserted[0].id;
    }
  } else {
    // IP가 없으면 그냥 새 방문자 row 생성
    const inserted = await db.insert(visitors).values(data).returning({ id: visitors.id });
    visitorId = inserted[0].id;
  }

  await db.insert(visits).values({ visitorId });
}
