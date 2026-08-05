# Low-Level Design (LLD): Timer Web Application

## 1. Component Specifications

### 1.1 TimerDisplay Component
- **Purpose:** Renders the elapsed time in `HH:MM:SS` format.
- **Inputs:** `elapsedTime` (number, seconds).
- **Outputs:** Formatted time string.
- **UI:** Large, centered text, always visible, updates every second when running.

### 1.2 TimerController Component
- **Purpose:** Renders Start, Pause, and Stop buttons. Controls timer state.
- **Inputs:** Timer state (`Running`, `Paused`, `Stopped`).
- **Outputs:** User actions (start, pause, stop).
- **UI Behavior:**
  - Start enabled only if timer is stopped or paused.
  - Pause enabled only if timer is running.
  - Stop enabled only if timer is running or paused.

### 1.3 TimerLogic Module
- **Purpose:** Handles timer state, time calculations, and state transitions.
- **States:** `Running`, `Paused`, `Stopped`
- **Methods:**
  - `start()`: Starts or resumes the timer.
  - `pause()`: Pauses the timer.
  - `stop()`: Stops and resets the timer.
  - `getElapsedTime()`: Returns elapsed time in seconds.

#### State Diagram
```
[Stopped] --(Start)--> [Running]
[Running] --(Pause)--> [Paused]
[Paused] --(Start)--> [Running]
[Running/Paused] --(Stop)--> [Stopped]
```

## 2. Data Flow

1. On page load, TimerLogic initializes state to `Stopped`, elapsed time to 0.
2. User clicks **Start**:
   - TimerLogic transitions to `Running`.
   - TimerDisplay updates every second.
   - TimerController disables Start, enables Pause and Stop.
3. User clicks **Pause**:
   - TimerLogic transitions to `Paused`.
   - TimerDisplay stops updating.
   - TimerController enables Start and Stop, disables Pause.
4. User clicks **Stop**:
   - TimerLogic resets elapsed time to 0, state to `Stopped`.
   - TimerDisplay shows `00:00:00`.
   - TimerController enables Start, disables Pause and Stop.

## 3. Sequence Diagram

```
User -> TimerController: Clicks Start/Pause/Stop
TimerController -> TimerLogic: start()/pause()/stop()
TimerLogic -> TimerDisplay: Update elapsed time
TimerLogic -> TimerController: Notify state change
```

## 4. Implementation Details

- **Frontend:** HTML5, CSS3, JavaScript (or TypeScript).
- **Timer:** Uses `setInterval` for 1-second ticks when running.
- **Formatting:** Elapsed time is formatted as `HH:MM:SS` for display.
- **UI:** Responsive, centered timer and controls, white background.
- **Accessibility:** Buttons have `aria-labels`, tab order is logical.
- **Error Handling:** Buttons are disabled in invalid states.
- **Testing:** Manual and automated tests for all state transitions.

## 5. Security & Compliance

- No user data, no storage, no external integrations.
- No compliance risks.

## 6. File Structure (suggested)
```
/index.html
/styles.css
/app/
  TimerDisplay.js
  TimerController.js
  TimerLogic.js
```
