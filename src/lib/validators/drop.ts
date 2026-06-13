import { z } from "zod";

export const createDropSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be at most 120 characters"),

  totalStock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .positive("Stock must be greater than 0")
    .max(100000, "Stock is too large"),

  startsAt: z.string().min(1, "Start time is required"),

  endsAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .optional(),
});

export type CreateDropFormValues = z.infer<typeof createDropSchema>;
