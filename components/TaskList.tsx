import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../App';
import Animated, { FadeIn, FadeOut, Layout, SlideInRight, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface TaskListProps {
  tasks: Task[];
  selectedDate: string; // ISO date string (YYYY-MM-DD)
  onChangeDate: (date: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onShowCreate: () => void;
}

export default function TaskList({ 
  tasks, 
  selectedDate, 
  onChangeDate, 
  onToggleTask, 
  onDeleteTask, 
  onShowCreate 
}: TaskListProps) {
  // State to track task being confirmed for deletion
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  
  // Function to show delete confirmation
  const confirmDelete = useCallback((taskId: string, taskTitle: string) => {
    setDeleteTaskId(taskId);
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${taskTitle}"?`,
      [
        {
          text: "Cancel",
          onPress: () => setDeleteTaskId(null),
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            onDeleteTask(taskId);
            setDeleteTaskId(null);
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  }, [onDeleteTask]);
  // Convert selected date to Date object
  const dateObj = useMemo(() => new Date(selectedDate), [selectedDate]);
  
  // Format the date display
  const displayDay = dateObj.getDate();
  const displayMonth = dateObj.toLocaleDateString('en-US', { month: 'short' });
  
  // Generate dates for navigation (5 days backward and forward)
  const dateRange = useMemo(() => {
    const dates = [];
    // Generate previous dates
    for (let i = -5; i <= 5; i++) {
      const date = new Date(dateObj);
      date.setDate(date.getDate() + i);
      
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0 || date.toDateString() === new Date().toDateString()
      });
    }
    return dates;
  }, [selectedDate]);

  // Go to previous day
  const goToPreviousDay = () => {
    const prevDate = new Date(dateObj);
    prevDate.setDate(prevDate.getDate() - 1);
    onChangeDate(prevDate.toISOString().split('T')[0]);
  };

  // Go to next day
  const goToNextDay = () => {
    const nextDate = new Date(dateObj);
    nextDate.setDate(nextDate.getDate() + 1);
    onChangeDate(nextDate.toISOString().split('T')[0]);
  };

  // Go to today
  const goToToday = () => {
    onChangeDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="grid-outline" size={24} color="white" />
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{displayDay} {displayMonth}</Text>
              <Text style={styles.todayText}>
                {selectedDate === new Date().toISOString().split('T')[0] 
                  ? 'Today' 
                  : new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })
                }
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={onShowCreate}
            style={styles.addButton}
          >
            <Ionicons name="add" size={20} color="white" style={styles.addIcon} />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Compact combined date navigator */}
      <View style={styles.compactDateNav}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={goToPreviousDay}
        >
          <Ionicons name="chevron-back" size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.compactDateScroll}
          contentContainerStyle={styles.compactDateScrollContent}
        >
          {dateRange.map((item) => (
            <TouchableOpacity
              key={item.date}
              style={[
                styles.compactDateButton,
                item.date === selectedDate && styles.activeCompactDateButton
              ]}
              onPress={() => onChangeDate(item.date)}
            >
              <Text 
                style={[
                  styles.compactDayLabel,
                  item.date === selectedDate && styles.activeCompactDayLabel
                ]}
              >
                {item.label}
              </Text>
              <Text 
                style={[
                  styles.compactDayNumber,
                  item.date === selectedDate && styles.activeCompactDayNumber
                ]}
              >
                {item.day}
              </Text>
              {item.isToday && <View style={styles.compactTodayIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={goToNextDay}
        >
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.todayButton}
        onPress={goToToday}
      >
        <Text style={styles.todayButtonText}>Today</Text>
      </TouchableOpacity>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList}>
        {tasks.length > 0 ? tasks.map((task, index) => (
          <Animated.View 
            key={task.id} 
            style={styles.taskItem}
            entering={SlideInRight.springify().delay(index * 100)}
            exiting={FadeOut.duration(300)}
            layout={Layout.springify()}
          >
            <Animated.View style={styles.taskRow}>
              <TouchableOpacity 
                onPress={() => onToggleTask(task.id)}
                style={[
                  styles.checkbox,
                  task.completed ? styles.checkboxCompleted : styles.checkboxEmpty
                ]}
              >
                {task.completed && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>
              
              {/* Task content with category icon */}
              <View style={styles.taskContent}>
                <Text style={[
                  styles.taskTitle,
                  task.completed ? styles.taskTitleCompleted : styles.taskTitleActive
                ]}>
                  {task.title}
                </Text>
                
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{task.time}</Text>
                </View>
              </View>
              
              {/* Category icon based on task category */}
              {task.category && (
                <View style={styles.categoryIconContainer}>
                  <Ionicons 
                    name={getCategoryIcon(task.category) as any} 
                    size={20} 
                    color="#5B67F0" 
                  />
                </View>
              )}
              
              {/* Delete button with enhanced confirmation */}
              <TouchableOpacity
                onPress={() => confirmDelete(task.id, task.title)}
                style={styles.deleteButton}
              >
                <View style={styles.deleteButtonInner}>
                  <Ionicons name="trash-outline" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Removed special highlighted task styling as requested */}
          </Animated.View>
        )) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No tasks for this day</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={onShowCreate}
            >
              <Text style={styles.emptyButtonText}>Add a task</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={onShowCreate}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

// Helper function to get the icon name based on the category
const getCategoryIcon = (category: string): string => {
  switch(category) {
    case 'work':
      return 'briefcase-outline';
    case 'personal':
      return 'person-outline';
    case 'sport':
      return 'fitness-outline';
    case 'idea':
      return 'bulb-outline';
    case 'food':
      return 'restaurant-outline';
    case 'music':
      return 'musical-notes-outline';
    case 'others':
      return 'apps-outline';
    default:
      return 'ellipsis-horizontal-outline';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#5B67F0',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    shadowColor: '#5B67F0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  todayText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addIcon: {
    marginRight: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  compactDateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: -8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactDateScroll: {
    flex: 1,
  },
  compactDateScrollContent: {
    alignItems: 'center',
  },
  compactDateButton: {
    width: 55,
    height: 70,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCompactDateButton: {
    backgroundColor: '#5B67F0',
    borderColor: '#5B67F0',
  },
  compactDayLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  activeCompactDayLabel: {
    color: 'white',
  },
  compactDayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  activeCompactDayNumber: {
    color: 'white',
  },
  compactTodayIndicator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FF4C54',
    position: 'absolute',
    bottom: 2,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todayButton: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EEF0FF',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  todayButtonText: {
    color: '#5B67F0',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyButton: {
    marginTop: 16,
    backgroundColor: '#5B67F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  taskItem: {
    marginBottom: 4,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#5B67F0',
    borderColor: '#5B67F0',
  },
  checkboxEmpty: {
    borderColor: '#D1D5DB',
  },
  taskTitle: {
    flex: 1,
    fontSize: 14,
  },
  taskTitleCompleted: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  taskTitleActive: {
    color: '#1F2937',
  },
  timeContainer: {
    marginTop: 2,
  },
  timeText: {
    color: '#6B7280',
    fontSize: 12,
  },
  categoryIconContainer: {
    marginHorizontal: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4,
  },
  deleteButtonInner: {
    backgroundColor: '#FF4C54',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightedTask: {
    backgroundColor: '#5B67F0',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginLeft: 36,
  },
  highlightedTaskTitle: {
    color: 'white',
    fontWeight: '500',
  },
  highlightedTaskTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#5B67F0',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});