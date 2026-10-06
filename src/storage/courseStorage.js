import AsyncStorage from '@react-native-async-storage/async-storage';

// Local persistence only. Two separate keys so a fresh API response
// never overwrites the lessons the user completed on this device.
const COURSES_KEY = 'courses_cache';
const COMPLETED_KEY = 'completed_lessons'; // { [courseId]: [lessonId, ...] }

export async function saveCourses(courses, savedAt) {
  await AsyncStorage.setItem(COURSES_KEY, JSON.stringify({ courses, savedAt }));
}

// Returns { courses, savedAt } or null when nothing is cached yet
export async function loadCourses() {
  const raw = await AsyncStorage.getItem(COURSES_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function loadCompletedLessons() {
  const raw = await AsyncStorage.getItem(COMPLETED_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveCompletedLessons(completedMap) {
  await AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify(completedMap));
}
