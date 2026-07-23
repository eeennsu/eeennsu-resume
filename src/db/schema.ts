import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const visitors = pgTable('visitors', {
  id: serial('id').primaryKey(),
  ip: text('ip').unique(), // IP는 선택적. 에러 발생 시 null 가능
  ipError: text('ip_error'), // 수집 실패 또는 오류 메시지
  userAgent: text('user_agent'), // 브라우저 user agent
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`(NOW() AT TIME ZONE 'Asia/Seoul')`)
    .notNull(),
  memo: text('memo'),
});

export const visits = pgTable('visits', {
  id: serial('id').primaryKey(),
  visitorId: integer('visitor_id')
    .notNull()
    .references(() => visitors.id, { onDelete: 'cascade' }),
  visitedAt: timestamp('visited_at', { withTimezone: true })
    .default(sql`(NOW() AT TIME ZONE 'Asia/Seoul')`)
    .notNull(),
});

export const visitorsRelations = relations(visitors, ({ many }) => ({
  visits: many(visits),
}));

export const visitsRelations = relations(visits, ({ one }) => ({
  visitor: one(visitors, {
    fields: [visits.visitorId],
    references: [visitors.id],
  }),
}));

// AI 기능(챗봇/JD) 전역 일일 사용량 카운터. (feature, usedOn) 하루 1행.
// 비용 방어의 핵심 — 전역 캡 초과 시 그날 해당 기능 차단.
export const aiUsage = pgTable(
  'ai_usage',
  {
    id: serial('id').primaryKey(),
    feature: text('feature').notNull(), // 'chat' | 'jd'
    usedOn: text('used_on').notNull(), // 'YYYY-MM-DD' (Asia/Seoul)
    count: integer('count').notNull().default(0),
    tokensIn: integer('tokens_in').notNull().default(0),
    tokensOut: integer('tokens_out').notNull().default(0),
  },
  table => ({
    featureDayUnique: unique('ai_usage_feature_used_on_unique').on(table.feature, table.usedOn),
  }),
);
