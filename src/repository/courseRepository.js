import { fetchCourses } from '../services/courseApi';
import * as courseStorage from '../storage/courseStorage';
import { calculateProgress } from '../utils/progress';

// Merges server data with lessons completed locally and derives progress.
export function applyLocalCompletion(courses, completedMap) {
  return courses.map(course => {
    const doneLocally = new Set(completedMap[course.id] || []);
    const lessons = course.lessons.map(lesson => ({
      ...lesson,
      completed: lesson.completed || doneLocally.has(lesson.id),
    }));
    return { ...course, lessons, progress: calculateProgress(lessons) };
  });
}

// Network first, cache fallback.
// Resolves { courses, fromCache, savedAt }; throws only when both network and cache fail.
export async function getCourses() {
  const completedMap = await courseStorage.loadCompletedLessons();

  try {
    const courses = await fetchCourses();
    const savedAt = Date.now();
    // A failed cache write shouldn't hide fresh data from the user
    await courseStorage.saveCourses(courses, savedAt).catch(() => {});
    return {
      courses: applyLocalCompletion(courses, completedMap),
      fromCache: false,
      savedAt,
    };
  } catch (networkError) {
    const cached = await courseStorage.loadCourses();
    if (!cached) throw networkError;
    return {
      courses: applyLocalCompletion(cached.courses, completedMap),
      fromCache: true,
      savedAt: cached.savedAt,
    };
  }
}

export async function markLessonComplete(courseId, lessonId) {
  const completedMap = await courseStorage.loadCompletedLessons();
  const ids = new Set(completedMap[courseId] || []);
  ids.add(lessonId);
  await courseStorage.saveCompletedLessons({ ...completedMap, [courseId]: [...ids] });
}
