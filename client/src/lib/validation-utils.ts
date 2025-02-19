import { z } from "zod";

// Basic regex patterns
export const phoneRegex = /^(\+61|0)?[4][0-9]{8}$/;
export const postcodeRegex = /^[0-9]{4}$/;

// Basic schemas
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(5, "Email must be at least 5 characters")
  .max(254, "Email must be less than 254 characters");

export const phoneSchema = z
  .string()
  .regex(phoneRegex, "Must be a valid Australian mobile number")
  .transform((val) => {
    if (val.startsWith("0")) return "+61" + val.slice(1);
    if (!val.startsWith("+")) return "+61" + val;
    return val;
  });

// Dimensions and measurements
export const dimensionsSchema = z.object({
  length: z.number().positive("Length must be positive"),
  width: z.number().positive("Width must be positive"),
  height: z.number().positive("Height must be positive"),
  unit: z.enum(["mm", "cm", "m", "inch"], {
    required_error: "Unit is required",
    invalid_type_error: "Invalid unit type",
  }),
});

export const weightSchema = z
  .number()
  .positive("Weight must be positive")
  .max(10000, "Weight cannot exceed 10,000 kg");

// Contact and personal information
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: phoneSchema,
  email: emailSchema,
  type: z.enum(["primary", "secondary"]),
});

// Address related schemas
export const propertyTypeSchema = z.enum(["single", "multi"]);

export const addressSchema = z.object({
  formatted_address: z.string().min(1, "Address is required"),
  propertyType: propertyTypeSchema,
  hasDriveway: z.boolean(),
  unitNumber: z.string().optional(),
  level: z.number().optional(),
  hasLift: z.boolean().optional(),
  pickupDateTime: z.date(),
  notes: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional()
}).refine((data) => {
  if (data.propertyType === 'multi') {
    return data.unitNumber && data.level !== undefined && data.hasLift !== undefined;
  }
  return true;
}, {
  message: "Multi-unit properties require unit number, level, and lift information"
});

// Item related schemas
export const itemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  weight: weightSchema.optional(),
  dimensions: dimensionsSchema.optional(),
  quantity: z.number().int().positive().default(1),
  description: z.string().optional(),
});

// Order form schemas
export const orderFormSchema = z.object({
  pickupAddress: addressSchema,
  dropoffAddress: addressSchema,
  items: z.array(itemSchema).min(1, "At least one item is required"),
  pickupContacts: z.array(contactSchema).min(1, "At least one pickup contact is required"),
  dropoffContacts: z.array(contactSchema).min(1, "At least one dropoff contact is required"),
});

// Helper functions
export const formatDimensions = (dimensions: z.infer<typeof dimensionsSchema>): string => {
  return `${dimensions.length}×${dimensions.width}×${dimensions.height}${dimensions.unit}`;
};

export const parseDimensions = (dimensionString: string): z.infer<typeof dimensionsSchema> | null => {
  const match = dimensionString.match(/(\d+)×(\d+)×(\d+)(mm|cm|m|inch)/);
  if (!match) return null;

  const [_, length, width, height, unit] = match;
  return {
    length: Number(length),
    width: Number(width),
    height: Number(height),
    unit: unit as "mm" | "cm" | "m" | "inch",
  };
};

// Validation helper functions
export const validateAddress = (address: unknown) => {
  return addressSchema.safeParse(address);
};

export const validateContact = (contact: unknown) => {
  return contactSchema.safeParse(contact);
};

export const validateItem = (item: unknown) => {
  return itemSchema.safeParse(item);
};

export const validateOrderForm = (formData: unknown) => {
  return orderFormSchema.safeParse(formData);
};

// Type exports
export type Address = z.infer<typeof addressSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
export type OrderFormData = z.infer<typeof orderFormSchema>;
