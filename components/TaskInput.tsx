import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type Props = {
  onAdd: (title: string) => void;
  focusKey?: number;
};

export default function TaskInput({ onAdd, focusKey }: Props) {
  const [value, setValue] = useState('');
  const ref = React.useRef<any>(null);

  React.useEffect(() => {
    if (typeof focusKey === 'number') {
      // small delay to ensure layout
      setTimeout(() => ref.current?.focus?.(), 80);
    }
  }, [focusKey]);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  }, [value, onAdd]);

  return (
    <ThemedView style={styles.card}>
      <TextInput
        placeholder="Add a new task"
        returnKeyType="done"
        onSubmitEditing={submit}
        value={value}
        onChangeText={setValue}
        ref={ref}
        style={styles.input}
        editable
        placeholderTextColor={'#999'}
        accessibilityLabel="New task input"
      />
      <TouchableOpacity onPress={submit} accessibilityRole="button" style={[styles.addButton, !value.trim() ? styles.addButtonDisabled : undefined]} disabled={!value.trim()}>
        <ThemedText type="defaultSemiBold">Add</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'web' ? 10 : 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#5B46F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: 'rgba(91,70,246,0.24)',
    opacity: 0.6,
  },
});
