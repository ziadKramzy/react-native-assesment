import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// Attempt to import Reanimated's Layout for simple entering/exiting animations
let ReanimatedView: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Reanimated = require('react-native-reanimated');
  ReanimatedView = Reanimated.Layout && Reanimated.createAnimatedComponent ? Reanimated.View : null;
} catch (e) {
  ReanimatedView = null;
}
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const confirmDelete = () => {
    // Small confirm for accidental deletes
    if (Platform.OS === 'web') {
      // web: simple confirm
      if (confirm('Delete this task?')) onDelete();
      return;
    }

    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  const Container: any = ReanimatedView ?? ThemedView;

  return (
    <Container style={styles.row}>
      <Pressable onPress={onToggle} accessibilityRole="button" style={styles.checkboxArea}>
        <MaterialIcons name={task.completed ? 'check-box' : 'check-box-outline-blank'} size={22} color={task.completed ? '#5B46F6' : '#444'} />
      </Pressable>

      <ThemedView style={styles.content}>
        <ThemedText type="default" style={task.completed ? styles.completedText : undefined}>
          {task.title}
        </ThemedText>
      </ThemedView>

      <Pressable onPress={confirmDelete} accessibilityRole="button" style={styles.deleteArea}>
        <MaterialIcons name="delete-outline" size={18} color="#5B46F6" />
      </Pressable>
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderRadius: 12,
  marginBottom: 10,
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 16,
  elevation: 4,
  },
  checkboxArea: {
    width: 36,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  deleteArea: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});
