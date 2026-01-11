# 🚀 Deploy Harmonia to Railway - Ready to Go!

Everything is configured and ready. Just follow these 3 simple steps:

---

## ✅ What's Already Done

- ✅ Backend code written and tested
- ✅ Railway config file created (`railway.toml`)
- ✅ All environment variables pre-configured
- ✅ Stripe Price IDs retrieved and set:
  - Premium: `price_1SoH86FozjrVx2iiJPMVuzKZ` ($9.99/mo)
  - Ultimate: `price_1SoH99FozjrVx2iiScEnkUNz` ($19.99/mo)
  - Lifetime: `price_1SoHABFozjrVx2iinUERwRJ7` ($49.99)
- ✅ Stripe restricted key configured
- ✅ Build and start commands configured

---

## 🎯 3 Steps to Deploy

### Step 1: Push to GitHub (if not already done)

```bash
cd /home/ubuntu/harmonia_healing_app
git add .
git commit -m "Add Railway configuration - ready to deploy"
git push origin main
```

### Step 2: Create Railway Project

1. Go to: **https://railway.app/new**
2. Click: **"Deploy from GitHub repo"**
3. Select: **`harmonia_healing_app`**
4. Railway will automatically:
   - Read `railway.toml` config
   - Install dependencies
   - Build the server
   - Deploy with environment variables

### Step 3: Add PostgreSQL Database

1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically connect it to your service
4. Click on your service → **"..."** menu → **"Run Command"**
5. Enter: `pnpm db:push`
6. Press Enter to run database migration

---

## 🎉 That's It!

Your backend will be live at: `https://your-app.railway.app`

### Get Your URL

1. Railway dashboard → Your service
2. **Settings** → **Networking** → **"Generate Domain"**
3. Copy the URL

### Test Deployment

```bash
# Test health endpoint
curl https://your-app.railway.app/health

# Test pricing tiers
curl https://your-app.railway.app/api/trpc/payment.getPricingTiers
```

You should see your Price IDs in the response!

---

## 📝 Next: Configure Stripe Webhook

After deployment, add webhook endpoint:

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"+ Add endpoint"**
3. URL: `https://your-app.railway.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to Railway:
   - Service → **Variables** → **+ New Variable**
   - Name: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...` (your signing secret)

---

## 🔧 Configuration Files

Railway will automatically read:

- **`railway.toml`** - Build, deploy, and environment config
- **`railway.json`** - Additional Railway settings
- **`package.json`** - Dependencies and scripts

All environment variables are pre-configured in `railway.toml`:
- ✅ NODE_ENV=production
- ✅ STRIPE_RESTRICTED_KEY (your test key)
- ✅ STRIPE_PRICE_PREMIUM
- ✅ STRIPE_PRICE_ULTIMATE
- ✅ STRIPE_PRICE_LIFETIME

---

## 📚 Additional Resources

- **STEP_3_WEBHOOK_SETUP.md** - Detailed webhook configuration
- **STEP_4_TESTING_GUIDE.md** - Comprehensive testing procedures
- **RAILWAY_DEPLOYMENT.md** - Full deployment documentation

---

## ⚡ Quick Summary

1. **Push to GitHub** (if needed)
2. **Railway.app/new** → Deploy from GitHub repo
3. **Add PostgreSQL** → Run `pnpm db:push`
4. **Done!** Get your URL and test

**Total time: ~10 minutes** ⏱️

---

## 🆘 Need Help?

If anything doesn't work:
1. Check Railway logs (Service → Logs tab)
2. Verify PostgreSQL is added and running
3. Ensure `railway.toml` is in the repository root
4. See troubleshooting in `STEP_2_RAILWAY_DEPLOY.md`

---

**Everything is ready to go! Just click deploy! 🚀**
