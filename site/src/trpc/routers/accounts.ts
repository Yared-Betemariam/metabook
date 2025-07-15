import { accountSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

export const accountRouter = createTRPCRouter({
  create: protectedProcedure.input(accountSchema).mutation(async (opts) => {
    const [newAccount] = await db
      .insert(accounts)
      .values({ ...opts.input, user_id: Number(opts.ctx.session.user.id) })
      .returning();

    return {
      success: true,
      message: "Account successfully created!",
      data: newAccount,
    };
  }),
  user: protectedProcedure.query(async (opts) => {
    const user_accounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.user_id, Number(opts.ctx.session.user.id)));

    return {
      success: true,
      message: "Accounts successfully fetched!",
      data: user_accounts,
    };
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (opts) => {
      await db.delete(accounts).where(eq(accounts.id, opts.input.id));

      return {
        success: true,
        message: "Account successfully deleted!",
      };
    }),
  edit: protectedProcedure
    .input(accountSchema.extend({ id: z.number() }))
    .mutation(async (opts) => {
      const [updatedAccount] = await db
        .update(accounts)
        .set({ ...opts.input })
        .where(eq(accounts.id, opts.input.id))
        .returning();

      return {
        success: true,
        message: "Account successfully updated!",
        data: updatedAccount,
      };
    }),
});

export type AppRouter = typeof accountRouter;
