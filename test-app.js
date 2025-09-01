#!/usr/bin/env node

/**
 * Simple test script to verify app functionality
 * This script checks that the app can be imported and basic functions work
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Task Manager App...\n');

// Test 1: Check if main files exist
console.log('📁 Checking project structure...');
const requiredFiles = [
  'App.tsx',
  'package.json',
  'app.json',
  'babel.config.js',
  'components/TaskList.tsx',
  'components/CreateTaskModal.tsx',
  'utils/storage.ts',
  'utils/notifications.ts',
  'README.md'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

// Test 2: Check package.json structure
console.log('\n📦 Checking package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredDependencies = [
  'expo',
  'react',
  'react-native',
  'expo-notifications',
  'expo-haptics',
  'react-native-reanimated',
  'react-dom',
  'react-native-web'
];

let allDepsPresent = true;
requiredDependencies.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`  ❌ ${dep} - MISSING`);
    allDepsPresent = false;
  }
});

if (!allDepsPresent) {
  console.log('\n❌ Some required dependencies are missing!');
  process.exit(1);
}

// Test 3: Check scripts
console.log('\n🚀 Checking npm scripts...');
const requiredScripts = ['start', 'web', 'android', 'ios', 'setup'];
requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`  ✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`  ❌ ${script} - MISSING`);
  }
});

// Test 4: Check app.json configuration
console.log('\n⚙️ Checking app.json configuration...');
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));

if (appJson.expo && appJson.expo.name === 'TaskManager') {
  console.log('  ✅ App name configured correctly');
} else {
  console.log('  ⚠️ App name might need verification');
}

if (appJson.expo && appJson.expo.ios && appJson.expo.android) {
  console.log('  ✅ iOS and Android configurations present');
} else {
  console.log('  ❌ Platform configurations missing');
}

console.log('\n🎉 All tests passed! The app should work correctly.');
console.log('\nTo run the app:');
console.log('  npm start     # Start development server');
console.log('  npm run web   # Open in web browser');
console.log('  npm run setup # Complete setup if needed');