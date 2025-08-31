import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TaskList from './components/TaskList';
import CreateTaskModal from './components/CreateTaskModal';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Storage from './utils/storage';

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
  const [notification, setNotification] = useState<string | null>(null);
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

  // Load tasks from storage on component mount
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
    loadTasks();
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

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: Date.now(),
      date: selectedDate, // Associate task with the currently selected date
    };
    setTasks([...tasks, newTask]);
    setCurrentView('tasks');
    setNotification(`Task "${task.title}" added successfully!`);
  };

  // Handle date navigation
  const navigateToDate = (date: string) => {
    setSelectedDate(date);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Notification Toast */}
      {notification && (
        <Animated.View 
          style={styles.notification}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <Text style={styles.notificationText}>{notification}</Text>
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
    backgroundColor: '#5B67F0',
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
  notificationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
