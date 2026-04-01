import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  targetRoles: z.string().min(2, "Please provide at least one target role"),
  socials: z.object({
    email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
    phone: z.string().regex(/^\+?[0-9\s\-\(\)\.]{7,20}$|^$/, "Please enter a valid phone number").optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
    linkedin: z.union([
      z.string().url("Please enter a valid URL"), 
      z.string().regex(/^[\w\-]+\.[\w\-]+/i, "Please enter a valid domain")
    ]).optional().or(z.literal('')),
    website: z.union([
      z.string().url("Please enter a valid URL"), 
      z.string().regex(/^[\w\-]+\.[\w\-]+/i, "Please enter a valid domain")
    ]).optional().or(z.literal('')),
  })
});

export type ContactErrors = Partial<Record<"fullName" | "targetRoles" | "email" | "phone" | "location" | "linkedin" | "website", string>>;
