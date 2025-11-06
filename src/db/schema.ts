import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const visitors = pgTable('visitors', {
  id: serial('id').primaryKey(),
  ip: text('ip').unique(), // IP는 선택적. 에러 발생 시 null 가능
  ipError: text('ip_error'), // 수집 실패 또는 오류 메시지
  userAgent: text('user_agent'), // 브라우저 user agent
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(), // 최초 방문 시각
});

export const visits = pgTable('visits', {
  id: serial('id').primaryKey(),
  visitorId: integer('visitor_id')
    .notNull()
    .references(() => visitors.id, { onDelete: 'cascade' }),
  visitedAt: timestamp('visited_at', { withTimezone: true }).defaultNow().notNull(), // 방문 시각 (재방문 시마다 기록)
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
