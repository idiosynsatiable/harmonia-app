# Step 1: Create Stripe Products & Get Price IDs

This guide walks you through creating the 3 pricing tiers in Stripe Dashboard and obtaining the Price IDs needed for Railway deployment.

---

## Prerequisites

- Stripe account (sign up at [stripe.com](https://stripe.com) if you don't have one)
- Currently in **TEST mode** (toggle in top-right of Stripe Dashboard)

---

## Step 1.1: Access Stripe Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Ensure you're in **TEST mode** (toggle should show "Test mode" in top-right)
3. Click **"+ Add product"** button

---

## Step 1.2: Create Premium Tier ($9.99/month)

### Product Information
1. **Name**: `Harmonia Premium`
2. **Description**: `Unlimited audio sessions with advanced playback features`
3. **Image**: (optional - you can upload the Harmonia logo later)

### Pricing
1. **Pricing model**: Select **"Standard pricing"**
2. **Price**: Enter `9.99`
3. **Currency**: Select **USD**
4. **Billing period**: Select **"Monthly"**
5. **Recurring**: Ensure this is checked ✓

### Additional Options
- **Trial period**: (optional) Enter `7` days if you want to offer a free trial
- **Usage is metered**: Leave unchecked

### Save
1. Click **"Save product"**
2. **IMPORTANT**: Copy the **Price ID** (starts with `price_`)
   - Example: `price_1QRsTUFozjrVx2iiXYZ123abc`
3. Save this Price ID - you'll need it for Railway

---

## Step 1.3: Create Ultimate Tier ($19.99/month)

### Product Information
1. Click **"+ Add product"** again
2. **Name**: `Harmonia Ultimate`
3. **Description**: `Everything in Premium plus priority support and early access`

### Pricing
1. **Pricing model**: **"Standard pricing"**
2. **Price**: Enter `19.99`
3. **Currency**: **USD**
4. **Billing period**: **"Monthly"**
5. **Recurring**: Checked ✓

### Save
1. Click **"Save product"**
2. **Copy the Price ID** (starts with `price_`)
3. Save this Price ID for Railway

---

## Step 1.4: Create Lifetime Tier ($49.99 one-time)

### Product Information
1. Click **"+ Add product"** again
2. **Name**: `Harmonia Lifetime`
3. **Description**: `Lifetime access with no recurring fees`

### Pricing
1. **Pricing model**: **"Standard pricing"**
2. **Price**: Enter `49.99`
3. **Currency**: **USD**
4. **Billing period**: Select **"One time"** (NOT recurring)
5. **Recurring**: Should be unchecked

### Save
1. Click **"Save product"**
2. **Copy the Price ID** (starts with `price_`)
3. Save this Price ID for Railway

---

## Step 1.5: Verify Your Products

You should now see 3 products in your Stripe Dashboard:

| Product | Price | Type | Price ID |
|---------|-------|------|----------|
| Harmonia Premium | $9.99/month | Recurring | `price_xxx...` |
| Harmonia Ultimate | $19.99/month | Recurring | `price_xxx...` |
| Harmonia Lifetime | $49.99 | One-time | `price_xxx...` |

---

## Step 1.6: Save Your Price IDs

Create a temporary note with your Price IDs in this format:

```bash
STRIPE_PRICE_PREMIUM=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_ULTIMATE=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_LIFETIME=price_xxxxxxxxxxxxxxxxxxxxx
```

**You'll need these for Step 2 (Railway deployment).**

---

## Troubleshooting

### Can't find Price ID?
1. Go to Stripe Dashboard → Products
2. Click on the product name
3. Scroll down to "Pricing" section
4. The Price ID is shown under the price amount

### Wrong billing period?
1. You can't edit the billing period after creation
2. Delete the product and create a new one
3. Make sure to select "Monthly" for Premium/Ultimate, "One time" for Lifetime

### Want to add trial period later?
1. Go to product → Click "Edit" next to the price
2. Scroll to "Trial period"
3. Enter number of days (e.g., 7)
4. Click "Save"

---

## Next Step

✅ **You're done with Step 1!**

Proceed to **Step 2: Deploy to Railway** (see STEP_2_RAILWAY_DEPLOY.md)

---

## Quick Reference

- Stripe Dashboard: https://dashboard.stripe.com/test/products
- Stripe API Keys: https://dashboard.stripe.com/test/apikeys
- Your restricted key: `rk_test_51SnmsTFozjrVx2iiQGujk1ZfzsvculwrrPF4YLD2syeZSIPghvFdb1JfpcWYbADIuShnU7OJLDF8dyT6xy1Ve4od00fV5eSTxZ`
