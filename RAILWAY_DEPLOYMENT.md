# Railway Deployment Guide - Harmonia Backend

This guide walks you through deploying the Harmonia backend server to Railway.app.

---

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub account (for connecting your repository)
- Stripe account with restricted API key
- PostgreSQL database (Railway provides this automatically)

---

## Step 1: Prepare Your Repository

The backend server is already configured in this project at `/server/`. Ensure your code is pushed to GitHub:

```bash
cd /home/ubuntu/harmonia_healing_app
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

---

## Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app) and log in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `harmonia_healing_app` repository
5. Railway will detect the Node.js project automatically

---

## Step 3: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will provision a PostgreSQL instance
4. The `DATABASE_URL` environment variable will be automatically added

---

## Step 4: Configure Environment Variables

In Railway project settings → **Variables**, add these environment variables:

### Required Variables

```bash
# Node Environment
NODE_ENV=production

# Database (automatically provided by Railway)
DATABASE_URL=postgresql://... (auto-generated)

# Stripe API Keys (TEST MODE)
STRIPE_RESTRICTED_KEY=rk_test_51SnmsTFozjrVx2iiQGujk1ZfzsvculwrrPF4YLD2syeZSIPghvFdb1JfpcWYbADIuShnU7OJLDF8dyT6xy1Ve4od00fV5eSTxZ

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_PREMIUM=price_xxx  # $9.99/month
STRIPE_PRICE_ULTIMATE=price_xxx # $19.99/month
STRIPE_PRICE_LIFETIME=price_xxx # $49.99 one-time

# Stripe Webhook Secret (get from Stripe Dashboard after setting up webhook)
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Server Port (Railway auto-assigns, but we specify default)
PORT=3000
```

### How to Get Stripe Price IDs

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Create 3 products:
   - **Premium**: $9.99/month recurring
   - **Ultimate**: $19.99/month recurring
   - **Lifetime**: $49.99 one-time payment
3. Copy each Price ID (starts with `price_`) and add to Railway variables

### How to Get Stripe Webhook Secret

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Enter your Railway URL: `https://your-app.railway.app/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`) and add to Railway

---

## Step 5: Configure Build Settings

Railway should auto-detect the build configuration, but verify these settings:

### Build Command
```bash
pnpm install && pnpm build
```

### Start Command
```bash
pnpm start
```

### Root Directory
```
/
```

---

## Step 6: Deploy

1. Railway will automatically deploy when you push to GitHub
2. Monitor the build logs in Railway dashboard
3. Once deployed, you'll get a public URL: `https://your-app.railway.app`

---

## Step 7: Run Database Migration

After first deployment, run the database migration:

1. In Railway dashboard, go to your service
2. Click **"Settings"** → **"Deploy"** → **"Custom Start Command"**
3. Temporarily change start command to: `pnpm db:push && pnpm start`
4. Redeploy
5. After migration completes, change start command back to: `pnpm start`

---

## Step 8: Update Mobile App API URL

Update the mobile app to point to your Railway backend:

1. Open `/home/ubuntu/harmonia_healing_app/lib/trpc.ts`
2. Replace the API URL with your Railway URL:

```typescript
const url = __DEV__
  ? "http://localhost:3000/api/trpc"
  : "https://your-app.railway.app/api/trpc";
```

3. Rebuild the mobile app

---

## Step 9: Test the Deployment

### Test Health Endpoint
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-01-10T..."}
```

### Test tRPC Endpoint
```bash
curl https://your-app.railway.app/api/trpc/payment.getPricingTiers
```

Expected response:
```json
{
  "result": {
    "data": {
      "free": {...},
      "premium": {...},
      "ultimate": {...},
      "lifetime": {...}
    }
  }
}
```

---

## Troubleshooting

### Build Fails
- Check Railway build logs for errors
- Verify all dependencies are in `package.json`
- Ensure `pnpm` is used (Railway auto-detects from `pnpm-lock.yaml`)

### Database Connection Issues
- Verify `DATABASE_URL` is set in Railway variables
- Check database migration ran successfully
- Review server logs for connection errors

### Stripe Webhook Not Working
- Verify webhook URL matches Railway deployment URL
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Test webhook in Stripe Dashboard → Webhooks → Send test event

### Server Not Starting
- Check `PORT` environment variable
- Verify build command completed successfully
- Review Railway logs for startup errors

---

## Production Checklist

Before going live with real payments:

- [ ] Switch from Stripe TEST mode to LIVE mode
- [ ] Update `STRIPE_RESTRICTED_KEY` to live key (starts with `rk_live_`)
- [ ] Create live Stripe products and update `STRIPE_PRICE_*` variables
- [ ] Update webhook endpoint to use live mode
- [ ] Test payment flow end-to-end with real card
- [ ] Set up monitoring and alerts in Railway
- [ ] Configure custom domain (optional)
- [ ] Enable Railway auto-scaling (optional)

---

## Monitoring & Logs

### View Logs
Railway dashboard → Your service → **"Logs"** tab

### Monitor Performance
Railway dashboard → Your service → **"Metrics"** tab

### Set Up Alerts
Railway dashboard → Project settings → **"Notifications"**

---

## Estimated Costs

Railway pricing (as of 2026):
- **Free tier**: $5 credit/month (sufficient for testing)
- **Pro plan**: $20/month (includes $20 usage credit)
- **PostgreSQL**: ~$5-10/month (based on usage)
- **Bandwidth**: ~$0.10/GB

**Estimated monthly cost for production**: $25-35/month

---

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Stripe Docs: https://stripe.com/docs
- Harmonia Issues: Dall.whitt@gmail.com

---

## Quick Deploy Commands

```bash
# Build locally to test
pnpm build

# Start production server locally
pnpm start

# Run database migration
pnpm db:push

# Deploy to Railway (auto-deploys on git push)
git push origin main
```

---

**Your backend will be live at**: `https://your-app.railway.app` 🚀
