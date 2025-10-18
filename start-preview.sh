#!/bin/bash

# Budget Glass - Expo Preview Startup Script
echo "💎 Starting Budget Glass Expo Preview..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the Expo directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the Expo development server
echo "🚀 Starting Expo development server..."
echo ""
echo "📱 Available options:"
echo "   • Press 'i' to open iOS simulator"
echo "   • Press 'a' to open Android emulator" 
echo "   • Press 'w' to open in web browser"
echo "   • Scan QR code with Expo Go app on your phone"
echo ""
echo "🌐 For remote preview, run: npm run preview"
echo ""

npm start
