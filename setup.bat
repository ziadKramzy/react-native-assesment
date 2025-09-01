@echo off
echo 🚀 Setting up Task Manager App...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

:: Install dependencies
echo 📦 Installing dependencies...
call npm install

:: Install Expo dependencies
echo 📱 Installing Expo dependencies...
call npx expo install

:: Fix any version compatibility issues
echo 🔧 Fixing package compatibility...
call npx expo install react-native@0.79.5 react-native-reanimated@~3.17.4 react-native-svg@15.11.2

:: Check TypeScript
echo 🔍 Checking TypeScript...
call npx tsc --noEmit

echo.
echo 🎉 Setup complete! You can now run the app with:
echo    npm start        (starts development server)
echo    npm run web      (opens in web browser)
echo    npm run android  (opens in Android emulator)
echo    npm run ios      (opens in iOS simulator)
echo.
echo 📱 For physical devices, install Expo Go and scan the QR code
echo 🔔 Make sure to allow notifications when prompted for the best experience!
pause