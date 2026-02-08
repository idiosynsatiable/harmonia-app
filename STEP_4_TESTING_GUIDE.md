# Step 4: Testing & Verification Guide

This guide provides comprehensive testing procedures to verify your Harmonia backend deployment is working correctly.

---

## Quick Test Checklist

- [ ] Health endpoint responds
- [ ] Pricing tiers endpoint returns correct data
- [ ] Database connection works
- [ ] Stripe webhook receives events
- [ ] Mobile app connects to backend
- [ ] Test payment flow works end-to-end

---

## Test 1: Health Check

### Purpose
Verify the server is running and accessible.

### Command
```bash
curl https://your-app.railway.app/health
```

### Expected Response
```json
{
  "status": "ok",
  "timestamp": "2026-01-11T00:15:30.123Z"
}
```

### If It Fails
- ❌ Connection refused: Server not running (check Railway logs)
- ❌ 502 Bad Gateway: Server starting or crashed (wait 1-2 minutes, check logs)
- ❌ 404 Not Found: Wrong URL (verify Railway domain)

---

## Test 2: Pricing Tiers Endpoint

### Purpose
Verify Stripe Price IDs are loaded correctly.

### Command
```bash
curl https://your-app.railway.app/api/trpc/payment.getPricingTiers
```

### Expected Response (formatted)
```json
{
  "result": {
    "data": {
      "json": {
        "free": {
          "name": "Free",
          "price": 0,
          "priceId": null,
          "features": ["15-minute sessions", "All 21 tracks", "Basic playback"]
        },
        "premium": {
          "name": "Premium",
          "price": 999,
          "priceId": "price_1QRsTUFozjrVx2ii...",
          "features": ["Unlimited sessions", "All tracks", "Advanced playback", "Offline mode"]
        },
        "ultimate": {
          "name": "Ultimate",
          "price": 1999,
          "priceId": "price_1QRsTUFozjrVx2ii...",
          "features": ["Everything in Premium", "Priority support", "Early access to new features"]
        },
        "lifetime": {
          "name": "Lifetime",
          "price": 4999,
          "priceId": "price_1QRsTUFozjrVx2ii...",
          "features": ["Everything in Ultimate", "Lifetime access", "No recurring fees"]
        }
      }
    }
  }
}
```

### Verify
- ✅ All 4 tiers present (free, premium, ultimate, lifetime)
- ✅ Prices correct (0, 999, 1999, 4999)
- ✅ Premium/Ultimate/Lifetime have real Price IDs (not null)

### If Price IDs are null
- ❌ Environment variables not set correctly
- Fix: Check Railway → Variables → Verify `STRIPE_PRICE_*` variables
- Redeploy after fixing

---

## Test 3: Database Connection

### Purpose
Verify PostgreSQL database is connected and migrations ran.

### Method 1: Check Railway Logs
1. Go to Railway Dashboard → Your service
2. Click **"Logs"** tab
3. Look for database connection messages:
   ```
   ✓ Database connected
   ✓ Migrations applied
   ```

### Method 2: Query Database (Advanced)
1. Railway Dashboard → PostgreSQL service
2. Click **"Data"** tab
3. Run query:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
4. Should see tables: `users`, `subscriptions`, etc.

### If Database Connection Fails
- ❌ Check `DATABASE_URL` is set in Railway variables
- ❌ Verify PostgreSQL service is running
- ❌ Run database migration: `pnpm db:push`

---

## Test 4: Stripe Webhook

### Purpose
Verify webhook endpoint receives and processes Stripe events.

### Test from Stripe Dashboard
1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click on your webhook endpoint
3. Click **"Send test webhook"**
4. Select event: `checkout.session.completed`
5. Click **"Send test webhook"**

### Expected Result
- ✅ Response: **200 OK**
- ✅ Event appears in "Recent events" with green checkmark

### Check Railway Logs
1. Railway Dashboard → Your service → Logs
2. Look for webhook event logs:
   ```
   Received webhook event: checkout.session.completed
   Processing checkout session: cs_test_...
   ```

### If Webhook Fails
- ❌ 404: Wrong URL (verify `/api/stripe/webhook`)
- ❌ 401: Wrong signing secret (check `STRIPE_WEBHOOK_SECRET`)
- ❌ 500: Server error (check Railway logs for details)

---

## Test 5: Mobile App Connection

### Purpose
Verify mobile app can communicate with backend.

### Update Mobile App
1. Open `${PROJECT_ROOT}/lib/trpc.ts`
2. Update API URL:
   ```typescript
   const url = __DEV__
     ? "http://localhost:3000/api/trpc"
     : "https://your-app.railway.app/api/trpc";
   ```
3. Save and rebuild app

### Test in App
1. Open Harmonia app on device/emulator
2. Navigate to account/settings screen
3. App should load pricing tiers from backend
4. Verify tiers show: Free, Premium ($9.99), Ultimate ($19.99), Lifetime ($49.99)

### If App Can't Connect
- ❌ Check Railway URL is correct in `trpc.ts`
- ❌ Verify backend is running (test health endpoint)
- ❌ Check mobile app has internet connection
- ❌ Look for CORS errors in browser console (if testing on web)

---

## Test 6: End-to-End Payment Flow

### Purpose
Test complete payment flow from app to Stripe to webhook.

