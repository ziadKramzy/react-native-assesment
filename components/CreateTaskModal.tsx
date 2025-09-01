import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../App';
import Animated, { FadeIn, FadeOut, Layout, SlideInRight } from 'react-native-reanimated';

interface CreateTaskModalProps {
  selectedDate: string; // ISO date string (YYYY-MM-DD)
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
}

const categories = [
  { id: 'idea', name: 'Idea', icon: 'bulb-outline', description: '1 or this week' },
  { id: 'food', name: 'Food', icon: 'restaurant-outline', description: '4 or this week' },
  { id: 'work', name: 'Work', icon: 'briefcase-outline', description: '8 or this week' },
  { id: 'sport', name: 'Sport', icon: 'fitness-outline', description: '7 or this week' },
  { id: 'music', name: 'Music', icon: 'musical-notes-outline', description: '3 or this week' },
  { id: 'others', name: 'Others', icon: 'apps-outline', description: 'Custom activities' },
];

export default function CreateTaskModal({ selectedDate, onAddTask, onClose }: CreateTaskModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  // Generate week days based on the selected date
  const weekDays = useMemo(() => {
    const daysToShow = 7; // Number of days to show in the calendar
    const result = [];
    
    // Create Date object from selectedDate
    const baseDate = new Date(selectedDate);
    
    // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
    const currentDayOfWeek = baseDate.getDay();
    
    // Calculate days to show before and after the selected date
    const daysBeforeToShow = 3;
    const startOffset = -daysBeforeToShow;
    
    for (let i = startOffset; i < (daysToShow + startOffset); i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      
      result.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isSelected: date.toISOString().split('T')[0] === selectedDate
      });
    }
    
    return result;
  }, [selectedDate]);

  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskTime, setTaskTime] = useState<string>('10:00 - 11:00');

  // Pre-fill the task title when category changes
  React.useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory);
      setTaskTitle(`New ${category?.name} task`);
    }
  }, [selectedCategory]);

  const handleCreateTask = () => {
    if (selectedCategory && taskTitle.trim()) {
      onAddTask({
        title: taskTitle.trim(),
        time: taskTime,
        completed: false,
        category: selectedCategory,
        date: selectedDate, // Include the selected date
      });
    }
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={SlideInRight.springify()}
      >
        <View style={styles.headerIcon}>
          <Ionicons name="grid-outline" size={24} color="#6B7280" />
        </View>
        <Text style={styles.headerTitle}>
          Create Task for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        entering={FadeIn.delay(200).duration(400)}
      >
        {/* Task Title Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Task Title</Text>
          <View style={styles.textInputContainer}>
            <Ionicons 
              name="create-outline" 
              size={20} 
              color="#6B7280" 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholder="Enter task title"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Task Time Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Task Time</Text>
          <View style={styles.textInputContainer}>
            <Ionicons 
              name="time-outline" 
              size={20} 
              color="#6B7280" 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              value={taskTime}
              onChangeText={setTaskTime}
              placeholder="Enter time (e.g. 10:00 - 11:00)"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        {/* Calendar */}
        <View style={styles.calendarSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.calendarRow}>
              {weekDays.map((item) => (
                <TouchableOpacity
                  key={item.date}
                  // We're not changing the date here since it's handled at the App level
                  style={[
                    styles.dayButton,
                    item.date === selectedDate ? styles.dayButtonSelected : styles.dayButtonDefault
                  ]}
                >
                  <Text style={[
                    styles.dayNumber,
                    item.date === selectedDate ? styles.dayNumberSelected : styles.dayNumberDefault
                  ]}>
                    {item.day}
                  </Text>
                  <Text style={[
                    styles.dayLabel,
                    item.date === selectedDate ? styles.dayLabelSelected : styles.dayLabelDefault
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Choose Activity */}
        <Text style={styles.sectionTitle}>Chose activity</Text>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <Animated.View
              key={category.id}
              entering={FadeIn.delay(index * 100).duration(400)}
              layout={Layout}
            >
              <TouchableOpacity
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id ? styles.categoryItemSelected : styles.categoryItemDefault
                ]}
              >
              <View style={styles.categoryLeft}>
                <View style={[
                  styles.categoryIcon,
                  selectedCategory === category.id ? styles.categoryIconSelected : styles.categoryIconDefault
                ]}>
                  <Ionicons 
                    name={category.icon as any} 
                    size={24} 
                    color={selectedCategory === category.id ? 'white' : '#6B7280'} 
                  />
                </View>
                <View>
                  <Text style={[
                    styles.categoryName,
                    selectedCategory === category.id ? styles.categoryNameSelected : styles.categoryNameDefault
                  ]}>
                    {category.name}
                  </Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={selectedCategory === category.id ? '#5B67F0' : '#D1D5DB'} 
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Create Button */}
      {selectedCategory && (
        <Animated.View 
          style={styles.buttonContainer}
          entering={FadeIn.duration(400)}
          layout={Layout.springify()}
        >
          <TouchableOpacity 
            onPress={handleCreateTask}
            style={styles.createButton}
          >
            <Text style={styles.createButtonText}>Create Task</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 48,
    color: '#1F2937',
    fontSize: 16,
  },
  calendarSection: {
    marginBottom: 32,
  },
  calendarRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dayButton: {
    width: 48,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#5B67F0',
  },
  dayButtonDefault: {
    backgroundColor: '#F3F4F6',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayNumberSelected: {
    color: 'white',
  },
  dayNumberDefault: {
    color: '#1F2937',
  },
  dayLabel: {
    fontSize: 12,
  },
  dayLabelSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dayLabelDefault: {
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  categoryItemSelected: {
    backgroundColor: '#EEF0FF',
    borderWidth: 1,
    borderColor: '#5B67F0',
  },
  categoryItemDefault: {
    backgroundColor: '#F9FAFB',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryIconSelected: {
    backgroundColor: '#5B67F0',
  },
  categoryIconDefault: {
    backgroundColor: 'white',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoryNameSelected: {
    color: '#5B67F0',
  },
  categoryNameDefault: {
    color: '#1F2937',
  },
  categoryDescription: {
    color: '#6B7280',
    fontSize: 14,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  createButton: {
    backgroundColor: '#5B67F0',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});