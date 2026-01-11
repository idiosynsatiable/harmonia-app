# Step 3: Configure Stripe Webhook

This guide walks you through setting up the Stripe webhook endpoint so your backend can receive payment events.

---

## Prerequisites

- Completed Step 2 (backend deployed to Railway)
- Have your Railway deployment URL ready (e.g., `https://your-app.railway.app`)

---

## What is a Webhook?

A webhook allows Stripe to notify your backend when payment events occur (subscription created, payment succeeded, subscription canceled, etc.). This is essential for keeping your database in sync with Stripe.

---

## Step 3.1: Access Stripe Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
2. Ensure you're in **TEST mode** (toggle in top-right)
3. Click **"+ Add endpoint"** button

---

## Step 3.2: Configure Webhook Endpoint

### Endpoint URL

Enter your Railway URL + webhook path:

```
https://your-app.railway.app/api/stripe/webhook
```

**Replace `your-app.railway.app` with your actual Railway domain from Step 2.**

Example:
```
https://harmonia-healing-app-production-a1b2c3.up.railway.app/api/stripe/webhook
```

### Description (optional)

```
Harmonia payment events
```

---

## Step 3.3: Select Events to Listen For

Click **"Select events"** and choose these events:

### Checkout Events
- ✓ `checkout.session.completed`
- ✓ `checkout.session.expired`

### Customer Events
- ✓ `customer.subscription.created`
- ✓ `customer.subscription.updated`
- ✓ `customer.subscription.deleted`

### Invoice Events
- ✓ `invoice.payment_succeeded`
- ✓ `invoice.payment_failed`

### Payment Intent Events (optional but recommended)
- ✓ `payment_intent.succeeded`
- ✓ `payment_intent.payment_failed`

Click **"Add events"** when done.

---

## Step 3.4: Create Endpoint

1. Review your settings:
   - Endpoint URL: `https://your-app.railway.app/api/stripe/webhook`
   - Events: 8-10 events selected
2. Click **"Add endpoint"**

---

## Step 3.5: Get Webhook Signing Secret

After creating the endpoint, you'll see the webhook details page.

1. Look for **"Signing secret"** section
2. Click **"Reveal"** to show the secret
3. Copy the signing secret (starts with `whsec_`)
   - Example: `whsec_abc123xyz789...`

**This is critical for security - it verifies webhook requests are from Stripe.**

---

## Step 3.6: Add Webhook Secret to Railway

1. Go back to [Railway Dashboard](https://railway.app/dashboard)
2. Open your Harmonia project
3. Click on your service
4. Go to **"Variables"** tab
5. Click **"+ New Variable"**
6. Add:

**Variable name**:
```
STRIPE_WEBHOOK_SECRET
```

**Value**:
```
whsec_abc123xyz789...
```
*(Paste your actual signing secret)*

7. Click **"Add"**
8. Railway will automatically redeploy with the new variable

---

## Step 3.7: Test Webhook

### Option 1: Send Test Event from Stripe Dashboard

1. In Stripe Dashboard → Webhooks → Your endpoint
2. Click **"Send test webhook"** button
3. Select event: `checkout.session.completed`
4. Click **"Send test webhook"**
5. Check the response:
   - ✅ **Success (200)**: Webhook is working!
   - ❌ **Error (4xx/5xx)**: See troubleshooting below

### Option 2: Test with Real Checkout

1. Use Stripe test card: `4242 4242 4242 4242`
2. Expiry: Any future date (e.g., `12/34`)
3. CVC: Any 3 digits (e.g., `123`)
4. ZIP: Any 5 digits (e.g., `12345`)
5. Complete a test checkout in your app
6. Check webhook logs in Stripe Dashboard

---

## Step 3.8: Verify Webhook Logs

1. In Stripe Dashboard → Webhooks → Your endpoint
2. Click on the endpoint name
3. Scroll to **"Recent events"** section
4. You should see events with:
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed

Click on any event to see:
- Request details (what Stripe sent)
- Response details (what your server returned)
- Retry attempts (if failed)

---

## Troubleshooting

### Webhook Returns 404 Not Found

**Cause**: Endpoint URL is incorrect or server route doesn't exist.

**Fix**:
1. Verify URL is exactly: `https://your-app.railway.app/api/stripe/webhook`
2. Check Railway logs for incoming requests
3. Ensure backend server is running (check Railway dashboard)

### Webhook Returns 401 Unauthorized

**Cause**: Webhook signature verification failed.

**Fix**:
1. Verify `STRIPE_WEBHOOK_SECRET` is correct in Railway
2. Make sure you copied the entire secret (starts with `whsec_`)
3. Redeploy Railway after adding the secret

### Webhook Returns 500 Internal Server Error

**Cause**: Server error processing the webhook.

**Fix**:
1. Check Railway logs for error details
2. Verify database connection is working
3. Ensure all environment variables are set
4. Check server code for bugs in webhook handler

### No Events Showing Up

**Cause**: Events not selected or webhook not triggered.

**Fix**:
1. Verify you selected the correct events in Step 3.3
2. Send a test event from Stripe Dashboard
3. Try completing a test checkout to trigger real events

### Webhook Secret Not Working

**Cause**: Wrong secret or not added to Railway.

**Fix**:
1. Go to Stripe Dashboard → Webhooks → Your endpoint
2. Click "Reveal" under "Signing secret"
3. Copy the ENTIRE secret (including `whsec_` prefix)
4. Update `STRIPE_WEBHOOK_SECRET` in Railway
5. Wait for Railway to redeploy

---

## Step 3.9: Monitor Webhook Health

### Check Webhook Status
1. Stripe Dashboard → Webhooks → Your endpoint
2. Look for **"Endpoint status"**:
   - ✅ **Enabled**: Working correctly
   - ⚠️ **Disabled**: Too many failures (Stripe auto-disables)

### Re-enable Disabled Webhook
1. Click **"Enable endpoint"** button
2. Fix the underlying issue first (check logs)
3. Send test event to verify it's working

### Set Up Alerts (Optional)
1. Stripe Dashboard → Settings → Notifications
2. Enable **"Webhook failures"** notification
3. You'll get email alerts if webhooks start failing

---

## Next Step

✅ **You're done with Step 3!**

Your backend is now fully deployed and integrated with Stripe. You can:
- Test payments with Stripe test cards
- Monitor webhook events in Stripe Dashboard
- View subscription data in Railway database
- Build and deploy your mobile app

---

## Quick Reference

### Test Card Numbers
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Webhook Events Reference
- `checkout.session.completed`: User completed checkout
- `customer.subscription.created`: New subscription started
- `customer.subscription.updated`: Subscription changed (upgrade/downgrade)
- `customer.subscription.deleted`: Subscription canceled
- `invoice.payment_succeeded`: Recurring payment succeeded
- `invoice.payment_failed`: Recurring payment failed

### Important URLs
- Stripe Webhooks: https://dashboard.stripe.com/test/webhooks
- Railway Dashboard: https://railway.app/dashboard
- Your webhook endpoint: `https://your-app.railway.app/api/stripe/webhook`
- Stripe Testing Guide: https://stripe.com/docs/testing

---

## Production Checklist

Before switching to live mode:

- [ ] Test webhook with all event types
- [ ] Verify subscription creation works
- [ ] Test subscription cancellation
- [ ] Test payment failure handling
- [ ] Monitor webhook logs for errors
- [ ] Set up webhook failure alerts
- [ ] Document webhook endpoint URL
- [ ] Create live mode webhook (when ready for production)

---

**🎉 Congratulations!** Your Harmonia backend is fully deployed and integrated with Stripe payments!
