import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { createCheckoutSession, createPortalSession, PRICING_TIERS } from "./stripe";
import { ENV } from "./_core/env";

/**
 * Main Application Router
 * Centralizes all tRPC procedures for auth, billing, and app features.
 */

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    
    // Entitlements endpoint (Source of truth for client)
    getEntitlements: protectedProcedure.query(async ({ ctx }) => {
      const sub = await db.getUserSubscription(ctx.user.id);
      return {
        tier: sub?.tier || "free",
        isActive: sub?.status === "active",
        expiresAt: sub?.currentPeriodEnd,
      };
    }),

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
    getSubscription: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserSubscription(ctx.user.id);
    }),

    getPricingTiers: publicProcedure.query(() => {
      return PRICING_TIERS;
    }),

    // Create checkout session with robust error handling
    createCheckout: protectedProcedure
      .input(
        z.object({
          tier: z.enum(["premium", "ultimate", "lifetime"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { tier } = input;
        const userId = ctx.user.id;

        // Prevent duplicate active subscriptions
        const existing = await db.getUserSubscription(userId);
        if (existing && existing.status === "active" && existing.tier !== "free") {
          throw new Error("You already have an active subscription. Manage it via the portal.");
        }

        const successUrl = `${ENV.appOrigin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${ENV.appOrigin}/payment-cancel`;

        const session = await createCheckoutSession({
          tier,
          userId,
          customerEmail: ctx.user.email || undefined,
          successUrl,
          cancelUrl,
        });

        return {
          sessionId: session.sessionId,
          url: session.url,
        };
      }),

    // Create customer portal session
    createPortal: protectedProcedure.mutation(async ({ ctx }) => {
      const sub = await db.getUserSubscription(ctx.user.id);
      
      if (!sub || !sub.stripeCustomerId) {
        throw new Error("No billing history found. Please subscribe first.");
      }

      const portal = await createPortalSession({
        stripeCustomerId: sub.stripeCustomerId,
        returnUrl: `${ENV.appOrigin}/(tabs)/info`,
      });

      return {
        url: portal.url,
      };
    }),
  }),

  // Custom Presets (Server-Side Gated)
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
        // Strict server-side gating
        const sub = await db.getUserSubscription(ctx.user.id);
        if (!sub || sub.status !== "active" || sub.tier === "free") {
          throw new Error("Access Denied: Custom presets require an active Premium subscription.");
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
