# Intellipaat Learn

A React Native (Android) learning dashboard: mock login, a course list with progress, lesson completion, and offline access to previously loaded courses.

**APK + demo video:** [Google Drive folder](https://drive.google.com/drive/folders/18aCpeQuPmjNUYV5YOTCR0vg_DCPcDfbM?usp=sharing) (`Intelliipaat.apk`, `appDemo.mp4`)

**Demo login:** `rahul@test.com` / `password@123` (or `rohan@test.com` / `password@456`)

**Run:** `npm install` → `npx react-native run-android` · **Test:** `npx jest` · **APK:** `cd android && ./gradlew assembleRelease`

```
src/
  screens/      Login, Dashboard, CourseDetails        (UI only)
  components/   CourseCard, LessonRow, StateView, …    (presentational, props in → UI out)
  context/      AuthContext, CourseContext              (state + actions — the "ViewModel" layer)
  repository/   courseRepository                        (network-first, cache fallback, merges local progress)
  services/     courseApi, authService                  (network / mock API)
  storage/      courseStorage                           (AsyncStorage)
  utils/        progress, validation                    (pure functions)
```
Courses come from a static JSON file in this repo ([`mock/courses.json`](mock/courses.json)) fetched over HTTPS — a real network call with no backend, so loading, failure and offline states are genuine.

## 1. Architecture
Layered, MVVM-style: **Screen → Context (state + actions) → Repository → API + Storage.** Screens never call `fetch` or AsyncStorage; they render state and call actions. The repository is the only place that decides *where* data comes from, so swapping the mock API for a real one, or AsyncStorage for SQLite, touches one file. Course state uses `useReducer`, so every transition (loading → success / error, lesson completed) is explicit and testable. Auth uses React Navigation's conditional-stack pattern: when `user` becomes `null` the Dashboard stack unmounts, so Back can never return to a logged-in screen.

## 2. Offline support
Network-first with cache fallback. Every successful fetch is saved to AsyncStorage with a timestamp. If the request fails (offline, timeout, non-200), the repository returns the cached copy and the Dashboard shows *"You're offline. Showing courses saved today at 2:15 PM."* Completed lessons are stored **under a separate key** and merged on top of server data, so a fresh download never wipes local progress. Progress is always **derived** (completed ÷ total), never stored, so it cannot drift. Marking a lesson is optimistic: the UI updates instantly and rolls back if the write fails.

## 3. Security
Tokens belong in hardware-backed secure storage: **Android Keystore / iOS Keychain**, via `react-native-keychain` or EncryptedSharedPreferences, never plain AsyncStorage (unencrypted, readable on rooted devices). I'd also use short-lived access tokens with a refresh token, HTTPS with certificate pinning, and no secrets in the JS bundle. This demo keeps a mock token in AsyncStorage only because there is no real auth.

## 4. Scale (1M users, hundreds of courses)
1. **Pagination + server-side search** instead of one JSON payload; `FlatList` tuning (`getItemLayout`, `windowSize`) or FlashList.
2. **SQLite (op-sqlite / WatermelonDB)** instead of AsyncStorage for indexed queries over large lesson sets.
3. **Offline write queue:** sync lesson completions to the backend with retries, idempotency keys and conflict resolution (server timestamp wins).
4. **TanStack Query** for caching, deduplication and background refetch, plus HTTP caching (ETag) and a CDN for course content.
5. **Observability:** crash reporting (Sentry/Crashlytics), performance tracing, feature flags and staged rollouts.

## 5. Second platform (iOS)
The same codebase builds for iOS with `cd ios && pod install && npx react-native run-ios`; the only platform-specific work is App Store signing and Keychain configuration. For a fully native rewrite, the layers map 1:1: **SwiftUI** views → `@Observable` **ViewModels** → a **Repository** using `URLSession` + `async/await` → **SwiftData** for the cache, with tokens in **Keychain**, tested with XCTest.

## Testing
[`__tests__/courseRepository.test.js`](__tests__/courseRepository.test.js) covers progress calculation, merging local completion, and the repository's network / cache-fallback / no-cache-error paths, with the API and storage mocked.
