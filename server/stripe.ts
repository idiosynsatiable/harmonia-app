import Stripe from "stripe";
import { ENV } from "./_core/env";

/**
 * Stripe Integration Module
 * Handles checkout sessions, customer portal, and webhook verification.
 */

// Initialize Stripe with secret key from validated ENV
export const stripe = ENV.stripeSecretKey ? new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
}) : null;

if (!stripe) {
  console.warn("⚠️  STRIPE_SECRET_KEY not set - payment features disabled");
}

// Harmonia pricing tiers (in cents)
export const PRICING_TIERS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: ["15-minute sessions", "All 21 tracks", "Basic playback"],
  },
  premium: {
    name: "Premium",
    price: 999, // $9.99
    priceId: ENV.stripePricePremium,
    features: ["Unlimited sessions", "All tracks", "Advanced playback", "Offline mode"],
  },
  ultimate: {
    name: "Ultimate",
    price: 1999, // $19.99
    priceId: ENV.stripePriceUltimate,
    features: ["Everything in Premium", "Priority support", "Early access to new features"],
  },
  lifetime: {
    name: "Lifetime",
    price: 4999, // $49.99
    priceId: ENV.stripePriceLifetime,
    features: ["Everything in Ultimate", "Lifetime access", "No recurring fees"],
  },
} as const;

export type PricingTier = keyof typeof PRICING_TIERS;

/**
 * Create a Stripe checkout session for a pricing tier
 */
export async function createCheckoutSession(params: {
  tier: PricingTier;
  userId: number;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) {
    throw new Error("Stripe not initialized");
  }

  const { tier, userId, customerEmail, successUrl, cancelUrl } = params;
  const tierInfo = PRICING_TIERS[tier];

  if (!tierInfo.priceId) {
    throw new Error(`No price ID configured for tier: ${tier}`);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: tier === "lifetime" ? "payment" : "subscription",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        {
          price: tierInfo.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        tier,
      },
      // Ensure subscription allows for automatic tax if needed
      automatic_tax: { enabled: false },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error: any) {
    console.error("[Stripe] Checkout session creation failed:", error);
    throw new Error(`Payment initialization failed: ${error.message}`);
  }
}

/**
 * Create a Stripe Customer Portal session
 */
export async function createPortalSession(params: {
  stripeCustomerId: string;
  returnUrl: string;
}) {
  if (!stripe) {
    throw new Error("Stripe not initialized");
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: params.stripeCustomerId,
      return_url: params.returnUrl,
    });

    return {
      url: session.url,
    };
  } catch (error: any) {
    console.error("[Stripe] Portal session creation failed:", error);
    throw new Error(`Portal initialization failed: ${error.message}`);
  }
}

/**
 * Verify webhook signature and parse event
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
): Stripe.Event {
  if (!stripe) {
    throw new Error("Stripe not initialized");
  }

  if (!ENV.stripeWebhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET not set");
  }

  return stripe.webhooks.constructEvent(payload, signature, ENV.stripeWebhookSecret);
}
