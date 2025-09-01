import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import TaskList from './components/TaskList';
import CreateTaskModal from './components/CreateTaskModal';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import * as Storage from './utils/storage';
import { initializeNotifications, sendLocalNotification, NotificationData, NotificationType } from './utils/notifications';

export interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  category?: string;
  createdAt?: number;
  date?: string; // ISO date string for the day this task belongs to
}

const TASKS_STORAGE_KEY = 'tasks_data';

// Hermes-friendly ID generation
const generateTaskId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `task_${timestamp}_${random}`;
};

// Helper to get current date in YYYY-MM-DD format
const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Buy a pack of coffee',
      time: '10:30 - 11:00',
      completed: true,
      category: 'personal',
      date: getCurrentDate()
    },
    {
      id: '2',
      title: 'Add new partners',
      time: '11:30 - 13:00',
      completed: false,
      category: 'work',
      date: getCurrentDate()
    },
    {
      id: '3',
      title: 'Add new partners',
      time: '13:00 - 14:00',
      completed: false,
      category: 'work',
      date: getCurrentDate()
    },
    {
      id: '4',
      title: 'Meeting on work',
      time: '14:00',
      completed: false,
      category: 'work',
      date: getCurrentDate()
    },
    {
      id: '5',
      title: 'Team Football',
      time: '20:00',
      completed: false,
      category: 'sport',
      date: getCurrentDate()
    },
    {
      id: '6',
      title: 'New project',
      time: '21:00',
      completed: false,
      category: 'work',
      date: getCurrentDate()
    }
  ]);

  // State to track the currently selected date
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentView, setCurrentView] = useState<'tasks' | 'create'>('tasks');
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from storage on component mount and initialize notifications
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await Storage.getItem(TASKS_STORAGE_KEY);
        if (storedTasks && storedTasks.trim()) {
          const parsedTasks = JSON.parse(storedTasks);
          if (Array.isArray(parsedTasks)) {
            setTasks(parsedTasks);
          }
        }
      } catch (error) {
        console.warn('Failed to load tasks:', error);
        // Keep default tasks if loading fails
      } finally {
        setIsLoading(false);
      }
    };
    
    const initNotifications = async () => {
      try {
        await initializeNotifications();
      } catch (error) {
        console.warn('Failed to initialize notifications:', error);
      }
    };
    
    loadTasks();
    initNotifications();
  }, []);

  // Save tasks to storage whenever they change (but not on initial load)
  useEffect(() => {
    if (!isLoading) {
      const saveTasks = async () => {
        try {
          await Storage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
          console.warn('Failed to save tasks:', error);
        }
      };
      saveTasks();
    }
  }, [tasks, isLoading]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter tasks for the selected date
  const getFilteredTasks = () => {
    return tasks.filter(task => task.date === selectedDate);
  };

  // Helper function to show both in-app and system notifications
  const showNotification = async (message: string, type: NotificationType) => {
    try {
      // Show in-app notification
      setNotification({ message, type });
      
      // Show system notification on mobile
      const title = type === 'success' ? 'Task Completed' : 
                    type === 'error' ? 'Task Deleted' : 
                    type === 'info' ? 'Task Updated' : 'Task Manager';
      
      await sendLocalNotification(title, message, type);
    } catch (error) {
      console.warn('Failed to show notification:', error);
      // Fallback to just in-app notification
      setNotification({ message, type });
    }
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: generateTaskId(), // Use Hermes-friendly ID generation
      createdAt: Date.now(),
      date: selectedDate, // Associate task with the currently selected date
    };
    setTasks(prevTasks => [...prevTasks, newTask]); // Use functional update
    setCurrentView('tasks');
    showNotification(`Task "${task.title}" added successfully!`, 'success');
  };

  // Handle date navigation
  const navigateToDate = (date: string) => {
    setSelectedDate(date);
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newCompletedStatus = !task.completed;
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === id ? { ...t, completed: newCompletedStatus } : t
      )); // Use functional update
      
      // Show notification based on completion status
      if (newCompletedStatus) {
        showNotification(`Task "${task.title}" completed!`, 'success');
      } else {
        showNotification(`Task "${task.title}" marked as incomplete`, 'info');
      }
    }
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTasks(prevTasks => prevTasks.filter(t => t.id !== id)); // Use functional update
      showNotification(`Task "${task.title}" deleted successfully`, 'error');
    }
  };

  // Helper function to get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'info':
        return 'information-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  // Helper function to get notification background color based on type
  const getNotificationStyle = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#10B981' }; // Green
      case 'error':
        return { backgroundColor: '#EF4444' }; // Red
      case 'info':
        return { backgroundColor: '#3B82F6' }; // Blue
      case 'warning':
        return { backgroundColor: '#F59E0B' }; // Orange
      default:
        return { backgroundColor: '#5B67F0' }; // Default purple
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Notification Toast */}
      {notification && (
        <Animated.View 
          style={[styles.notification, getNotificationStyle(notification.type)]}
          entering={SlideInUp.duration(400)}
          exiting={FadeOut.duration(300)}
        >
          <View style={styles.notificationContent}>
            <Ionicons 
              name={getNotificationIcon(notification.type)} 
              size={20} 
              color="white" 
              style={styles.notificationIcon}
            />
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
        </Animated.View>
      )}
      {currentView === 'tasks' ? (
        <TaskList 
          tasks={getFilteredTasks()} 
          selectedDate={selectedDate}
          onChangeDate={navigateToDate}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onShowCreate={() => setCurrentView('create')}
        />
      ) : (
        <CreateTaskModal 
          selectedDate={selectedDate}
          onAddTask={addTask}
          onClose={() => setCurrentView('tasks')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  notification: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    marginRight: 8,
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
});