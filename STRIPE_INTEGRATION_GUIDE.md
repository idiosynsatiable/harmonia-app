# Harmonia - Stripe Payment Integration Guide

## Overview

This guide provides complete instructions for integrating Stripe payments into the Harmonia app for subscriptions, one-time purchases, and in-app purchases.

---

## Phase 1: Stripe Account Setup

### 1. Create Stripe Account

1. Go to https://stripe.com
2. Click "Start now" and create an account
3. Complete business verification
4. Enable test mode for development

### 2. Get API Keys

**Dashboard → Developers → API keys**

- **Publishable key** (starts with `pk_`): Used in mobile app
- **Secret key** (starts with `sk_`): Used in backend server

**Important:** Never expose secret keys in mobile app code!

### 3. Create Products & Prices

**Dashboard → Products → Add Product**

Create these products:

#### Subscription Products

| Product Name | Price ID | Amount | Interval |
|--------------|----------|--------|----------|
| Premium Monthly | `price_premium_monthly` | $9.99 | month |
| Premium Annual | `price_premium_annual` | $79.99 | year |
| Ultimate Monthly | `price_ultimate_monthly` | $19.99 | month |
| Ultimate Annual | `price_ultimate_annual` | $149.99 | year |

#### One-Time Products

| Product Name | Price ID | Amount |
|--------------|----------|--------|
| Lifetime Unlock | `price_lifetime` | $49.99 |
| Gamma Wave Pack | `price_gamma_pack` | $2.99 |
| Isochronic Tones | `price_isochronic` | $3.99 |
| OM Chanting | `price_om_chanting` | $4.99 |
| Noise Color Pack | `price_noise_pack` | $2.99 |
| Preset Bundle | `price_preset_bundle` | $1.99 |
| Security Add-on | `price_security_addon` | $9.99 |
| Remove Ads | `price_remove_ads` | $4.99 |

---

## Phase 2: Mobile App Integration

### 1. Install Dependencies

```bash
cd harmonia_healing_app
npm install @stripe/stripe-react-native
```

### 2. Configure Environment Variables

Create `.env`:

```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
EXPO_PUBLIC_API_URL=https://your-backend-api.com
```

### 3. Update `app.config.ts`

```typescript
export default {
  // ... existing config
  extra: {
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
};
```

### 4. Wrap App with Stripe Provider

Update `app/_layout.tsx`:

```typescript
import { StripeProviderWrapper } from '@/lib/stripe-provider';

export default function RootLayout() {
  return (
    <StripeProviderWrapper>
      {/* existing layout */}
    </StripeProviderWrapper>
  );
}
```

### 5. Implement Payment Flow

The payment flow is already implemented in:
- `/lib/stripe-provider.tsx` - Context and logic
- `/app/(tabs)/pricing.tsx` - UI and user interaction

---

## Phase 3: Backend API Setup

### 1. Install Stripe SDK

```bash
npm install stripe
```

### 2. Create Stripe Client

`server/lib/stripe.ts`:

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default stripe;
```

### 3. Create Payment Intent Endpoint

`server/api/create-payment-intent.ts`:

```typescript
import stripe from '../lib/stripe';

export async function createPaymentIntent(amount: number, currency: string = 'usd') {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
}
```

### 4. Create Subscription Endpoint

`server/api/create-subscription.ts`:

```typescript
import stripe from '../lib/stripe';

export async function createSubscription(
  customerId: string,
  priceId: string,
  trialDays: number = 7
) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    trial_period_days: trialDays,
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription;
}
```

### 5. Create Customer Endpoint

`server/api/create-customer.ts`:

```typescript
import stripe from '../lib/stripe';

export async function createCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  });

  return customer;
}
```

### 6. Webhook Handler

`server/api/webhooks/stripe.ts`:

```typescript
import stripe from '../../lib/stripe';
import { Request, Response } from 'express';

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}

async function handleSubscriptionCreated(subscription: any) {
  // Update database with new subscription
  console.log('Subscription created:', subscription.id);
}

async function handleSubscriptionUpdated(subscription: any) {
  // Update database with subscription changes
  console.log('Subscription updated:', subscription.id);
}

async function handleSubscriptionDeleted(subscription: any) {
  // Mark subscription as cancelled in database
  console.log('Subscription deleted:', subscription.id);
}

async function handlePaymentSucceeded(invoice: any) {
  // Send receipt, update subscription status
  console.log('Payment succeeded:', invoice.id);
}

async function handlePaymentFailed(invoice: any) {
  // Send payment failure notification
  console.log('Payment failed:', invoice.id);
}
```

---

## Phase 4: Database Schema

### Subscription Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  tier VARCHAR(50) NOT NULL, -- 'free', 'premium_monthly', etc.
  status VARCHAR(50) NOT NULL, -- 'active', 'cancelled', 'past_due'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
```

### Purchases Table

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  stripe_payment_intent_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(100) NOT NULL, -- 'gamma_pack', 'isochronic', etc.
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50) NOT NULL, -- 'succeeded', 'failed', 'refunded'
  purchased_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_purchases_user_id ON purchases(user_id);
```

---

## Phase 5: Mobile App Payment Flow

### Complete Payment Flow Implementation

Update `/lib/stripe-provider.tsx`:

```typescript
import { useStripe as useStripeNative, useConfirmPayment } from '@stripe/stripe-react-native';
import axios from 'axios';

// Inside StripeProviderWrapper component:

const { initPaymentSheet, presentPaymentSheet } = useStripeNative();
const { confirmPayment } = useConfirmPayment();

