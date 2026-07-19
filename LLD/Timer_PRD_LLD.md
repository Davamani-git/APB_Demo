# Low-Level Design (LLD) – Timer Application

Epic: TIMER-APP – Focus & Rest Timer
Source: Timer_PRD.pdf (Product Requirements Document)

---

## 1. Component Specifications

### 1.1 Client Applications

#### 1.1.1 Web Client (SPA)
- **Technology**: React (or similar SPA framework such as Vue/Angular), TypeScript, HTML5, CSS3.
- **Responsibilities**:
  - Render timer UI (focus, rest, paused, idle states).
  - Handle user interactions: Start, Pause, Resume, Reset, Mute/Unmute, optional configuration of durations.
  - Display remaining time and visual state indicator.
  - Trigger browser notifications (Web Notifications API) and sound alerts.
  - Persist and restore timer state locally to handle tab/browser close and device sleep (via localStorage / IndexedDB).
  - Ensure accessibility (WCAG 2.1 AA): keyboard navigation, ARIA labels, screen reader announcements.
- **Interfaces**:
  - **System Clock**: `Date.now()` for timestamp-based calculations.
  - **Local Persistence**: `localStorage` or `indexedDB` for saving timer state.
  - **Notifications API**: Browser Web Notifications and optional `Audio` API.
- **Dependencies**:
  - Browser environment with support for Web Notifications and ES2015+.
  - CSS framework (e.g., Tailwind/Bootstrap) for consistent styling.

#### 1.1.2 Mobile Client (Cross-Platform)
- **Technology**: React Native / Flutter.
- **Responsibilities**:
  - Native-like UI for timer and controls.
  - Use platform-specific notification APIs for focus/rest completion (Android, iOS).
  - Maintain timer accuracy during app background/foreground transitions.
  - Persist timer state using secure local storage mechanisms.
- **Interfaces**:
  - **System Clock** via OS-provided APIs.
  - **Local Storage**: AsyncStorage (React Native) or SharedPreferences/NSUserDefaults equivalents.
  - **Notifications**: Local push notifications APIs.
- **Dependencies**:
  - Mobile OS notification permissions.
  - Cross-platform timer / background task handling libraries if required.

### 1.2 Timer Engine

#### 1.2.1 Timer State Machine
- **Technology**: Pure TypeScript/JavaScript module or Dart/TypeScript for mobile.
- **Responsibilities**:
  - Maintain the logical timer state: `idle`, `focus`, `paused`, `rest`.
  - Control state transitions according to acceptance criteria.
  - Calculate remaining time using timestamp arithmetic to avoid drift.
  - Expose imperative API for UI layer.
- **States**:
  - `idle`: No active session; remaining time set to default focus duration (e.g., 25:00).
  - `focus`: Focus session running; remaining countdown `> 0`.
  - `paused`: Focus or rest session is paused; countdown not progressing.
  - `rest`: Rest session running.
- **Transitions**:
  - `idle -> focus` on Start.
  - `focus -> paused` on Pause.
  - `paused -> focus` on Resume (when previous state was focus).
  - `focus -> rest` on focus completion.
  - `rest -> idle` on rest completion (or optional start next focus).
  - From any active state (focus/rest/paused) -> `idle` on Reset.
- **Interfaces (API)**:
  - `startFocusSession(): void`
  - `pauseSession(): void`
  - `resumeSession(): void`
  - `startRestSession(): void` (called internally after focus completion or user-invoked)
  - `resetTimer(): void`
  - `muteNotifications(isMuted: boolean): void`
  - `setConfig({ focusDurationMs, restDurationMs }): void` (for FR10 – nice to have)
  - `getState(): TimerState` (returns state + remaining time + timestamps + configuration).
- **Data Structures**:
  ```ts
  type TimerMode = 'idle' | 'focus' | 'paused' | 'rest';

  interface TimerConfig {
    focusDurationMs: number; // default 25 * 60 * 1000
    restDurationMs: number;  // default e.g., 5 * 60 * 1000 (if defined in PRD or product decision)
  }

  interface TimerStateSnapshot {
    mode: TimerMode;
    remainingMs: number;
    startedAt?: number;   // timestamp when session started or resumed
    pausedAt?: number;    // timestamp when paused
    targetEndAt?: number; // computed scheduled end timestamp
    isMuted: boolean;
    config: TimerConfig;
  }
  ```

### 1.3 Persistence Layer (Local Only)
- **Technology**: Browser localStorage / IndexedDB; Mobile secure local storage.
- **Responsibilities**:
  - Store `TimerStateSnapshot` upon any state change.
  - Restore timer state on app launch or resume.
  - Support FR7 & AC7 (persist timer state across closure/sleep).
- **Interfaces**:
  - `saveTimerState(snapshot: TimerStateSnapshot): void`
  - `loadTimerState(): TimerStateSnapshot | null`
