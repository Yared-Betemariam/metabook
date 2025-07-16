import { db } from "@/db";
import { users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "../init";
import { eq } from "drizzle-orm";
import { profileSchema } from "@/schemas";
import { accountRouter } from "./accounts";
import { tradesRouter } from "./trades";

export const appRouter = createTRPCRouter({
  accounts: accountRouter,
  trades: tradesRouter,
  updateProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async (opts) => {
      await db
        .update(users)
        .set(opts.input)
        .where(eq(users.email, opts.ctx.session.user.email));

      return { success: true, message: "User successfully updated!" };
    }),
});

export type AppRouter = typeof appRouter;