const subscribe = async (planId: string): Promise<boolean> => {
  try {
    // 1. Create customer (if needed)
    const { data: customer } = await axios.post(`${API_URL}/api/create-customer`, {
      email: user.email,
      name: user.name,
    });

    // 2. Create subscription
    const { data: subscription } = await axios.post(`${API_URL}/api/create-subscription`, {
      customerId: customer.id,
      priceId: PRICING_PLANS.find(p => p.id === planId)?.stripePriceId,
      trialDays: 7,
    });

    // 3. Initialize payment sheet
    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: 'Harmonia',
      customerId: customer.id,
      customerEphemeralKeySecret: subscription.ephemeralKey,
      paymentIntentClientSecret: subscription.latest_invoice.payment_intent.client_secret,
      allowsDelayedPaymentMethods: true,
    });

    if (initError) {
      console.error('Init error:', initError);
      return false;
    }

    // 4. Present payment sheet
    const { error: presentError } = await presentPaymentSheet();

    if (presentError) {
      console.error('Present error:', presentError);
      return false;
    }

    // 5. Update local state
    const newSubscription: SubscriptionStatus = {
      tier: planId as SubscriptionTier,
      isActive: true,
      expiresAt: new Date(subscription.current_period_end * 1000),
      isTrial: true,
      trialEndsAt: new Date(subscription.trial_end * 1000),
    };

    await AsyncStorage.setItem('subscription_status', JSON.stringify(newSubscription));
    setSubscription(newSubscription);

    return true;
  } catch (error) {
    console.error('Subscription failed:', error);
    return false;
  }
};

const purchase = async (itemId: string): Promise<boolean> => {
  try {
    const item = IN_APP_PURCHASES.find(i => i.id === itemId);
    if (!item) return false;

    // 1. Create payment intent
    const { data } = await axios.post(`${API_URL}/api/create-payment-intent`, {
      amount: item.price,
      currency: 'usd',
    });

    // 2. Confirm payment
    const { error, paymentIntent } = await confirmPayment(data.clientSecret, {
      paymentMethodType: 'Card',
    });

    if (error) {
      console.error('Payment error:', error);
      return false;
    }

    if (paymentIntent.status === 'Succeeded') {
      // 3. Update local state
      const updated = [...purchasedItems, itemId];
      await AsyncStorage.setItem('purchased_items', JSON.stringify(updated));
      setPurchasedItems(updated);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Purchase failed:', error);
    return false;
  }
};
```

---

## Phase 6: Testing

### Test Mode

1. Use test API keys (starts with `pk_test_` and `sk_test_`)
2. Use test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0025 0000 3155`

### Test Checklist

- [ ] Subscription creation
- [ ] One-time purchase
- [ ] Trial period activation
- [ ] Subscription renewal
- [ ] Subscription cancellation
- [ ] Payment failure handling
- [ ] Refund processing
- [ ] Webhook delivery
- [ ] Feature unlocking
- [ ] Restore purchases

---

## Phase 7: Production Deployment

### 1. Switch to Live Mode

- Replace test keys with live keys
- Update environment variables
- Test with real card (small amount)

### 2. Configure Webhooks

**Dashboard → Developers → Webhooks**

Add endpoint: `https://your-api.com/api/webhooks/stripe`

Select events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 3. Enable Payment Methods

**Dashboard → Settings → Payment methods**

Enable:
- Cards (Visa, Mastercard, Amex)
- Apple Pay
- Google Pay
- Link

### 4. Set Up Billing Portal

**Dashboard → Settings → Customer portal**

Enable customers to:
- Update payment methods
- View invoices
- Cancel subscriptions
- Update billing info

---

## Phase 8: Google Play Store Integration

### 1. Alternative: Google Play Billing

For Play Store compliance, also integrate Google Play In-App Billing:

```bash
npm install react-native-iap
```

### 2. Dual Integration Strategy

- Use Stripe for website subscriptions
- Use Google Play Billing for in-app subscriptions
- Sync subscription status across platforms

### 3. Revenue Share

- Google Play: 15% fee (first $1M), 30% after
- Stripe: 2.9% + $0.30 per transaction

**Recommendation:** Offer both options, let users choose.

---

## Security Best Practices

### 1. Never Expose Secret Keys

- Store in environment variables
- Never commit to Git
- Use different keys for dev/prod

### 2. Validate Webhooks

Always verify webhook signatures:

```typescript
const event = stripe.webhooks.constructEvent(
  req.body,
  sig,
  webhookSecret
);
```

### 3. Server-Side Validation

- Never trust client-side subscription status
- Always validate with Stripe API
- Check subscription status on every request

### 4. PCI Compliance

- Never store card details
- Use Stripe Elements/SDK
- Let Stripe handle sensitive data

---

## Monitoring & Analytics

### 1. Stripe Dashboard

Monitor:
- Revenue
- Subscriptions
- Churn rate
- Failed payments
- Refunds

### 2. Custom Analytics

Track:
- Conversion rate (free → paid)
- Trial conversion rate
- LTV (Lifetime Value)
- CAC (Customer Acquisition Cost)
- ARPU (Average Revenue Per User)

### 3. Alerts

Set up alerts for:
- Failed payments
- Subscription cancellations
- Unusual activity
- Refund requests

---

## Support & Resources

- **Stripe Documentation**: https://stripe.com/docs
- **React Native SDK**: https://stripe.com/docs/stripe-react-native
- **API Reference**: https://stripe.com/docs/api
- **Webhooks Guide**: https://stripe.com/docs/webhooks
- **Testing**: https://stripe.com/docs/testing

---

## Next Steps

1. Create Stripe account
2. Set up products and prices
3. Implement backend API endpoints
4. Update mobile app with real API calls
5. Test payment flows
6. Configure webhooks
7. Deploy to production
8. Monitor and optimize

---

**Harmonia is now ready for monetization!** 🚀💰
