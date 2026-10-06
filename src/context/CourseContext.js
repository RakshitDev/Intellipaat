import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import * as courseRepository from '../repository/courseRepository';
import { calculateProgress } from '../utils/progress';

const CourseContext = createContext(null);

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  courses: [],
  fromCache: false,
  savedAt: null,
  refreshing: false,
  error: null,
};

function setLessonCompleted(courses, courseId, lessonId, completed) {
  return courses.map(course => {
    if (course.id !== courseId) return course;
    const lessons = course.lessons.map(lesson =>
      lesson.id === lessonId ? { ...lesson, completed } : lesson,
    );
    return { ...course, lessons, progress: calculateProgress(lessons) };
  });
}

export function courseReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return action.refresh
        ? { ...state, refreshing: true }
        : { ...state, status: 'loading', error: null };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        status: 'success',
        refreshing: false,
        error: null,
        courses: action.courses,
        fromCache: action.fromCache,
        savedAt: action.savedAt,
      };
    case 'LOAD_FAILURE':
      // Keep showing what we already have on a failed pull-to-refresh
      if (state.courses.length > 0) return { ...state, refreshing: false, fromCache: true };
      return { ...state, status: 'error', refreshing: false, error: action.error };
    case 'SET_LESSON_COMPLETED':
      return {
        ...state,
        courses: setLessonCompleted(state.courses, action.courseId, action.lessonId, action.completed),
      };
    default:
      return state;
  }
}

export function CourseProvider({ children }) {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  const loadCourses = useCallback(async ({ refresh = false } = {}) => {
    dispatch({ type: 'LOAD_START', refresh });
    try {
      const result = await courseRepository.getCourses();
      dispatch({ type: 'LOAD_SUCCESS', ...result });
    } catch (error) {
      dispatch({ type: 'LOAD_FAILURE', error: error.message });
    }
  }, []);

  // Optimistic: update the UI immediately, persist in the background, roll back if saving fails
  const markLessonComplete = useCallback(async (courseId, lessonId) => {
    dispatch({ type: 'SET_LESSON_COMPLETED', courseId, lessonId, completed: true });
    try {
      await courseRepository.markLessonComplete(courseId, lessonId);
    } catch (error) {
      dispatch({ type: 'SET_LESSON_COMPLETED', courseId, lessonId, completed: false });
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({ ...state, loadCourses, markLessonComplete }),
    [state, loadCourses, markLessonComplete],
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export const useCourses = () => useContext(CourseContext);
