import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

const LessonRow = ({ index, lesson, onMarkComplete }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.number}>{index + 1}</Text>
      <Text style={[styles.title, lesson.completed && styles.titleDone]}>{lesson.title}</Text>
      {lesson.completed ? (
        <View style={styles.doneChip}>
          <Text style={styles.doneText}>✓ Completed</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.markButton}
          onPress={() => onMarkComplete(lesson.id)}
          hitSlop={6}
          accessibilityLabel={`Mark ${lesson.title} as completed`}
        >
          <Text style={styles.markText}>Mark complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(LessonRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
  },
  number: {
    width: 22,
    fontSize: 13,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  title: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  titleDone: {
    color: colors.textMuted,
  },
  doneChip: {
    backgroundColor: colors.successTint,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  doneText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  markButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  markText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