### Test with Stripe Test Card
1. In Harmonia app, tap **"Upgrade to Premium"**
2. Enter test card details:
   - **Card**: `4242 4242 4242 4242`
   - **Expiry**: `12/34` (any future date)
   - **CVC**: `123` (any 3 digits)
   - **ZIP**: `12345` (any 5 digits)
3. Complete checkout
4. Should redirect back to app with success message

### Verify in Stripe Dashboard
1. Go to [Stripe Payments](https://dashboard.stripe.com/test/payments)
2. Should see new payment with status: **Succeeded**
3. Go to [Stripe Subscriptions](https://dashboard.stripe.com/test/subscriptions)
4. Should see new subscription with status: **Active**

### Verify Webhook Received Event
1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click on your endpoint
3. Check "Recent events" for:
   - `checkout.session.completed` ✅
   - `customer.subscription.created` ✅
   - `invoice.payment_succeeded` ✅

### Verify in Database
1. Railway Dashboard → PostgreSQL → Data
2. Query subscriptions table:
   ```sql
   SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 5;
   ```
3. Should see new subscription record with:
   - `stripeCustomerId`: `cus_...`
   - `stripeSubscriptionId`: `sub_...`
   - `status`: `active`

---

## Test 7: Subscription Cancellation

### Purpose
Test subscription cancellation flow.

### Cancel in Stripe Dashboard
1. Go to [Stripe Subscriptions](https://dashboard.stripe.com/test/subscriptions)
2. Click on the test subscription
3. Click **"Cancel subscription"**
4. Select **"Cancel immediately"**
5. Confirm cancellation

### Verify Webhook Received Event
1. Check webhook endpoint in Stripe Dashboard
2. Should see event: `customer.subscription.deleted` ✅

### Verify in Database
1. Query subscriptions table:
   ```sql
   SELECT * FROM subscriptions WHERE stripe_subscription_id = 'sub_...';
   ```
2. Status should be updated to: `canceled`

---

## Test 8: Failed Payment

### Purpose
Test handling of failed payments.

### Test with Decline Card
1. In app, try to upgrade with card: `4000 0000 0000 0002`
2. Payment should be declined
3. User should see error message

### Verify in Stripe Dashboard
1. Go to [Stripe Payments](https://dashboard.stripe.com/test/payments)
2. Should see payment with status: **Failed**

### Verify Webhook Received Event
1. Check webhook endpoint
2. Should see event: `payment_intent.payment_failed` ✅

---

## Performance Tests

### Response Time Test
```bash
time curl https://your-app.railway.app/health
```

**Expected**: < 500ms

### Load Test (Optional)
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test 100 requests, 10 concurrent
ab -n 100 -c 10 https://your-app.railway.app/health
```

**Expected**: 95%+ success rate

---

## Monitoring & Alerts

### Railway Metrics
1. Railway Dashboard → Your service → **"Metrics"** tab
2. Monitor:
   - CPU usage (should be < 50% normally)
   - Memory usage (should be < 512MB)
   - Request rate
   - Error rate

### Set Up Alerts
1. Railway Dashboard → Project Settings → **"Notifications"**
2. Enable:
   - Deployment failures
   - Service crashes
   - High error rates

### Stripe Monitoring
1. Stripe Dashboard → **"Developers"** → **"Webhooks"**
2. Monitor webhook success rate
3. Set up email alerts for webhook failures

---

## Troubleshooting Common Issues

### Issue: Webhook signature verification failed

**Symptoms**: Webhook returns 401, logs show "Invalid signature"

**Fix**:
1. Get fresh signing secret from Stripe Dashboard
2. Update `STRIPE_WEBHOOK_SECRET` in Railway
3. Redeploy

### Issue: Database query timeout

**Symptoms**: 500 errors, logs show "Connection timeout"

**Fix**:
1. Check PostgreSQL service is running
2. Verify `DATABASE_URL` is correct
3. Restart PostgreSQL service in Railway

### Issue: CORS errors in browser

**Symptoms**: App can't connect, browser console shows CORS error

**Fix**:
1. Check server CORS configuration allows your domain
2. Verify Railway URL is correct in app
3. Test with curl to isolate issue

### Issue: High latency

**Symptoms**: Slow response times (> 1 second)

**Fix**:
1. Check Railway region (should be close to users)
2. Optimize database queries
3. Add caching layer
4. Upgrade Railway plan if needed

---

## Production Readiness Checklist

Before going live:

- [ ] All tests passing
- [ ] Webhook success rate > 95%
- [ ] Response times < 500ms
- [ ] Error rate < 1%
- [ ] Database backups enabled
- [ ] Monitoring alerts configured
- [ ] Load testing completed
- [ ] Security audit done
- [ ] SSL certificate valid
- [ ] Custom domain configured (optional)

---

## Next Steps

✅ **All tests passing?** You're ready to:
1. Build mobile app for production (`eas build`)
2. Submit to app stores (Google Play, Apple App Store)
3. Switch Stripe to live mode when ready for real payments
4. Monitor metrics and user feedback

---

## Support Resources

- Railway Docs: https://docs.railway.app
- Stripe Testing: https://stripe.com/docs/testing
- tRPC Docs: https://trpc.io/docs
- Harmonia Support: Dall.whitt@gmail.com

---

**🎉 Congratulations!** Your backend is fully tested and production-ready!
