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

export const addressSchema = z.object({
  formatted_address: z.string().min(1, "Address is required"),
  propertyType: z.enum(["single", "multi"]),
  unitNumber: z.string().optional(),
  level: z.number().optional(),
  hasLift: z.boolean().optional(),
  hasDriveway: z.boolean().optional(),
  notes: z.string().optional(),
  pickupDateTime: z.date().optional(),
});

export const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
    unit: z.string()
  }).optional(),
});

export const orderSchema = z.object({
  pickupAddress: addressSchema,
  dropAddress: addressSchema,
  items: z.array(itemSchema).min(1, "At least one item is required"),
  distance: z.number().optional(),
  totalItems: z.number().optional(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Item = z.infer<typeof itemSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
