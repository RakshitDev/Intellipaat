import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressBar from './ProgressBar';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme/colors';

const CourseCard = ({ course, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.title}>{course.title}</Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{course.instructor}</Text>
        <Text style={styles.metaText}>{course.lessons.length} lessons</Text>
      </View>
      <View style={styles.progressRow}>
        <ProgressBar value={course.progress} />
        <Text style={styles.percent}>{course.progress}%</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title={course.progress === 100 ? 'Review' : 'Continue'}
          onPress={onPress}
          style={styles.button}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  percent: {
    minWidth: 40,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  footer: {
    alignItems: 'flex-end',
  },
  button: {
    minHeight: 38,
  },
});