- **Dependencies**:
  - Storage APIs available in platform.

### 1.4 Notification Subsystem

#### 1.4.1 Web Notifications
- **Technology**: Web Notifications API, optional Service Worker for reliability.
- **Responsibilities**:
  - Request notification permission.
  - Display notification when focus or rest session completes (FR5, AC4, AC5).
  - Play audio alerts unless muted (FR9, AC8).
- **Interfaces**:
  - `sendSessionEndNotification(mode: 'focus' | 'rest'): void`
  - `playSound(): void` / `stopSound(): void`

#### 1.4.2 Mobile Notifications
- **Technology**: Platform-specific local notifications (Android NotificationManager, iOS UNUserNotificationCenter).
- **Responsibilities**:
  - Schedule local notifications aligned with `targetEndAt` timestamp.
  - Respect mute settings; only visual notifications when muted.

### 1.5 Configuration & Environment
- **Default Values**:
  - Focus duration: 25 minutes (FR1).
  - Rest duration: product decision (e.g., 5 minutes) – not specified in PRD but required for implementation of FR3.
- **Environment Flags**:
  - `ALLOW_CUSTOM_DURATIONS` – toggle FR10.
  - `ENABLE_SOUND` – control sound playback.

---

## 2. Data Flows

### 2.1 Start Focus Session
1. User taps Start.
2. UI sends `startFocusSession()` to Timer Engine.
3. Timer Engine:
   - sets `mode = 'focus'`.
   - computes `targetEndAt = Date.now() + config.focusDurationMs`.
   - sets `startedAt = Date.now()`.
   - initializes interval tick (e.g., `setInterval` every 1s) or animation frame.
4. Timer Engine emits updated `TimerStateSnapshot` to UI.
5. UI updates display (remaining time, state indicator).
6. Persistence layer saves snapshot.
7. Notification subsystem schedules session-end notification (mobile: schedule local notification; web: may simply rely on timer event due to browser constraints).

### 2.2 Pause & Resume
**Pause**:
1. User taps Pause during focus or rest.
2. UI calls `pauseSession()`.
3. Timer Engine:
   - clears tick interval.
   - sets `pausedAt = Date.now()`.
   - recalculates `remainingMs = targetEndAt - Date.now()`.
   - updates `mode = 'paused'`.
4. State snapshot emitted to UI, persisted.

**Resume**:
1. User taps Resume.
2. UI calls `resumeSession()`.
3. Timer Engine:
   - determines previous logical mode (focus or rest) from snapshot.
   - sets `mode` back to previous (`focus` or `rest`).
   - recomputes `targetEndAt = Date.now() + remainingMs`.
   - sets `startedAt = Date.now()`.
   - restarts tick interval.
4. Snapshot emitted, persisted.

### 2.3 Focus Completion → Rest
1. Tick handler checks `Date.now() >= targetEndAt`.
2. Timer Engine sets `remainingMs = 0` and stops tick.
3. Timer Engine updates state to `rest` and initializes rest session:
   - `mode = 'rest'`.
   - `startedAt = Date.now()`.
   - `targetEndAt = Date.now() + config.restDurationMs`.
   - restart tick interval.
4. Notification subsystem sends audible/visual notification (if not muted) indicating focus session end (AC4).
5. UI updates state indicator; persistence layer saves snapshot.

### 2.4 Rest Completion → Idle
1. Tick handler detects `Date.now() >= targetEndAt`.
2. Timer Engine stops tick; `remainingMs = 0`.
3. Updates `mode = 'idle'`, `remainingMs = config.focusDurationMs` (reset to initial value).
4. Notification subsystem sends rest completion notification (AC5).
5. UI updates to idle state.
6. State persisted.

### 2.5 Reset
1. User taps Reset.
2. UI calls `resetTimer()`.
3. Timer Engine:
   - clears tick interval.
   - sets `mode = 'idle'`.
   - sets `remainingMs = config.focusDurationMs`.
   - clears `startedAt`, `pausedAt`, `targetEndAt`.
4. Snapshot emitted; persistence saves.
5. Notification subsystem cancels scheduled notifications (mobile) / stops sound.

### 2.6 Persist & Restore
**Persist**:
- On every state change or periodically (e.g., every 5s), UI obtains snapshot from Timer Engine and calls `saveTimerState(snapshot)`.

**Restore**:
1. On app launch/resume, UI calls `loadTimerState()`.
2. If snapshot exists:
   - Timer Engine reconstructs internal state.
   - If `mode` is `focus` or `rest` and `targetEndAt` is in the future, recompute `remainingMs = targetEndAt - Date.now()` and resume tick.
   - If `targetEndAt` is in the past, apply completion logic (transition to `rest` or `idle` as appropriate).
3. UI reflects reconstructed state.

---

