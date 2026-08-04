import { and, eq, sql } from 'drizzle-orm';

import db from '@db/index';
import { aiUsage } from '@db/schema';

export type AiFeature = 'chat' | 'jd';

// 기능별 전역 일일 캡. 둘 다 Gemini Flash지만 JD는 입력(이력서+JD 전문)과
// 구조화 JSON 응답이 무거워 토큰 소비가 몇 배 커서 더 타이트.
const DAILY_CAP: Record<AiFeature, number> = {
  chat: 800,
  jd: 100,
};

const seoulDate = sql<string>`(NOW() AT TIME ZONE 'Asia/Seoul')::date::text`;

interface CapResult {
  ok: boolean;
  count: number;
  cap: number;
}

// LLM 호출 전 원자적으로 카운트를 증가시키고 캡 초과 여부를 반환한다.
// INSERT ... ON CONFLICT DO UPDATE ... RETURNING 으로 단일 원자 연산.
export const incrementAndCheck = async (feature: AiFeature): Promise<CapResult> => {
  const cap = DAILY_CAP[feature];

  const [row] = await db
    .insert(aiUsage)
    .values({ feature, usedOn: seoulDate, count: 1 })
    .onConflictDoUpdate({
      target: [aiUsage.feature, aiUsage.usedOn],
      set: { count: sql`${aiUsage.count} + 1` },
    })
    .returning({ count: aiUsage.count });

  const count = row?.count ?? 0;
  return { ok: count <= cap, count, cap };
};

// LLM 실패(5xx/refusal) 시 선증가한 카운트를 환불한다. best-effort.
// 클라 abort는 환불하지 않음(스트림 재-roll 무한 우회 방지 — 선증가가 겸함).
export const refund = async (feature: AiFeature): Promise<void> => {
  try {
    await db
      .update(aiUsage)
      .set({ count: sql`GREATEST(${aiUsage.count} - 1, 0)` })
      .where(and(eq(aiUsage.feature, feature), eq(aiUsage.usedOn, seoulDate)));
  } catch (err) {
    console.error('[cap] refund failed', err);
  }
};

// 완료 후 토큰 사용량 기록(관측용, best-effort). 오늘 행에 누적.
export const recordTokens = async (
  feature: AiFeature,
  tokensIn: number,
  tokensOut: number,
): Promise<void> => {
  try {
    await db
      .update(aiUsage)
      .set({
        tokensIn: sql`${aiUsage.tokensIn} + ${tokensIn}`,
        tokensOut: sql`${aiUsage.tokensOut} + ${tokensOut}`,
      })
      .where(and(eq(aiUsage.feature, feature), eq(aiUsage.usedOn, seoulDate)));
  } catch (err) {
    console.error('[cap] recordTokens failed', err);
  }
};
