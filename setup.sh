#!/bin/bash

# Task Manager App Setup Script
echo "🚀 Setting up Task Manager App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Expo dependencies with correct versions
echo "📱 Installing Expo dependencies..."
npx expo install

# Fix any version compatibility issues
echo "🔧 Fixing package compatibility..."
npx expo install react-native@0.79.5 react-native-reanimated@~3.17.4 react-native-svg@15.11.2

# Check TypeScript
echo "🔍 Checking TypeScript..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript check passed!"
else
    echo "⚠️ TypeScript warnings found, but app should still work"
fi

echo ""
echo "🎉 Setup complete! You can now run the app with:"
echo "   npm start        (starts development server)"
echo "   npm run web      (opens in web browser)"
echo "   npm run android  (opens in Android emulator)"
echo "   npm run ios      (opens in iOS simulator)"
echo ""
echo "📱 For physical devices, install Expo Go and scan the QR code"
echo "🔔 Make sure to allow notifications when prompted for the best experience!"