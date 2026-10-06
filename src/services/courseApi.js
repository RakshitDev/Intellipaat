import { COURSES_URL, REQUEST_TIMEOUT_MS } from '../config';

// Network only — knows nothing about caching. Throws on any failure.
export async function fetchCourses() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(COURSES_URL, {
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format');
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}
