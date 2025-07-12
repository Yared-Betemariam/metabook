import z from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
