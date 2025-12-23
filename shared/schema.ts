import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// NOTE: This schema is primarily used for type definitions in this local-first app.
// We are using Dexie.js for client-side storage.

export const cuisineTypes = [
  "Pizza", "Thai", "Burgers", "Sushi", "Fish & Chips", 
  "Indian", "Mexican", "Chinese", "Vietnamese", "Italian", "Other"
] as const;

export const priceLevels = ["$", "$$", "$$$"] as const;
export const fatCautionLevels = ["Low", "Med", "High"] as const;

export const takeawayOptions = pgTable("takeaway_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cuisineTags: text("cuisine_tags").array().notNull(), 
  priceLevel: text("price_level", { enum: priceLevels }).notNull(),
  kidFriendlyScore: integer("kid_friendly_score").notNull(), 
  dairyFreeFriendly: text("dairy_free_friendly").notNull(), 
  healthyScore: integer("healthy_score").notNull(), 
  fatCaution: text("fat_caution", { enum: fatCautionLevels }).notNull(),
  deliveryAvailable: boolean("delivery_available").notNull(),
  pickupAvailable: boolean("pickup_available").notNull(),
  notes: text("notes"),
  lastOrderedAt: timestamp("last_ordered_at"),
  rating: integer("rating"), 
});

export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  optionId: integer("option_id").notNull(),
  optionName: text("option_name").notNull(),
  date: timestamp("date").notNull(),
  rating: integer("rating"),
});

// We need a dummy 'users' table to satisfy standard templates if they import it, 
// though we won't use it.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Zod Schemas
export const insertTakeawayOptionSchema = createInsertSchema(takeawayOptions).omit({ 
  id: true, 
  lastOrderedAt: true 
});

export const insertHistorySchema = createInsertSchema(history).omit({ 
  id: true 
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });

// Export types
export type TakeawayOption = typeof takeawayOptions.$inferSelect;
export type InsertTakeawayOption = z.infer<typeof insertTakeawayOptionSchema>;
export type HistoryItem = typeof history.$inferSelect;
export type InsertHistoryItem = z.infer<typeof insertHistorySchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Decision Filter Types
export type DecisionFilters = {
  mode: "pickup" | "delivery";
  maxBudget: "$" | "$$" | "$$$";
  kidFriendly: boolean;
  dairyFree: boolean;
  healthy: boolean;
  noRepeats: boolean;
};
