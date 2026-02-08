# Step 2: Deploy Backend to Railway

This guide walks you through deploying the Harmonia backend server to Railway.app with all required environment variables.

---

## Prerequisites

- Completed Step 1 (have your 3 Stripe Price IDs ready)
- GitHub account
- Your code pushed to GitHub repository

---

## Step 2.1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** in top-right
3. Select **"Login with GitHub"**
4. Authorize Railway to access your GitHub account

---

## Step 2.2: Create New Project

1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. If prompted, click **"Configure GitHub App"** and grant access to your repositories
4. Search for and select your **`harmonia_healing_app`** repository
5. Click **"Deploy Now"**

Railway will start deploying automatically, but it will fail because environment variables are missing. That's expected - we'll add them next.

---

## Step 2.3: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"** button
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will provision a PostgreSQL database
5. The `DATABASE_URL` environment variable will be automatically added to your service

---

## Step 2.4: Configure Environment Variables

1. In Railway dashboard, click on your **service** (should be named after your repo)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add each of these:

### Required Variables

```bash
NODE_ENV=production
```

```bash
STRIPE_RESTRICTED_KEY=rk_test_51SnmsTFozjrVx2iiQGujk1ZfzsvculwrrPF4YLD2syeZSIPghvFdb1JfpcWYbADIuShnU7OJLDF8dyT6xy1Ve4od00fV5eSTxZ
```

```bash
STRIPE_PRICE_PREMIUM=price_xxxxxxxxxxxxxxxxxxxxx
```
*(Replace with your actual Price ID from Step 1)*

```bash
STRIPE_PRICE_ULTIMATE=price_xxxxxxxxxxxxxxxxxxxxx
```
*(Replace with your actual Price ID from Step 1)*

```bash
STRIPE_PRICE_LIFETIME=price_xxxxxxxxxxxxxxxxxxxxx
```
*(Replace with your actual Price ID from Step 1)*

**Note**: We'll add `STRIPE_WEBHOOK_SECRET` in Step 3 after creating the webhook endpoint.

---

## Step 2.5: Verify Build Settings

1. Go to **"Settings"** tab
2. Scroll to **"Build"** section
3. Verify these settings:

**Build Command**:
```bash
pnpm install && pnpm build
```

**Start Command**:
```bash
pnpm start
```

**Root Directory**: `/` (leave empty or set to root)

Railway should auto-detect these from your `package.json`, but verify they're correct.

---

## Step 2.6: Deploy

1. Railway will automatically redeploy after you add environment variables
2. If not, click **"Deploy"** button manually
3. Watch the build logs in the **"Deployments"** tab
4. Wait for deployment to complete (usually 2-3 minutes)

You'll see logs like:
```
Installing dependencies...
Building server...
Starting server...
Server listening on port 3000
```

---

## Step 2.7: Get Your Deployment URL

1. Once deployed, go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** button
4. Railway will give you a public URL like: `https://harmonia-healing-app-production-xxxx.up.railway.app`
5. **Copy this URL** - you'll need it for Step 3 (webhook setup)

---

## Step 2.8: Run Database Migration

After first successful deployment, run the database migration:

1. In Railway dashboard, go to your service
2. Click on the **"..."** menu (three dots)
3. Select **"Run Command"**
4. Enter: `pnpm db:push`
5. Click **"Run"**
6. Wait for migration to complete

Alternatively, you can temporarily change the start command:
1. Go to **Settings** → **Deploy** → **Custom Start Command**
2. Change to: `pnpm db:push && pnpm start`
3. Redeploy
4. After migration completes, change back to: `pnpm start`

---

## Step 2.9: Test Your Deployment

### Test Health Endpoint

Open your browser or use curl:

```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-01-11T..."}
```

### Test Pricing Tiers Endpoint

```bash
curl https://your-app.railway.app/api/trpc/payment.getPricingTiers
```

Expected response (formatted):
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
          "priceId": "price_xxx...",
          "features": ["Unlimited sessions", "All tracks", "Advanced playback", "Offline mode"]
        },
        "ultimate": {
          "name": "Ultimate",
          "price": 1999,
          "priceId": "price_xxx...",
          "features": ["Everything in Premium", "Priority support", "Early access to new features"]
        },
        "lifetime": {
          "name": "Lifetime",
          "price": 4999,
          "priceId": "price_xxx...",
          "features": ["Everything in Ultimate", "Lifetime access", "No recurring fees"]
        }
      }
    }
  }
}
```

If you see your Price IDs in the response, **deployment is successful!** ✅

---

## Step 2.10: Update Mobile App API URL

Now that your backend is deployed, update the mobile app to use the Railway URL:

1. Open `${PROJECT_ROOT}/lib/trpc.ts`
2. Find the `url` constant
3. Replace with your Railway URL:

```typescript
const url = __DEV__
  ? "http://localhost:3000/api/trpc"
  : "https://your-app.railway.app/api/trpc"; // Replace with your Railway URL
```

4. Save the file
5. Rebuild your mobile app

---

## Troubleshooting

### Build Failed
- Check Railway logs for specific error
- Verify all dependencies are in `package.json`
- Ensure `pnpm-lock.yaml` is committed to Git

### Database Connection Error
- Verify PostgreSQL database is added to project
- Check `DATABASE_URL` is in environment variables
- Run database migration (`pnpm db:push`)

### 502 Bad Gateway
- Server might still be starting (wait 1-2 minutes)
- Check logs for startup errors
- Verify `PORT` is not hardcoded (Railway assigns it dynamically)

### Environment Variables Not Working
- After adding variables, Railway must redeploy
- Click "Deploy" button manually if auto-deploy didn't trigger
- Check variables are in correct service (not database)

---

## Next Step

✅ **You're done with Step 2!**

Proceed to **Step 3: Configure Stripe Webhook** (see STEP_3_WEBHOOK_SETUP.md)

---

## Quick Reference

- Railway Dashboard: https://railway.app/dashboard
- Your deployment URL: `https://your-app.railway.app` (replace with actual)
- Railway Docs: https://docs.railway.app
- Support: https://discord.gg/railway
