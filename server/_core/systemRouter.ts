import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import * as db from "../db";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      }),
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      }),
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),
  
  getStats: adminProcedure.query(async () => {
    const dbInstance = await db.getDb();
    if (!dbInstance) throw new Error("Database not available");

    try {
      const stats = await db.getSystemStats();
      return stats;
    } catch (error) {
      console.error("Failed to fetch system stats:", error);
      // Fallback to mock data if DB query fails or table doesn't exist yet
      return {
        totalUsers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        conversionRate: 0,
      };
    }
  }),
});
