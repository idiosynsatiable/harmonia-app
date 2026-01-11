# Railway CLI Deployment - Troubleshooting Guide

The token you provided (`da2a4e0e-c75c-4c28-9a88-beca1b839df8`) appears to be a **project token**, but we need a **personal API token** for CLI authentication.

---

## Get the Correct Railway Token

### Step 1: Generate Personal API Token

1. Go to [Railway Dashboard](https://railway.app/account/tokens)
2. Or: Dashboard → Click your profile (top-right) → **"Account Settings"** → **"Tokens"** tab
3. Click **"Create Token"** button
4. Give it a name: `Harmonia CLI Deployment`
5. Copy the token (starts with something like `railway_...` or similar)

**This is different from the project token you provided.**

---

## Option 1: Use Railway CLI (If Token Works)

### Install Railway CLI

```bash
# Download Railway CLI
cd /home/ubuntu/harmonia_healing_app
curl -fsSL cli.new/railway -o railway-install.sh
bash railway-install.sh

# Or try direct binary download
wget https://github.com/railwayapp/cli/releases/latest/download/railway_linux_amd64_v3.tar.gz
tar -xzf railway_linux_amd64_v3.tar.gz
sudo mv railway /usr/local/bin/
railway --version
```

### Authenticate

```bash
# Set token as environment variable
export RAILWAY_TOKEN="your_personal_api_token_here"

# Or login interactively
railway login
```

### Deploy

```bash
cd /home/ubuntu/harmonia_healing_app

# Initialize project
railway init

# Link to existing project or create new
railway link

# Add PostgreSQL
railway add --database postgres

# Set environment variables
railway variables set NODE_ENV=production
railway variables set STRIPE_RESTRICTED_KEY=rk_test_51SnmsTFozjrVx2iiQGujk1ZfzsvculwrrPF4YLD2syeZSIPghvFdb1JfpcWYbADIuShnU7OJLDF8dyT6xy1Ve4od00fV5eSTxZ
railway variables set STRIPE_PRICE_PREMIUM=price_xxx
railway variables set STRIPE_PRICE_ULTIMATE=price_xxx
railway variables set STRIPE_PRICE_LIFETIME=price_xxx

# Deploy
railway up

# Run migration
railway run pnpm db:push
```

---

## Option 2: Use Railway Dashboard (Recommended - Easier)

If CLI continues to have issues, the dashboard method is more reliable:

1. **Go to**: https://railway.app/new
2. **Select**: "Deploy from GitHub repo"
3. **Choose**: `harmonia_healing_app` repository
4. **Add Database**: Click "+ New" → "Database" → "PostgreSQL"
5. **Add Variables**: Settings → Variables → Add all environment variables
6. **Deploy**: Railway auto-deploys on push
7. **Migrate**: Run `pnpm db:push` via dashboard command runner

**See `STEP_2_RAILWAY_DEPLOY.md` for detailed dashboard instructions.**

---

## Option 3: Deploy via Git Push (Alternative)

Railway can auto-deploy from Git pushes:

### Setup

1. Create project in Railway Dashboard
2. Connect GitHub repository
3. Railway will auto-deploy on every push to `main` branch

### Deploy

```bash
cd /home/ubuntu/harmonia_healing_app
git add .
git commit -m "Deploy to Railway"
git push origin main
```

Railway will automatically:
- Detect Node.js project
- Install dependencies (`pnpm install`)
- Build server (`pnpm build`)
- Start server (`pnpm start`)

---

## Troubleshooting

### Token Issues

**Problem**: "Not Found" or "Unauthorized" errors

**Solution**:
1. Verify you're using a **personal API token**, not project token
2. Token should have full permissions
3. Generate new token if needed: https://railway.app/account/tokens

### CLI Installation Issues

**Problem**: CLI won't install or run

**Solution**:
1. Try alternative installation methods above
2. Check system architecture: `uname -m` (should be x86_64)
3. Verify permissions: `chmod +x railway`
4. Use dashboard method instead (more reliable)

### Environment Variables Not Set

**Problem**: Variables not showing in deployment

**Solution**:
1. Set via CLI: `railway variables set KEY=value`
2. Or via dashboard: Settings → Variables
3. Redeploy after adding variables

### Database Connection Failed

**Problem**: Can't connect to PostgreSQL

**Solution**:
1. Ensure PostgreSQL service is added to project
2. `DATABASE_URL` should be auto-set by Railway
3. Check service is running in dashboard
4. Run migration: `railway run pnpm db:push`

---

## What's Your Project Token For?

The token you provided (`da2a4e0e-c75c-4c28-9a88-beca1b839df8`) is likely:
- A **project ID** or **service ID**
- Used for Railway's internal API
- Not for CLI authentication

You need a **personal access token** from Account Settings → Tokens.

---

## Next Steps

1. **Get correct token**: https://railway.app/account/tokens
2. **Try CLI again** with personal token
3. **Or use dashboard**: Much simpler, follow `STEP_2_RAILWAY_DEPLOY.md`

---

## Quick Dashboard Deploy (5 minutes)

If you want to skip CLI entirely:

1. Go to: https://railway.app/new
2. Click: "Deploy from GitHub repo"
3. Select: `harmonia_healing_app`
4. Wait for initial deploy (will fail - expected)
5. Add PostgreSQL: "+ New" → "Database" → "PostgreSQL"
6. Add variables: Copy from `.env.railway.example`
7. Redeploy: Click "Deploy" button
8. Done! Get URL from Settings → Networking

**This is the fastest and most reliable method.**

---

Let me know if you want to:
- A) Get the correct personal API token and retry CLI
- B) Use the dashboard method (recommended)
- C) Try Git-based deployment
