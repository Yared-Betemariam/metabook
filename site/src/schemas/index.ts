import z from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const accountSchema = z.object({
  name: z.string().max(255).min(1, "Name is required"),
  balance: z
    .string()
    .min(1, { message: "Balance is required" })
    .regex(/^[-+]?(?:\d+|\d*\.\d+)$/, "PNL must be a valid number")
    .or(z.literal("")),
  description: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

export const tradeSchema = z.object({
  account_id: z.number().min(1, "Account is required"),
  pair: z.string().max(20).min(1, "Pair is required"),
  date: z.date(),
  position: z.string().max(50).min(1, "Position is required"),
  outcome: z.string().optional(),
  pnl: z
    .string()
    .regex(/^[-+]?(?:\d+|\d*\.\d+)$/, "PNL must be a valid number")
    .optional()
    .or(z.literal("")),
  chart: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type TradeFormValues = z.infer<typeof tradeSchema>;

export const chatSchema = z.object({
  name: z.string().min(1, "Name is required"),
  messages: z.string().min(1, "Messages are required"),
  account_id: z.number().min(1, "Account is required"),
});

export type ChatFormValues = z.infer<typeof chatSchema>;
