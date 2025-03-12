import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Mood entries table
export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  text: text("text").notNull(),
  sentiment: text("sentiment").notNull(), // happy, sad, anxious, calm, neutral
  score: integer("score").notNull(), // 1-5 for intensity
  analysis: text("analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMoodSchema = createInsertSchema(moods).pick({
  userId: true,
  text: true,
  sentiment: true,
  score: true,
  analysis: true,
});

// Chat messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(), // true if message is from user, false if from AI
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  userId: true,
  content: true,
  isUser: true,
});

// Activities table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  emoji: text("emoji").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // relaxation, physical, creative, social, mindfulness
});

export const insertActivitySchema = createInsertSchema(activities);

// Activity completions table
export const activityCompletions = pgTable("activity_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  activityId: integer("activity_id").references(() => activities.id),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertActivityCompletionSchema = createInsertSchema(activityCompletions).pick({
  userId: true,
  activityId: true,
});

// Activity recommendations table
export const activityRecommendations = pgTable("activity_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  moodId: integer("mood_id").references(() => moods.id),
  activityIds: json("activity_ids").$type<number[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivityRecommendationSchema = createInsertSchema(activityRecommendations).pick({
  userId: true,
  moodId: true,
  activityIds: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Mood = typeof moods.$inferSelect;
export type InsertMood = z.infer<typeof insertMoodSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type ActivityCompletion = typeof activityCompletions.$inferSelect;
export type InsertActivityCompletion = z.infer<typeof insertActivityCompletionSchema>;

export type ActivityRecommendation = typeof activityRecommendations.$inferSelect;
export type InsertActivityRecommendation = z.infer<typeof insertActivityRecommendationSchema>;
