import { db } from "@/db";
import { accounts, trades } from "@/db/schema";
import { getTimeRangeCondition } from "@/db/utils";
import { tradeSchema } from "@/schemas";
import { TimeRange, timeRangeList } from "@/types";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { monthsList } from "@/lib/utils";

export const tradesRouter = createTRPCRouter({
  create: protectedProcedure.input(tradeSchema).mutation(async (opts) => {
    const [newTrade] = await db
      .insert(trades)
      .values({
        ...opts.input,
        user_id: Number(opts.ctx.session.user.id),
        pnl: opts.input.pnl ? Number(opts.input.pnl) : undefined,
      })
      .returning();

    if (opts.input.pnl) {
      const pnlChange = parseFloat(opts.input.pnl);

      await db
        .update(accounts)
        .set({
          balance: sql`${accounts.balance} + ${pnlChange}`,
        })
        .where(eq(accounts.id, opts.input.account_id));
    }

    return {
      success: true,
      message: "Trade successfully created!",
      data: newTrade,
    };
  }),
  user: protectedProcedure
    .input(
      z.object({
        account_id: z.number(),
        timeRange: z.enum(timeRangeList),
      })
    )
    .query(async (opts) => {
      const condition = getTimeRangeCondition(
        trades.date,
        opts.input.timeRange as TimeRange
      );

      const user_trades = await db
        .select()
        .from(trades)
        .where(
          and(
            eq(trades.user_id, Number(opts.ctx.session.user.id)),
            eq(trades.account_id, opts.input.account_id),
            condition
          )
        );

      return {
        success: true,
        message: "Trades successfully fetched!",
        data: user_trades,
      };
    }),
  calendar: protectedProcedure
    .input(
      z.object({
        account_id: z.number(),
        timeString: z.string(),
      })
    )
    .query(async (opts) => {
      const [monthStr, yearStr] = opts.input.timeString.split("-");
      const month = monthsList.indexOf(monthStr.toLowerCase()) + 1;
      const year = Number(yearStr);

      if (month < 1 || month > 12 || isNaN(year)) {
        throw new Error("Invalid timeString format. Expected mmm-yyyy.");
      }

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const user_trades = await db
        .select()
        .from(trades)
        .where(
          and(
            eq(trades.user_id, Number(opts.ctx.session.user.id)),
            eq(trades.account_id, opts.input.account_id),
            gt(trades.date, startDate),
            lt(trades.date, endDate)
          )
        );

      return {
        success: true,
        message: "Trades successfully fetched!",
        data: user_trades,
      };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (opts) => {
      await db.delete(trades).where(eq(trades.id, opts.input.id));

      return {
        success: true,
        message: "Trade successfully deleted!",
      };
    }),
  edit: protectedProcedure
    .input(
      tradeSchema.extend({ id: z.number(), prevPnl: z.string().optional() })
    )
    .mutation(async (opts) => {
      const { prevPnl, ...updateData } = opts.input;

      const [updatedTrade] = await db
        .update(trades)
        .set({
          ...updateData,
          pnl: opts.input.pnl ? Number(opts.input.pnl) : undefined,
        })
        .where(eq(trades.id, opts.input.id))
        .returning();

      if (prevPnl && opts.input.pnl) {
        const change = parseFloat(opts.input.pnl) - parseFloat(prevPnl);

        await db
          .update(accounts)
          .set({
            balance: sql`${accounts.balance} + ${change}`,
          })
          .where(eq(accounts.id, updateData.account_id));
      }

      return {
        success: true,
        message: "Trade successfully updated!",
        data: updatedTrade,
      };
    }),
});