## 3. Sequence Diagrams (Textual)

### 3.1 Start Focus Session (AC1)

**Actors**: User, Web/Mobile UI, Timer Engine, Persistence, Notification Subsystem.

1. User → UI: Click "Start".
2. UI → Timer Engine: `startFocusSession()`.
3. Timer Engine:
   - sets `mode = 'focus'`, `remainingMs = focusDurationMs`.
   - computes `targetEndAt` and starts internal tick.
4. Timer Engine → UI: `stateUpdated(snapshot)`.
5. UI → Persistence: `saveTimerState(snapshot)`.
6. Timer Engine → Notification Subsystem: `scheduleEndNotification('focus', targetEndAt)`.
7. Notification Subsystem acknowledges scheduling.

### 3.2 Pause and Resume (AC2, AC3)

**Pause**:
1. User → UI: Click "Pause".
2. UI → Timer Engine: `pauseSession()`.
3. Timer Engine:
   - stops tick.
   - sets `mode = 'paused'`, calculates `remainingMs`.
4. Timer Engine → UI: `stateUpdated(snapshot)`.
5. UI → Persistence: `saveTimerState(snapshot)`.

**Resume**:
1. User → UI: Click "Resume".
2. UI → Timer Engine: `resumeSession()`.
3. Timer Engine:
   - sets `mode` back to original (`focus` or `rest`).
   - recomputes `targetEndAt`.
   - restarts tick.
4. Timer Engine → UI: `stateUpdated(snapshot)`.
5. UI → Persistence: `saveTimerState(snapshot)`.

### 3.3 Focus Session End Notification and Rest Start (AC4, AC5)

1. Timer Engine internal tick detects completion of focus session.
2. Timer Engine → Notification Subsystem: `notifySessionEnd('focus')`.
3. Notification Subsystem:
   - if not muted, plays sound and shows notification.
   - if muted, shows visual notification only.
4. Timer Engine transitions to rest:
   - sets `mode = 'rest'`.
   - sets `targetEndAt` for rest.
   - restarts tick.
5. Timer Engine → UI: `stateUpdated(snapshot)`.
6. UI → Persistence: `saveTimerState(snapshot)`.

### 3.4 Reset Timer (AC6)

1. User → UI: Click "Reset".
2. UI → Timer Engine: `resetTimer()`.
3. Timer Engine:
   - stops any active tick.
   - sets `mode = 'idle'`.
   - resets `remainingMs` to focus duration.
4. Timer Engine → Notification Subsystem: `cancelPendingNotifications()`.
5. Timer Engine → UI: `stateUpdated(snapshot)`.
6. UI → Persistence: `saveTimerState(snapshot)`.

### 3.5 Persist Timer State Across Closure/Sleep (AC7)

**On Close/Sleep**:
1. OS → App: background/close event.
2. UI → Persistence: `saveTimerState(currentSnapshot)`.

**On Reopen/Wake**:
1. OS → App: foreground event.
2. UI → Persistence: `loadTimerState()`.
3. UI → Timer Engine: `restoreState(snapshot)`.
4. Timer Engine recalculates `remainingMs` and resumes or completes.
5. Timer Engine → UI: `stateUpdated(snapshot)`.

### 3.6 Mute Notifications (AC8)

1. User → UI: Toggle "Mute".
2. UI → Timer Engine: `muteNotifications(true/false)`.
3. Timer Engine updates `isMuted` in snapshot.
4. Timer Engine → UI: `stateUpdated(snapshot)`.
5. UI → Persistence: `saveTimerState(snapshot)`.
6. When session ends, Notification Subsystem checks `isMuted`:
   - if true: skip sound, show visual notification.
   - if false: show visual + play sound.

### 3.7 Visual Session State Indicator (AC9)

1. Timer Engine → UI: `stateUpdated(snapshot)` whenever state changes.
2. UI maps `mode` to visual styles:
   - focus: primary color, "Focus" label, countdown.
   - paused: muted color, "Paused" label, static time.
   - rest: secondary color, "Rest" label, countdown.
   - idle: neutral color, "Ready" label, pre-session time.

---

## 4. Implementation Details

### 4.1 Technology Choices

- **Frontend Web**: React + TypeScript for maintainability, testability, and state management.
- **State Management**: React Context/Redux/Zustand to hold `TimerStateSnapshot` and trigger UI updates.
- **Timing Mechanism**:
  - Use `setInterval` every 1000ms for display updates.
  - Avoid storing decremented seconds; instead compute `remainingMs = targetEndAt - Date.now()` to resist drift (FR Performance & Reliability).
- **Mobile**: React Native with background timer handling and local notifications.

### 4.2 Configuration & Durations

