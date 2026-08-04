'use server';

// import notifySlack from '@shared/api/slack';
import { eq } from 'drizzle-orm';

import db from '@db/index';
import { visitors, visits } from '@db/schema';

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

      // await notifySlack({
      //   title: '기존 출입',
      //   memo: existing[0]?.memo,
      //   ip,
      // });
    } else {
      const inserted = await db.insert(visitors).values(data).returning({ id: visitors.id });
      visitorId = inserted[0].id;

      // await notifySlack({
      //   title: '신규 출입',
      //   memo: existing[0]?.memo,
      //   ip,
      // });
    }
  } else {
    // IP가 없으면 그냥 새 방문자 row 생성
    const inserted = await db.insert(visitors).values(data).returning({ id: visitors.id });
    visitorId = inserted[0].id;

    // await notifySlack({
    //   title: '의문의 출입',
    //   memo: '',
    //   ip,
    // });
  }

  await db.insert(visits).values({ visitorId });
}
