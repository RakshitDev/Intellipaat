export function countCompleted(lessons = []) {
  return lessons.filter(lesson => lesson.completed).length;
}

// Progress is always derived from lessons, never trusted from the API,
// so it can't drift out of sync when a lesson is marked complete.
export function calculateProgress(lessons = []) {
  if (lessons.length === 0) return 0;
  return Math.round((countCompleted(lessons) / lessons.length) * 100);
}
