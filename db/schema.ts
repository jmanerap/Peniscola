import { sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tripStates = sqliteTable("trip_states", {
  tripId: text("trip_id").primaryKey(),
  completedActivities: text("completed_activities").notNull().default("[]"),
  completedChallenges: text("completed_challenges").notNull().default("{}"),
  openedEnvelopes: text("opened_envelopes").notNull().default("[]"),
  unlockedSurprises: text("unlocked_surprises").notNull().default("[]"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const journalEntries = sqliteTable("journal_entries", {
  id: text("id").primaryKey(),
  tripId: text("trip_id").notNull(),
  title: text("title").notNull().default(""),
  body: text("body").notNull().default(""),
  location: text("location").notNull().default(""),
  photos: text("photos").notNull().default("[]"),
  reactions: text("reactions").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const dailyMoments = sqliteTable(
  "daily_moments",
  {
    tripId: text("trip_id").notNull(),
    day: text("day").notNull(),
    member: text("member").notNull(),
    answer: text("answer").notNull(),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [primaryKey({ columns: [table.tripId, table.day, table.member] })],
);

export const questionAnswers = sqliteTable(
  "question_answers",
  {
    tripId: text("trip_id").notNull(),
    questionId: text("question_id").notNull(),
    member: text("member").notNull(),
    answer: text("answer").notNull(),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [primaryKey({ columns: [table.tripId, table.questionId, table.member] })],
);

export const dailyPhotos = sqliteTable(
  "daily_photos",
  {
    tripId: text("trip_id").notNull(),
    day: text("day").notNull(),
    photoUrl: text("photo_url").notNull(),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [primaryKey({ columns: [table.tripId, table.day] })],
);

export const uploads = sqliteTable("uploads", {
  key: text("key").primaryKey(),
  tripId: text("trip_id").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
