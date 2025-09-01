# Task Manager App

A modern, feature-rich Task Manager application built with React Native and Expo. This app allows users to manage their daily tasks with an intuitive interface, categorization, and date-based organization.

## Features

### Core Functionality
- **Add Task**: Create new tasks with custom titles, time slots, and categories
- **Mark Task as Complete**: Toggle task completion status with visual checkboxes
- **Delete Task**: Remove tasks with confirmation dialog to prevent accidental deletions
- **Task List**: View all tasks organized by date with clear visual distinction between complete and incomplete tasks

### Enhanced Features
- **Date Navigation**: Browse tasks across different dates with an interactive calendar
- **Task Categories**: Organize tasks by category (Work, Personal, Sport, Ideas, Food, Music, Others) with custom icons
- **Persistent Storage**: Tasks are automatically saved and restored between app sessions
- **Cross-Platform**: Works on iOS, Android, and Web
- **Smooth Animations**: Enhanced user experience with React Native Reanimated
- **Rich Notifications**: Multi-layered notification system with:
  - In-app toast notifications with type-specific colors and icons
  - System notifications on mobile devices
  - Haptic feedback for tactile user experience
  - Auto-dismissing notifications with smooth animations
- **Visual Feedback**: Immediate feedback for all user interactions

## Technology Stack

### Core Dependencies
- **React Native**: 0.79.6 - Cross-platform mobile development framework
- **Expo**: ~53.0.22 - Development platform and runtime for React Native
- **React**: 19.0.0 - UI library for building user interfaces
- **TypeScript**: ~5.8.3 - Type-safe JavaScript development

### UI & Animation Libraries
- **react-native-reanimated**: ^4.1.0 - High-performance animations and gestures
- **react-native-svg**: ^15.12.1 - SVG support for React Native
- **@expo/vector-icons**: Built-in icon library (Ionicons)

### Notification & Feedback Libraries
- **expo-notifications**: System notifications and push notification support
- **expo-haptics**: Tactile feedback for enhanced user experience on mobile devices

### Storage
- **Custom Storage Utility**: Cross-platform storage abstraction
  - Uses `localStorage` on web
  - Uses `@react-native-async-storage/async-storage` on mobile (optional dependency)

## Setup Instructions

### Prerequisites
- **Node.js** (version 16 or later) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)
- **Git** for cloning the repository

### Quick Start (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/ziadKramzy/react-native-assesment.git
   cd react-native-assesment
   ```

2. **Run the setup**
   
   **Automated setup (recommended):**
   ```bash
   npm run setup
   ```
   
   **Script-based setup:**
   - **macOS/Linux:** `./setup.sh`
   - **Windows:** `setup.bat`
   
   **Manual installation:**
   ```bash
   npm run install:complete
   npm run fix:versions
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   or
   ```bash
   npm run dev
   ```

### Alternative Setup (Manual)

If the quick start doesn't work, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/ziadKramzy/react-native-assesment.git
   cd react-native-assesment
   ```

2. **Install dependencies step by step**
   ```bash
   npm install
   npx expo install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

### Running on Different Platforms

Once the development server is running:

- **Web Browser**: Press `w` in the terminal or run `npm run web`
- **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
- **Android Emulator**: Press `a` in the terminal or run `npm run android`
- **Physical Device**: 
  1. Install [Expo Go](https://expo.dev/client) from App Store/Google Play
  2. Scan the QR code displayed in the terminal

### Troubleshooting

**If you get "expo: command not found":**
```bash
# Use npx instead
npx expo start
```

**If you get "expo: command not found":**
```bash
# Use npx instead of global expo
npx expo start
```

**If you get dependency version warnings:**
```bash
# Fix package versions automatically
npm run fix:versions
# OR run the complete setup
npm run setup
```

**If you get dependency errors:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm run setup
```

**If you see Reanimated plugin warnings:**
- These are usually harmless and the app should still work
- The babel.config.js has been configured correctly for Reanimated 3.x

**If notifications don't work on mobile:**
- Make sure you allow notification permissions when prompted
- Restart the Expo Go app if needed

**If the app won't start after cloning:**
```bash
# Complete setup from scratch
npm run setup
npm start
```

### Additional Setup for Mobile Storage (Optional)

For enhanced mobile storage functionality, you can install the AsyncStorage package:

```bash
npx expo install @react-native-async-storage/async-storage
```

*Note: The app will work without this package, but mobile storage will be limited.*

## Project Structure

```
├── App.tsx                 # Main application component
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── babel.config.js        # Babel configuration
├── components/
│   ├── TaskList.tsx       # Main task list view with date navigation
│   ├── CreateTaskModal.tsx # Task creation modal with category selection
│   ├── TaskItem.tsx       # Individual task item component
│   ├── ThemedText.tsx     # Themed text component
│   └── ThemedView.tsx     # Themed view component
├── utils/
│   └── storage.ts         # Cross-platform storage utility
└── assets/
    ├── icon.png           # App icon
    ├── splash.png         # Splash screen
    ├── adaptive-icon.png  # Android adaptive icon
    └── favicon.png        # Web favicon
```

## Usage Guide

### Adding a New Task
1. Tap the "Add New" button in the header or the floating action button
2. Enter a task title and time
3. Select a category from the available options:
   - **Idea**: For brainstorming and creative tasks
   - **Food**: For meal planning and cooking tasks
   - **Work**: For professional and business tasks
   - **Sport**: For fitness and exercise activities
   - **Music**: For music-related activities
   - **Others**: For miscellaneous tasks
4. Tap "Create Task" to add the task to your list

### Managing Tasks
- **Complete a Task**: Tap the checkbox next to any task to mark it as complete
- **Delete a Task**: Tap the red trash icon and confirm deletion
- **Navigate Dates**: Use the date picker to view tasks for different days
- **Quick Navigation**: Tap "Today" to jump back to the current date

### Visual Indicators
- ✅ **Completed tasks** appear with a filled checkbox and strikethrough text
- ⭕ **Incomplete tasks** appear with an empty checkbox and normal text
- 🗓️ **Selected date** is highlighted in the date navigator
- 📱 **Category icons** help identify task types at a glance

### Notification System
- 🎉 **Task Completion**: Green success notification with checkmark icon and success haptic
- 🗑️ **Task Deletion**: Orange warning notification with warning icon and warning haptic
- ➕ **Task Creation**: Green success notification with checkmark icon
- 🔄 **Task Status Change**: Blue info notification with info icon and light haptic
- 📱 **System Notifications**: Native notifications on mobile devices
- 🎚️ **Auto-dismiss**: All notifications automatically disappear after 3 seconds

## State Management

The app uses React's built-in state management with the following approach:

- **Local Component State**: Tasks are managed in the main App component using `useState`
- **Props Drilling**: State and handlers are passed down to child components
- **Persistent Storage**: Tasks are automatically saved to device storage and restored on app launch
- **Real-time Updates**: All changes are immediately reflected in the UI

## Development Notes

### Code Organization
- Components are modular and reusable
- TypeScript interfaces ensure type safety
- Consistent styling with a cohesive design system
- Cross-platform compatibility considerations

### Performance Optimizations
- Efficient re-rendering with proper key props
- Smooth animations with React Native Reanimated
- Optimized date calculations with useMemo
- Lazy loading of storage utilities

## Contributing

When contributing to this project:

1. Follow the existing code style and TypeScript conventions
2. Test on multiple platforms (iOS, Android, Web)
3. Ensure animations and interactions feel smooth
4. Update this README if adding new features
5. Maintain backwards compatibility

## License

This project is private and for educational/demonstration purposes.

---

**Built with ❤️ using React Native and Expo**