# Railway Deployment Guide

This guide details how to deploy the Harmonia API server to Railway.

## 1. Prerequisites
- A Railway account.
- A connected GitHub repository.
- A database service (Postgres or MySQL) running on Railway.

## 2. Configuration

### Environment Variables
Ensure the following variables are set in the Railway Dashboard for your service:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `production` |
| `PORT` | Set to `3000` (Railway usually auto-assigns this) |
| `APP_ORIGIN` | Your production app URL (e.g., `https://harmonia-app.up.railway.app`) |
| `DATABASE_URL` | Injected from your DB service |
| `STRIPE_SECRET_KEY` | Your Stripe Live Secret Key |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe Live Webhook Secret |
| `STRIPE_PRICE_PREMIUM` | Live Price ID for Premium |
| `STRIPE_PRICE_ULTIMATE` | Live Price ID for Ultimate |
| `STRIPE_PRICE_LIFETIME` | Live Price ID for Lifetime |

### Build Settings
Railway should automatically detect the `package.json` and use the following:
- **Build Command:** `pnpm build`
- **Start Command:** `pnpm start`

## 3. Deployment Steps

1. **Connect Repo:** In Railway, click **New Project** > **Deploy from GitHub repo**.
2. **Link Database:** Ensure your API service is in the same project as your Database. Railway will automatically provide the `DATABASE_URL`.
3. **Set Variables:** Copy values from `.env.railway.example` to the Railway **Variables** tab.
4. **Deploy:** Railway will trigger a build and deploy.

## 4. Verification

### Health Check
Visit `https://your-app-name.up.railway.app/api/health`. You should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "env": "production"
}
```

### Stripe Webhook Verification
1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks).
2. Add an endpoint: `https://your-app-name.up.railway.app/api/billing/webhook`.
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
4. Copy the **Signing Secret** and update `STRIPE_WEBHOOK_SECRET` in Railway.
