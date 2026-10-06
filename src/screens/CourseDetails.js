import React, { useCallback } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useCourses } from '../context/CourseContext';
import LessonRow from '../components/LessonRow';
import ProgressBar from '../components/ProgressBar';
import StateView from '../components/StateView';
import { countCompleted } from '../utils/progress';
import { colors } from '../theme/colors';

const CourseDetails = ({ route, navigation }) => {
  const { courseId } = route.params;
  const { courses, markLessonComplete } = useCourses();

  // Read from the shared store (not route params) so progress updates here and on the Dashboard
  const course = courses.find(c => c.id === courseId);

  const onMarkComplete = useCallback(
    async lessonId => {
      try {
        await markLessonComplete(courseId, lessonId);
      } catch {
        Alert.alert('Could not save', 'Your progress was not saved. Please try again.');
      }
    },
    [courseId, markLessonComplete],
  );

  if (!course) {
    return (
      <View style={styles.container}>
        <StateView
          type="error"
          title="Course not found"
          message="This course is no longer available."
          actionLabel="Back to courses"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  const total = course.lessons.length;
  const completed = countCompleted(course.lessons);
  const remaining = total - completed;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={course.lessons}
      keyExtractor={item => String(item.id)}
      renderItem={({ item, index }) => (
        <LessonRow index={index} lesson={item} onMarkComplete={onMarkComplete} />
      )}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={
        <View style={styles.headerWrap}>
          <View style={styles.summary}>
            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.instructor}>{course.instructor}</Text>

            <View style={styles.progressRow}>
              <ProgressBar value={course.progress} height={10} />
              <Text style={styles.percent}>{course.progress}%</Text>
            </View>
            <Text style={[styles.progressText, remaining === 0 && styles.doneText]}>
              {remaining === 0
                ? `All ${total} lessons completed`
                : `${completed} of ${total} lessons completed · ${remaining} left`}
            </Text>
          </View>
          <Text style={styles.sectionLabel}>LESSONS</Text>
        </View>
      }
    />
  );
};

const Separator = () => <View style={styles.separator} />;

export default CourseDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 24,
  },
  headerWrap: {
    padding: 16,
    paddingBottom: 8,
    gap: 16,
  },
  summary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  instructor: {
    fontSize: 14,
    color: colors.textMuted,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  percent: {
    minWidth: 44,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  progressText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  doneText: {
    color: colors.success,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: colors.textMuted,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 50,
  },
});
