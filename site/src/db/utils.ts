import { TimeRange } from "@/types";
import { sql } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

export function getTimeRangeCondition<T extends PgColumn>(
  column: T,
  timeRange?: TimeRange
) {
  switch (timeRange) {
    case "today":
      return sql`DATE(${column}) = CURRENT_DATE`;
    case "week":
      return sql`DATE_TRUNC('week', ${column}) = DATE_TRUNC('week', CURRENT_DATE)`;
    case "month":
      return sql`DATE_TRUNC('month', ${column}) = DATE_TRUNC('month', CURRENT_DATE)`;
    case "all":
    default:
      return sql`TRUE`; // No filter, fetch all
  }
}