```ts
const DEFAULT_FOCUS_DURATION_MS = 25 * 60 * 1000; // 25 minutes
const DEFAULT_REST_DURATION_MS = 5 * 60 * 1000;   // Example value

let config: TimerConfig = {
  focusDurationMs: DEFAULT_FOCUS_DURATION_MS,
  restDurationMs: DEFAULT_REST_DURATION_MS,
};

function setConfig(newConfig: Partial<TimerConfig>) {
  config = { ...config, ...newConfig };
}
```

Custom durations (FR10) can be enabled via a configuration screen and persisted locally.

### 4.3 Error Handling

- **Notification Permission Denied**:
  - Fallback to in-app visual indicators (modals, banners) when Web/Mobile notifications are unavailable.
  - Log a non-blocking warning in console.
- **Storage Failure**:
  - If `saveTimerState` fails (e.g., quota exceeded), degrade gracefully: app continues but state persistence across restarts may be lost.
  - Optionally show a non-intrusive message.
- **Timer Drift Due to Sleep**:
  - On resume, recompute `remainingMs` using timestamps and `targetEndAt`.
  - If `remainingMs <= 0`, treat as session completed and trigger end workflow.
- **Background Execution Limits (Mobile)**:
  - Use local notifications scheduled at `targetEndAt` so that the user still gets session end alerts even if app is suspended.

### 4.4 Security Considerations

- PRD specifies no user data storage/transmission for MVP.
- Only timer state (non-sensitive) is stored locally.
- If future versions add accounts:
  - Use HTTPS everywhere.
  - Encrypt data at rest (platform keystore, secure storage).
  - Implement proper authentication and authorization.

### 4.5 Performance Considerations

- **Display Update Frequency**:
  - `setInterval` 1000ms ensures update at least once per second (Performance requirement).
- **Notification Latency**:
  - For web, rely on in-tab timer; ensure that check for completion runs at least once per second.
  - For mobile, schedule notifications with OS for near-exact firing.
- **Scalability**:
  - With no backend, scalability relates primarily to static asset hosting; ensure CDN-based delivery that easily supports 10,000+ concurrent users.

### 4.6 Accessibility Implementation

- Use semantic HTML (buttons, headings).
- Add ARIA roles and labels to timer controls (Start, Pause, Resume, Reset, Mute).
- Ensure focus order is logical and all controls can be operated via keyboard (tab/enter/space).
- Provide visible focus indicators.
- Screen reader announcements:
  - Announce state changes ("Focus started", "Session paused", "Rest started", "Session completed").
  - Announce remaining time on demand via an accessible region.

### 4.7 Reliability & Recovery

- Timer accuracy maintained via timestamp-based calculations not reliant solely on interval counts.
- On app crash/reload:
  - Restore snapshot from local storage.
  - If `mode` is `focus/rest`, recalculate `remainingMs`.
  - If `remainingMs <= 0`, complete session and transition state appropriately.

### 4.8 Testing Strategy

- **Unit Tests**:
  - TimerEngine state transitions (idle → focus → paused → focus → rest → idle).
  - Edge cases around 0 seconds remaining.
- **Integration Tests**:
  - Persistence and restore flow (AC7).
  - Mute workflow (AC8).
- **End-to-End Tests**:
  - Simulate user flows: start, pause, resume, complete, reset.
  - Verify notifications and UI state indicators.
- **Timer Accuracy Tests (KPIs)**:
  - Automated test harness that compares expected vs actual elapsed times across many runs to ensure ±1 second accuracy.

---

## 5. Mapping Functional Requirements to Design

- **FR1 (Start focus)**: Implemented via `startFocusSession()` and UI Start button.
- **FR2 (Pause/Resume)**: Implemented via `pauseSession()` / `resumeSession()` APIs; UI buttons.
- **FR3 (Rest period)**: State machine transition from focus completion to rest; `startRestSession()`.
- **FR4 (Display remaining time)**: UI subscribes to `TimerStateSnapshot` and renders `remainingMs`.
- **FR5 (Notifications)**: Notification Subsystem (web/mobile) triggered on session completion.
- **FR6 (Reset)**: `resetTimer()`; resets to idle/focus default.
- **FR7 (Persist state)**: Persistence layer; snapshot save/restore.
- **FR8 (Visual state indicator)**: UI mapping of `mode` to visual styles.
- **FR9 (Mute)**: `muteNotifications()` and Notification Subsystem behavior.
- **FR10 (Customize durations)**: `setConfig()` and configuration UI when enabled.

---

## 6. Non-Functional Requirements Coverage

- **Performance**: 1s tick interval; timestamp-based calculations; OS-level notifications.
- **Security**: No sensitive data; future-proofing for encryption.
- **Scalability**: Static hosting via CDN; no backend bottlenecks.
- **Accessibility**: WCAG 2.1 AA features; ARIA and keyboard navigation.
- **Reliability**: Snapshot persistence; recovery logic; timestamp-based timer.
