import { db } from "@/db";
import { users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "../init";
import { eq } from "drizzle-orm";
import { profileSchema } from "@/schemas";

export const appRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async (opts) => {
      console.log("st");
      await db
        .update(users)
        .set(opts.input)
        .where(eq(users.email, opts.ctx.session.user.email));
      console.log("en");

      return { success: true, message: "User successfully updated!" };
    }),
});

export type AppRouter = typeof appRouter;
