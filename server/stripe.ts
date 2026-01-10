import Stripe from "stripe";

// Initialize Stripe with restricted key
const stripeKey = process.env.STRIPE_RESTRICTED_KEY || "";
if (!stripeKey) {
  console.warn("⚠️  STRIPE_RESTRICTED_KEY not set - payment features disabled");
}

export const stripe = stripeKey ? new Stripe(stripeKey, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
}) : null;

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
    priceId: process.env.STRIPE_PRICE_PREMIUM,
    features: ["Unlimited sessions", "All tracks", "Advanced playback", "Offline mode"],
  },
  ultimate: {
    name: "Ultimate",
    price: 1999, // $19.99
    priceId: process.env.STRIPE_PRICE_ULTIMATE,
    features: ["Everything in Premium", "Priority support", "Early access to new features"],
  },
  lifetime: {
    name: "Lifetime",
    price: 4999, // $49.99
    priceId: process.env.STRIPE_PRICE_LIFETIME,
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
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) {
    throw new Error("Stripe not initialized");
  }

  const { tier, userId, successUrl, cancelUrl } = params;
  const tierInfo = PRICING_TIERS[tier];

  if (!tierInfo.priceId) {
    throw new Error(`No price ID configured for tier: ${tier}`);
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: tier === "lifetime" ? "payment" : "subscription",
    payment_method_types: ["card"],
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
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
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

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET not set");
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Get customer's active subscriptions
 */
export async function getCustomerSubscriptions(customerId: string) {
  if (!stripe) {
    throw new Error("Stripe not initialized");
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 10,
  });

  return subscriptions.data;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error("Stripe not initialized");
  }

  return stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Get payment intent details
 */
export async function getPaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    throw new Error("Stripe not initialized");
  }

  return stripe.paymentIntents.retrieve(paymentIntentId);
}
