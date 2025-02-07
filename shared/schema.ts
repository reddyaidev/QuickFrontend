import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  name: text("name"),
  isVerified: boolean("is_verified").default(false),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  pickupAddress: jsonb("pickup_address").notNull(),
  dropAddress: jsonb("drop_address").notNull(), 
  propertyType: text("property_type").notNull(),
  items: jsonb("items").notNull(),
  status: text("status").notNull().default("pending"),
  distance: integer("distance"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  phone: true,
  name: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  pickupAddress: true,
  dropAddress: true,
  propertyType: true,
  items: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
