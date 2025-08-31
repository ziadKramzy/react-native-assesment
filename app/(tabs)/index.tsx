import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import TaskInput from '@/components/TaskInput';
import TaskItem, { type Task } from '@/components/TaskItem';
import { MaterialIcons } from '@expo/vector-icons';
import * as storage from '@/utils/storage';

const PRIMARY = '#5B46F6';
const BG = '#F6F7FB';

export default function TaskManagerScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // selected index in the `days` array
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // trigger for focusing the input
  const [focusKey, setFocusKey] = useState(0);

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: String(Date.now()) + Math.random().toString(16).slice(2),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
  // persist after add
  setTimeout(() => saveTasksForSelectedDate([newTask, ...tasks]), 0);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveTasksForSelectedDate(next);
      return next;
    });
  }, []);

  const remaining = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);

  // compute the next 6 days (today + next 5)
  const days = useMemo(() => {
    const out: { date: number; monthShort: string; dayLabel: string; iso: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push({
        date: d.getDate(),
        monthShort: d.toLocaleString(undefined, { month: 'short' }),
        dayLabel: d.toLocaleString(undefined, { weekday: 'short' }),
        iso: d.toISOString().slice(0, 10),
      });
    }
    return out;
  }, []);

  const selectedDay = days[selectedIndex];

  const storageKeyFor = (iso: string) => `tasks:${iso}`;

  const loadTasksForSelectedDate = useCallback(async (iso?: string) => {
    const k = storageKeyFor(iso ?? selectedDay.iso);
    const raw = await storage.getItem(k);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Task[];
        setTasks(parsed);
        return;
      } catch (e) {
        // ignore
      }
    }
    setTasks([]);
  }, [selectedDay.iso]);

  const saveTasksForSelectedDate = useCallback(async (list: Task[]) => {
    const k = storageKeyFor(selectedDay.iso);
    try {
      await storage.setItem(k, JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  }, [selectedDay.iso]);

  useEffect(() => {
    // load whenever the selected date changes
    loadTasksForSelectedDate();
  }, [selectedIndex, loadTasksForSelectedDate]);

  return (
    <ThemedView style={[styles.page, { backgroundColor: BG }]}> 
      <ThemedView style={styles.headerWrap}>
        <ThemedView style={[styles.header, { backgroundColor: PRIMARY }]}> 
          <ThemedText type="title" style={styles.headerTitle}>Today</ThemedText>
          <Pressable style={styles.headerButton} onPress={() => {}} accessibilityRole="button">
            <ThemedText type="defaultSemiBold" style={styles.headerButtonText}>Add New</ThemedText>
          </Pressable>
        </ThemedView>

        <View style={styles.dateRow}>
          {days.map((d, i) => {
            const selected = i === selectedIndex;
            return (
              <Pressable key={d.iso} onPress={() => setSelectedIndex(i)} style={[styles.datePill, selected ? styles.datePillSelected : undefined]}>
                <ThemedText type="defaultSemiBold" style={selected ? styles.datePillTextSelected : styles.datePillText}>{d.date}</ThemedText>
                <ThemedText type="default" style={selected ? styles.datePillLabelSelected : styles.datePillLabel}>{d.dayLabel}</ThemedText>
              </Pressable>
            );
          })}
        </View>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.selectedDateRow}>
          <ThemedText type="subtitle">{selectedDay.date} {selectedDay.monthShort}</ThemedText>
          <ThemedText>{selectedDay.dayLabel}</ThemedText>
        </ThemedView>
        <View style={styles.headerRow}>
          <ThemedText type="subtitle">My Tasks</ThemedText>
          <ThemedText>{remaining} tasks</ThemedText>
        </View>

  <TaskInput onAdd={addTask} focusKey={focusKey} />

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={() => toggleTask(item.id)} onDelete={() => deleteTask(item.id)} />
          )}
          ListEmptyComponent={<ThemedText style={styles.empty}>No tasks yet — add one!</ThemedText>}
          contentContainerStyle={tasks.length === 0 ? styles.listEmptyContainer : undefined}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>

      <Pressable style={[styles.fab, { backgroundColor: PRIMARY }]} onPress={() => setFocusKey((k) => k + 1)} accessibilityRole="button">
        <ThemedText type="defaultSemiBold" style={styles.fabText}>+</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 8,
  },
  header: {
    height: 120,
    borderRadius: 22,
    padding: 18,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  headerButtonText: {
    color: '#fff'
  },
  dateRow: {
    marginTop: -22,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 8,
  },
  datePill: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  datePillSelected: {
    backgroundColor: '#fff',
    transform: [{ translateY: -8 }],
    borderWidth: 0,
    elevation: 6,
    shadowOpacity: 0.14,
  },
  datePillText: {
    color: '#222',
  },
  datePillTextSelected: {
    color: PRIMARY,
  },
  datePillLabel: {
    fontSize: 10,
    color: '#888',
  },
  datePillLabelSelected: {
    fontSize: 10,
    color: '#bbb',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  selectedDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  listEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 28,
  },
});
