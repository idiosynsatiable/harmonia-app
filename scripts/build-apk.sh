#!/bin/bash

# Harmonia APK Build Helper Script
# This script prepares the project for an EAS build

echo "🚀 Preparing Harmonia APK Build..."

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
echo "🧪 Running tests..."
pnpm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix them before building."
    exit 1
fi

# 5. Build instructions
echo ""
echo "✅ Project is ready for build!"
echo ""
echo "To build the APK using EAS Build:"
echo "1. Login to Expo: eas login"
echo "2. Configure project: eas build:configure"
echo "3. Build APK: eas build --platform android --profile preview"
echo ""
echo "Note: Ensure your android.package in app.config.ts is unique."
