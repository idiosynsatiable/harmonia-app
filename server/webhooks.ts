import type { Express, Request, Response } from "express";
import { constructWebhookEvent } from "./stripe";
import * as db from "./db";
import type Stripe from "stripe";

/**
 * Stripe Webhook Handler
 * Processes asynchronous events from Stripe to keep database in sync.
 */

export function registerWebhookRoutes(app: Express) {
  app.post(
    "/api/billing/webhook",
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"];

      if (!sig || typeof sig !== "string") {
        console.error("[Webhook Error] Missing stripe-signature");
        res.status(400).send("Webhook Error: Missing stripe-signature");
        return;
      }

      let event: Stripe.Event;

      try {
        // Use the raw body for signature verification
        event = constructWebhookEvent(req.body, sig);
      } catch (err: any) {
        console.error(`[Webhook Error] Signature verification failed: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      console.log(`[Webhook] Processing event: ${event.type} (${event.id})`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId ? parseInt(session.metadata.userId) : null;
            const tier = session.metadata?.tier as any;
            const stripeSubscriptionId = session.subscription as string;
            const stripeCustomerId = session.customer as string;

            if (!userId) {
              console.error("[Webhook Error] No userId in session metadata");
              break;
            }

            console.log(`[Webhook] Checkout completed for user ${userId}, tier ${tier}`);

            // Update or create subscription in database
            const existingSub = await db.getUserSubscription(userId);
            if (existingSub) {
              await db.updateSubscription(existingSub.id, {
                status: "active",
                stripeSubscriptionId,
                stripeCustomerId,
                tier,
                currentPeriodEnd: session.expires_at ? new Date(session.expires_at * 1000) : undefined,
              });
            } else {
              await db.createSubscription({
                userId,
                tier,
                status: "active",
                stripeSubscriptionId,
                stripeCustomerId,
              });
            }
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const stripeSubscriptionId = subscription.id;
            const status = subscription.status === "active" ? "active" : "pending";
            
            console.log(`[Webhook] Subscription updated: ${stripeSubscriptionId}, status: ${status}`);

            await db.updateSubscriptionByStripeId(stripeSubscriptionId, {
              status: status as any,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            });
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const stripeSubscriptionId = subscription.id;

            console.log(`[Webhook] Subscription deleted: ${stripeSubscriptionId}`);

            await db.updateSubscriptionByStripeId(stripeSubscriptionId, {
              status: "canceled",
              canceledAt: new Date(),
            });
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const stripeSubscriptionId = invoice.subscription as string;

            if (stripeSubscriptionId) {
              console.log(`[Webhook] Payment failed for subscription: ${stripeSubscriptionId}`);
              await db.updateSubscriptionByStripeId(stripeSubscriptionId, {
                status: "pending", // Revert to pending or handle as expired
              });
            }
            break;
          }
          
          default:
            console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
      } catch (err: any) {
        console.error(`[Webhook Error] processing event ${event.type}:`, err);
        res.status(500).send("Internal Server Error");
      }
    }
  );
}
