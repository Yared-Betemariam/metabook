import z from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const accountSchema = z.object({
  name: z.string().max(255).min(1, "Name is required"),
  balance: z
    .number({ error: "Balance must be a number" })
    .min(1, { message: "Balance is required" }),
  description: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;
