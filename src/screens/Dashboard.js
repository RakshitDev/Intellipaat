import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';
import SkeletonCard from '../components/SkeletonCard';
import StateView from '../components/StateView';
import OfflineBanner from '../components/OfflineBanner';
import { colors } from '../theme/colors';

const Dashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { status, courses, fromCache, savedAt, refreshing, loadCourses } = useCourses();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const onRefresh = useCallback(() => loadCourses({ refresh: true }), [loadCourses]);

  const openCourse = useCallback(
    course => navigation.navigate('CourseDetails', { courseId: course.id, title: course.title }),
    [navigation],
  );

  // First load: skeletons instead of a lone spinner
  if (status === 'idle' || status === 'loading') {
    return (
      <View style={[styles.container, styles.list]}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  // Network failed AND nothing cached
  if (status === 'error') {
    return (
      <View style={styles.container}>
        <StateView
          type="error"
          title="Couldn't load your courses"
          message="Check your internet connection and try again."
          actionLabel="Retry"
          onAction={() => loadCourses()}
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[styles.list, courses.length === 0 && styles.emptyList]}
      data={courses}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => <CourseCard course={item} onPress={() => openCourse(item)} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.secondary]} />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          {fromCache && <OfflineBanner savedAt={savedAt} />}
          {courses.length > 0 && (
            <View>
              <Text style={styles.greeting}>Hi {user?.name}, keep going</Text>
              <Text style={styles.subtitle}>
                {courses.length} {courses.length === 1 ? 'course' : 'courses'} in your library
              </Text>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        <StateView
          type="empty"
          title="No courses yet"
          message="When you enrol in a course, it will show up here."
          actionLabel="Refresh"
          onAction={onRefresh}
        />
      }
    />
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  header: {
    gap: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
