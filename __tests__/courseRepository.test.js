import { getCourses, applyLocalCompletion } from '../src/repository/courseRepository';
import { calculateProgress } from '../src/utils/progress';
import { fetchCourses } from '../src/services/courseApi';
import * as courseStorage from '../src/storage/courseStorage';

// Explicit factories so the real network / AsyncStorage modules are never loaded
jest.mock('../src/services/courseApi', () => ({ fetchCourses: jest.fn() }));
jest.mock('../src/storage/courseStorage', () => ({
  saveCourses: jest.fn(),
  loadCourses: jest.fn(),
  loadCompletedLessons: jest.fn(),
  saveCompletedLessons: jest.fn(),
}));

const serverCourses = [
  {
    id: 1,
    title: 'Python Programming',
    instructor: 'John Smith',
    lessons: [
      { id: 1, title: 'Introduction', completed: true },
      { id: 2, title: 'Variables', completed: false },
      { id: 3, title: 'Functions', completed: false },
      { id: 4, title: 'OOP', completed: false },
    ],
  },
];

beforeEach(() => {
  jest.resetAllMocks();
  courseStorage.loadCompletedLessons.mockResolvedValue({});
  courseStorage.saveCourses.mockResolvedValue();
});

describe('calculateProgress', () => {
  it('derives a rounded percentage from completed lessons', () => {
    expect(calculateProgress(serverCourses[0].lessons)).toBe(25);
    expect(calculateProgress([{ completed: true }, { completed: true }, { completed: false }])).toBe(67);
  });

  it('returns 0 for a course with no lessons instead of NaN', () => {
    expect(calculateProgress([])).toBe(0);
  });
});

describe('applyLocalCompletion', () => {
  it('merges lessons completed on this device and recalculates progress', () => {
    const [course] = applyLocalCompletion(serverCourses, { 1: [2, 3] });

    expect(course.lessons.map(l => l.completed)).toEqual([true, true, true, false]);
    expect(course.progress).toBe(75);
  });
});

describe('getCourses', () => {
  it('returns fresh data and refreshes the cache when the network works', async () => {
    fetchCourses.mockResolvedValue(serverCourses);

    const result = await getCourses();

    expect(result.fromCache).toBe(false);
    expect(result.courses[0].progress).toBe(25);
    expect(courseStorage.saveCourses).toHaveBeenCalledWith(serverCourses, expect.any(Number));
  });

  it('falls back to cached courses, keeping local progress, when offline', async () => {
    fetchCourses.mockRejectedValue(new Error('Network request failed'));
    courseStorage.loadCourses.mockResolvedValue({ courses: serverCourses, savedAt: 1700000000000 });
    courseStorage.loadCompletedLessons.mockResolvedValue({ 1: [2] });

    const result = await getCourses();

    expect(result.fromCache).toBe(true);
    expect(result.savedAt).toBe(1700000000000);
    expect(result.courses[0].progress).toBe(50);
  });

  it('throws when offline and nothing has been cached yet', async () => {
    fetchCourses.mockRejectedValue(new Error('Network request failed'));
    courseStorage.loadCourses.mockResolvedValue(null);

    await expect(getCourses()).rejects.toThrow('Network request failed');
  });

  it('still returns fresh data if writing the cache fails', async () => {
    fetchCourses.mockResolvedValue(serverCourses);
    courseStorage.saveCourses.mockRejectedValue(new Error('Disk full'));

    const result = await getCourses();

    expect(result.fromCache).toBe(false);
    expect(result.courses).toHaveLength(1);
  });
});
