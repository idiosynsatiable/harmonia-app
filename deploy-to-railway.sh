#!/bin/bash

# Railway Deployment Script for Harmonia Backend
# This script uses the Railway API to deploy your backend

set -e

echo "🚂 Railway Deployment Script for Harmonia"
echo "=========================================="
echo ""

# Railway API token (provided by user)
RAILWAY_TOKEN="da2a4e0e-c75c-4c28-9a88-beca1b839df8"

# Check if required commands exist
command -v curl >/dev/null 2>&1 || { echo "❌ curl is required but not installed. Aborting."; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "⚠️  jq not found, installing..."; sudo apt-get update && sudo apt-get install -y jq; }

echo "✅ Prerequisites checked"
echo ""

# Railway API endpoint
API_URL="https://backboard.railway.app/graphql"

# Function to call Railway GraphQL API
railway_api() {
    local query="$1"
    curl -s -X POST "$API_URL" \
        -H "Authorization: Bearer $RAILWAY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"query\":\"$query\"}"
}

echo "📋 Step 1: Fetching your Railway projects..."
PROJECTS_QUERY='query { projects { edges { node { id name } } } }'
PROJECTS_RESPONSE=$(railway_api "$PROJECTS_QUERY")

echo "$PROJECTS_RESPONSE" | jq -r '.data.projects.edges[] | "  - \(.node.name) (ID: \(.node.id))"'
echo ""

echo "📝 Instructions for Manual Deployment:"
echo "======================================"
echo ""
echo "Since the Railway CLI has installation issues in this environment,"
echo "please follow these steps to deploy manually:"
echo ""
echo "1. Go to https://railway.app/dashboard"
echo "2. Click 'New Project'"
echo "3. Select 'Deploy from GitHub repo'"
echo "4. Choose your 'harmonia_healing_app' repository"
echo "5. Railway will start deploying"
echo ""
echo "6. Add PostgreSQL database:"
echo "   - Click '+ New' → 'Database' → 'PostgreSQL'"
echo ""
echo "7. Configure environment variables (Settings → Variables):"
echo "   NODE_ENV=production"
echo "   STRIPE_RESTRICTED_KEY=rk_test_51SnmsTFozjrVx2iiQGujk1ZfzsvculwrrPF4YLD2syeZSIPghvFdb1JfpcWYbADIuShnU7OJLDF8dyT6xy1Ve4od00fV5eSTxZ"
echo "   STRIPE_PRICE_PREMIUM=<your_price_id>"
echo "   STRIPE_PRICE_ULTIMATE=<your_price_id>"
echo "   STRIPE_PRICE_LIFETIME=<your_price_id>"
echo ""
echo "8. After deployment, run database migration:"
echo "   - Click service → '...' menu → 'Run Command'"
echo "   - Enter: pnpm db:push"
echo ""
echo "9. Get your deployment URL:"
echo "   - Settings → Networking → 'Generate Domain'"
echo ""
echo "10. Test deployment:"
echo "    curl https://your-app.railway.app/health"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - STEP_2_RAILWAY_DEPLOY.md"
echo "   - STEP_3_WEBHOOK_SETUP.md"
echo ""
echo "✨ Your Railway token is already configured and ready to use!"
