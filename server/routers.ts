import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { createCheckoutSession, PRICING_TIERS } from "./stripe";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Payment and subscription management
  payment: router({
    // Get user's current subscription
    getSubscription: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserSubscription(ctx.user.id);
    }),

    // Get all user subscriptions
    getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserSubscriptions(ctx.user.id);
    }),

    // Get pricing tiers
    getPricingTiers: publicProcedure.query(() => {
      return PRICING_TIERS;
    }),

    // Create checkout session
    createCheckout: protectedProcedure
      .input(
        z.object({
          tier: z.enum(["premium", "ultimate", "lifetime"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { tier } = input;
        const userId = ctx.user.id;

        // Check if user already has an active subscription
        const existing = await db.getUserSubscription(userId);
        if (existing && existing.tier !== "free") {
          throw new Error("You already have an active subscription");
        }

        // Create Stripe checkout session
        const session = await createCheckoutSession({
          tier,
          userId,
          successUrl: `${process.env.APP_URL || "exp://localhost:8081"}/payment-success`,
          cancelUrl: `${process.env.APP_URL || "exp://localhost:8081"}/payment-cancel`,
        });

        // Create pending subscription in database
        await db.createSubscription({
          userId,
          tier,
          status: "pending",
        });

        return {
          sessionId: session.sessionId,
          url: session.url,
        };
      }),

    // Cancel subscription
    cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
      const subscription = await db.getUserSubscription(ctx.user.id);
      if (!subscription) {
        throw new Error("No active subscription found");
      }

      await db.cancelUserSubscription(subscription.id);

      return { success: true };
    }),
  }),

  // Custom Presets (Premium Feature)
  presets: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserPresets(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          category: z.string().optional(),
          settings: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Check if user is premium
        const sub = await db.getUserSubscription(ctx.user.id);
        if (!sub || sub.tier === "free") {
          throw new Error("Custom presets are a premium feature");
        }

        return db.createPreset({
          userId: ctx.user.id,
          ...input,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deletePreset(input.id, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
