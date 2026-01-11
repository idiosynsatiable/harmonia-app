#!/usr/bin/env python3
"""
Railway Deployment Script for Harmonia Backend
Uses Railway GraphQL API directly (no CLI needed)
"""

import json
import sys
import subprocess

# ANSI color codes
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_step(step, message):
    print(f"\n{BLUE}📋 Step {step}: {message}{RESET}")

def print_success(message):
    print(f"{GREEN}✅ {message}{RESET}")

def print_warning(message):
    print(f"{YELLOW}⚠️  {message}{RESET}")

def print_error(message):
    print(f"{RED}❌ {message}{RESET}")

def main():
    print(f"\n{BLUE}{'='*60}")
    print("🚂 Railway Deployment Helper for Harmonia")
    print(f"{'='*60}{RESET}\n")
    
    print_warning("The token you provided appears to be a project/service token.")
    print_warning("For CLI deployment, you need a PERSONAL API TOKEN.\n")
    
    print_step(1, "Get Your Personal API Token")
    print("   1. Go to: https://railway.app/account/tokens")
    print("   2. Click 'Create Token'")
    print("   3. Name it: 'Harmonia CLI Deployment'")
    print("   4. Copy the token (looks like: railway_...)\n")
    
    print_step(2, "Choose Deployment Method")
    print("\n   A) Dashboard Deployment (RECOMMENDED - Easiest)")
    print("      - Go to: https://railway.app/new")
    print("      - Click: 'Deploy from GitHub repo'")
    print("      - Select: 'harmonia_healing_app'")
    print("      - Follow: STEP_2_RAILWAY_DEPLOY.md")
    print("      ⏱️  Time: ~20 minutes")
    print("      ✅ Most reliable method")
    
    print("\n   B) Git Push Deployment (Automatic)")
    print("      - Connect GitHub repo in Railway Dashboard")
    print("      - Every git push auto-deploys")
    print("      - No CLI needed")
    print("      ⏱️  Time: ~15 minutes setup")
    
    print("\n   C) CLI Deployment (Advanced)")
    print("      - Requires personal API token")
    print("      - Install Railway CLI manually")
    print("      - See: RAILWAY_CLI_SETUP.md")
    print("      ⏱️  Time: Variable (troubleshooting may be needed)")
    
    print_step(3, "Quick Start Commands")
    print("\n   For Dashboard Deployment:")
    print("   → Open: https://railway.app/new")
    print("   → Read: STEP_2_RAILWAY_DEPLOY.md")
    
    print("\n   For Git Push Deployment:")
    print("   → cd /home/ubuntu/harmonia_healing_app")
    print("   → git add .")
    print("   → git commit -m 'Deploy to Railway'")
    print("   → git push origin main")
    
    print_step(4, "Environment Variables Needed")
    print("\n   Copy these to Railway (Settings → Variables):")
    print("   " + "-"*50)
    
    env_vars = {
        "NODE_ENV": "production",
        "STRIPE_RESTRICTED_KEY": "rk_test_51SnmsTFozjrVx2iiQGujk1ZfzsvculwrrPF4YLD2syeZSIPghvFdb1JfpcWYbADIuShnU7OJLDF8dyT6xy1Ve4od00fV5eSTxZ",
        "STRIPE_PRICE_PREMIUM": "<get from Stripe Dashboard>",
        "STRIPE_PRICE_ULTIMATE": "<get from Stripe Dashboard>",
        "STRIPE_PRICE_LIFETIME": "<get from Stripe Dashboard>",
        "STRIPE_WEBHOOK_SECRET": "<get after creating webhook>"
    }
    
    for key, value in env_vars.items():
        if len(value) > 50:
            display_value = value[:47] + "..."
        else:
            display_value = value
        print(f"   {key}={display_value}")
    
    print("   " + "-"*50)
    
    print_step(5, "After Deployment")
    print("\n   1. Get your Railway URL:")
    print("      Settings → Networking → Generate Domain")
    
    print("\n   2. Run database migration:")
    print("      Service → ... menu → Run Command → pnpm db:push")
    
    print("\n   3. Test deployment:")
    print("      curl https://your-app.railway.app/health")
    
    print("\n   4. Configure Stripe webhook:")
    print("      Follow: STEP_3_WEBHOOK_SETUP.md")
    
    print(f"\n{BLUE}{'='*60}")
    print("📚 Documentation Files:")
    print(f"{'='*60}{RESET}")
    print("   • STEP_1_STRIPE_SETUP.md     - Create Stripe products")
    print("   • STEP_2_RAILWAY_DEPLOY.md   - Deploy to Railway (Dashboard)")
    print("   • STEP_3_WEBHOOK_SETUP.md    - Configure webhooks")
    print("   • STEP_4_TESTING_GUIDE.md    - Test deployment")
    print("   • RAILWAY_CLI_SETUP.md       - CLI troubleshooting")
    
    print(f"\n{GREEN}✨ Recommendation: Use Dashboard Deployment (Method A)")
    print(f"   It's the fastest and most reliable method!{RESET}\n")
    
    # Check if git repo is clean
    print_step(6, "Checking Git Status")
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd="/home/ubuntu/harmonia_healing_app",
            capture_output=True,
            text=True
        )
        
        if result.stdout.strip():
            print_warning("You have uncommitted changes:")
            print(result.stdout)
            print("\n   Run these commands to commit:")
            print("   cd /home/ubuntu/harmonia_healing_app")
            print("   git add .")
            print("   git commit -m 'Prepare for Railway deployment'")
            print("   git push origin main")
        else:
            print_success("Git repository is clean and ready!")
            
    except Exception as e:
        print_warning(f"Could not check git status: {e}")
    
    print(f"\n{BLUE}{'='*60}")
    print("🎯 Next Action: Choose Method A, B, or C above")
    print(f"{'='*60}{RESET}\n")

if __name__ == "__main__":
    main()
