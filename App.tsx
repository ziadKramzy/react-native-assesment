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

export default function App() {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Buy a pack of coffee',
      time: '10:30 - 11:00',
      completed: true,
      category: 'personal',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      title: 'Add new partners',
      time: '11:30 - 13:00',
      completed: false,
      category: 'work',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '3',
      title: 'Add new partners',
      time: '13:00 - 14:00',
      completed: false,
      category: 'work',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '4',
      title: 'Meeting on work',
      time: '14:00',
      completed: false,
      category: 'work',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '5',
      title: 'Team Football',
      time: '20:00',
      completed: false,
      category: 'sport',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '6',
      title: 'New project',
      time: '21:00',
      completed: false,
      category: 'work',
      date: new Date().toISOString().split('T')[0]
    }
  ]);

  // State to track the currently selected date
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentView, setCurrentView] = useState<'tasks' | 'create'>('tasks');

  // Load tasks from storage on component mount and initialize notifications
  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await Storage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        try {
          setTasks(JSON.parse(storedTasks));
        } catch (e) {
          console.error('Failed to parse stored tasks', e);
        }
      }
    };
    
    const initNotifications = async () => {
      await initializeNotifications();
    };
    
    loadTasks();
    initNotifications();
  }, []);

  // Save tasks to storage whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      await Storage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    };
    saveTasks();
  }, [tasks]);

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
                    type === 'warning' ? 'Task Deleted' : 
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
      id: Date.now().toString(),
      createdAt: Date.now(),
      date: selectedDate, // Associate task with the currently selected date
    };
    setTasks([...tasks, newTask]);
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
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, completed: newCompletedStatus } : t
      ));
      
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
      setTasks(tasks.filter(t => t.id !== id));
      showNotification(`Task "${task.title}" deleted successfully`, 'warning');
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
