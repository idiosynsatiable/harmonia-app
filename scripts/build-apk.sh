#!/bin/bash

# Harmonia APK Build Helper Script
# This script prepares the project for an EAS build

echo "🚀 Preparing Hardened Harmonia APK Build..."

# 1. Validate environment
if [ ! -f "app.json" ] && [ ! -f "app.config.ts" ]; then
    echo "❌ Error: app.json or app.config.ts not found. Are you in the project root?"
    exit 1
fi

# 2. Check for EAS CLI
if ! command -v eas &> /dev/null; then
    echo "⚠️  EAS CLI not found. Please install it with: npm install -g eas-cli"
fi

# 3. Clean and install dependencies
echo "📦 Installing dependencies..."
pnpm install

# 4. Run tests
echo "🧪 Running tests (158+ tests)..."
pnpm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix them before building."
    exit 1
fi

# 5. Build instructions
echo ""
echo "✅ Project is HARDENED and ready for build!"
echo "--------------------------------------------------"
echo "To generate your downloadable APK, run:"
echo ""
echo "  eas build --platform android --profile preview"
echo ""
echo "This will provide a direct download link to the APK once complete."
echo "The Bundle ID is: space.manus.harmonia_healing_app.t20260104033312"
echo "--------------------------------------------------"
