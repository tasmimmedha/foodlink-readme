import { z } from "zod";

// Auth validators
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Inventory validators
export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  unit: z.string().optional(),
  expiryDate: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
});

// Shopping list validators
export const shoppingListItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  unit: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

// Community validators
export const communityPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type InventoryItemInput = z.infer<typeof inventoryItemSchema>;
export type ShoppingListItemInput = z.infer<typeof shoppingListItemSchema>;
export type CommunityPostInput = z.infer<typeof communityPostSchema>;

