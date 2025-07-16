import { chatSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";
import { chats } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const chatRouter = createTRPCRouter({
  user: protectedProcedure
    .input(z.object({ account_id: z.number() }))
    .query(async (opts) => {
      const [userChat] = await db
        .select()
        .from(chats)
        .where(
          and(
            eq(chats.user_id, Number(opts.ctx.session.user.id)),
            eq(chats.account_id, opts.input.account_id)
          )
        );

      return {
        success: true,
        message: "Chat successfully fetched!",
        data: userChat,
      };
    }),
  update: protectedProcedure
    .input(chatSchema.extend({ id: z.number() }))
    .mutation(async (opts) => {
      const [updatedChat] = await db
        .update(chats)
        .set({ ...opts.input })
        .where(eq(chats.id, opts.input.id))
        .returning();

      return {
        success: true,
        message: "Chat successfully updated!",
        data: updatedChat,
      };
    }),
});
