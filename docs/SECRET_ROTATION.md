# Secret Rotation Guide

This guide provides steps to rotate compromised or expired secrets for the Harmonia app.

## 1. Stripe Secret Key
If `STRIPE_SECRET_KEY` is leaked:
1. Go to [Stripe Dashboard > Developers > API Keys](https://dashboard.stripe.com/apikeys).
2. Click **Roll Key** for the Secret Key.
3. Choose the expiration window (e.g., "Immediately").
4. Copy the new key and update your Railway Environment Variables.
5. Redeploy the server.

## 2. Stripe Webhook Secret
If `STRIPE_WEBHOOK_SECRET` is leaked:
1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks).
2. Select the endpoint for your application.
3. Click **Regenerate Secret** in the Signing Secret section.
4. Copy the new secret and update your Railway Environment Variables.
5. Redeploy the server.

## 3. Database Credentials
If `DATABASE_URL` is leaked:
1. Go to your Railway Dashboard.
2. Select your Database service.
3. Go to **Settings > Data Management**.
4. Click **Reset Password**.
5. Railway will automatically update the `DATABASE_URL` in linked services.
6. Verify the application restarts correctly.

## 4. Expo Public Keys
`EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` is public by design, but if you rotate your Stripe Secret Key, ensure you also update the Publishable Key in your client-side environment if you switched Stripe accounts.
