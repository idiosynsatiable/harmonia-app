import type { Express, Request, Response } from "express";
import { stripe, constructWebhookEvent } from "./stripe";
import * as db from "./db";

export function registerWebhookRoutes(app: Express) {
  // Stripe webhook endpoint
  // Note: This must use express.raw() middleware to verify signature
  app.post(
    "/api/webhooks/stripe",
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"];

      if (!sig || typeof sig !== "string") {
        res.status(400).send("Webhook Error: Missing stripe-signature");
        return;
      }

      let event;

      try {
        // Use the raw body for signature verification
        event = constructWebhookEvent(req.body, sig);
      } catch (err: any) {
        console.error(`[Webhook] Signature verification failed: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      console.log(`[Webhook] Received event: ${event.type}`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as any;
            const userId = parseInt(session.metadata.userId);
            const tier = session.metadata.tier;
            const stripeSubscriptionId = session.subscription as string;
            const stripeCustomerId = session.customer as string;

            console.log(`[Webhook] Checkout completed for user ${userId}, tier ${tier}`);

            // Update subscription in database
            const existingSub = await db.getUserSubscription(userId);
            if (existingSub) {
              await db.updateSubscription(existingSub.id, {
                status: "active",
                stripeSubscriptionId,
                stripeCustomerId,
                tier,
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
            const subscription = event.data.object as any;
            const stripeSubscriptionId = subscription.id;
            const status = subscription.status === "active" ? "active" : "past_due";

            console.log(`[Webhook] Subscription updated: ${stripeSubscriptionId}, status: ${status}`);

            await db.updateSubscriptionByStripeId(stripeSubscriptionId, {
              status,
            });
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as any;
            const stripeSubscriptionId = subscription.id;

            console.log(`[Webhook] Subscription deleted: ${stripeSubscriptionId}`);

            await db.updateSubscriptionByStripeId(stripeSubscriptionId, {
              status: "canceled",
              canceledAt: new Date(),
            });
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as any;
            const stripeSubscriptionId = invoice.subscription as string;

            console.log(`[Webhook] Payment failed for subscription: ${stripeSubscriptionId}`);

            await db.updateSubscriptionByStripeId(stripeSubscriptionId, {
              status: "past_due",
            });
            break;
          }
        }

        res.json({ received: true });
      } catch (err: any) {
        console.error(`[Webhook] Error processing event ${event.type}:`, err);
        res.status(500).send("Internal Server Error");
      }
    }
  );
}
