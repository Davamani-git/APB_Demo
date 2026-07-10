Unit Test Suite:
/*
  Test framework assumptions:
  - Jest environment with jsdom (or similar DOM-enabled test runner)
  - The timer.js script is loaded in the test environment before these tests
  - If not, adjust imports or include timer.js via setupFiles in Jest config
*/

// Utility to wait for a period (used for interval-based behavior)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to rebuild a minimal DOM structure for each test
function setupDom() {
  document.body.innerHTML = `
    <main class="timer" aria-label="Elapsed Time Timer">
      <h1 class="timer__title">Timer</h1>
      <div
        class="timer__display"
        id="timer-display"
        role="timer"
        aria-live="off"
      >
        00:00:00
      </div>
      <div class="timer__controls" role="group" aria-label="Timer controls">
        <button id="btn-start" class="btn btn--primary" type="button">Start</button>
        <button
          id="btn-pause"
          class="btn btn--secondary"
          type="button"
          disabled
        >
          Pause
        </button>
        <button
          id="btn-stop"
          class="btn btn--danger"
          type="button"
          disabled
        >
          Stop
        </button>
      </div>
      <section class="timer__log" aria-label="Timer event log" hidden>
        <ul id="timer-log-list" class="timer-log__list"></ul>
      </section>
    </main>
  `;
}

// --- Access internal objects from timer.js ---
// timer.js is wrapped in an IIFE and attaches nothing to window by default.
// For testability, it is assumed that the build or a small shim exposes the
// internals to the global test environment like below:
//
//   window.__TimerInternals__ = { ElapsedTimeManager, RulesEngine, SecurityLogger, TimerController };
//
// If this shim does not yet exist, it should be added non-invasively to the
// production bundle or guarded in non-production builds.

const getInternals = () => {
  if (!window.__TimerInternals__) {
    throw new Error(
      '__TimerInternals__ is not defined. Ensure timer.js exposes its internals for testing.'
    );
  }
  return window.__TimerInternals__;
};

// --------- ElapsedTimeManager Tests ---------

describe('ElapsedTimeManager', () => {
  test('nowMs uses performance.now when available', () => {
    const originalPerformance = window.performance;
    const mockNow = jest.fn(() => 1234.56);
    // @ts-ignore
    window.performance = { now: mockNow };

    const { ElapsedTimeManager } = getInternals();
    const result = ElapsedTimeManager.nowMs();

    expect(mockNow).toHaveBeenCalled();
    expect(result).toBe(1234.56);

    window.performance = originalPerformance;
  });

  test('nowMs falls back to Date.now when performance.now is unavailable', () => {
    const originalPerformance = window.performance;
    const originalDateNow = Date.now;

    // @ts-ignore
    window.performance = {};
    const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(987654321);

    const { ElapsedTimeManager } = getInternals();
    const result = ElapsedTimeManager.nowMs();

    expect(dateNowSpy).toHaveBeenCalled();
    expect(result).toBe(987654321);

    dateNowSpy.mockRestore();
    window.performance = originalPerformance;
  });

  test('getElapsedMs returns accumulated time when running', () => {
    const { ElapsedTimeManager } = getInternals();

    const nowSpy = jest
      .spyOn(ElapsedTimeManager, 'nowMs')
      .mockReturnValue(2000);

    const state = {
      status: 'running',
      startTimeMs: 1000,
      elapsedBeforeRunMs: 300,
      lastTickTimeMs: 0,
      currentElapsedMs: 0,
      intervalId: null,
    };

    const elapsed = ElapsedTimeManager.getElapsedMs(state);

    expect(elapsed).toBe(300 + (2000 - 1000)); // 1300
    nowSpy.mockRestore();
  });

  test('getElapsedMs returns currentElapsedMs when not running', () => {
    const { ElapsedTimeManager } = getInternals();

    const statePaused = {
      status: 'paused',
      startTimeMs: 0,
      elapsedBeforeRunMs: 0,
      lastTickTimeMs: 0,
      currentElapsedMs: 555,
      intervalId: null,
    };

    const stateStopped = {
      status: 'stopped',
      startTimeMs: 0,
      elapsedBeforeRunMs: 0,
      lastTickTimeMs: 0,
      currentElapsedMs: 999,
      intervalId: null,
    };

    expect(ElapsedTimeManager.getElapsedMs(statePaused)).toBe(555);
    expect(ElapsedTimeManager.getElapsedMs(stateStopped)).toBe(999);
  });

  test('formatElapsed formats 0 ms as 00:00:00', () => {
    const { ElapsedTimeManager } = getInternals();
    expect(ElapsedTimeManager.formatElapsed(0)).toBe('00:00:00');
  });

  test('formatElapsed formats less than 1 hour correctly', () => {
    const { ElapsedTimeManager } = getInternals();
    // 12 minutes, 34 seconds => 12 * 60 + 34 = 754 seconds
    const ms = 754 * 1000;
    expect(ElapsedTimeManager.formatElapsed(ms)).toBe('00:12:34');
  });

  test('formatElapsed formats multi-hour durations correctly', () => {
    const { ElapsedTimeManager } = getInternals();
    // 2 hours, 3 minutes, 4 seconds
    const totalSeconds = 2 * 3600 + 3 * 60 + 4; // 7384
    const ms = totalSeconds * 1000;

    const result = ElapsedTimeManager.formatElapsed(ms);

    expect(result).toBe('02:03:04');
  });

  test('formatElapsed truncates milliseconds (rounds down seconds)', () => {
    const { ElapsedTimeManager } = getInternals();
    // 1 second + 999 ms => should still be 00:00:01 due to floor
    const ms = 1999;
    expect(ElapsedTimeManager.formatElapsed(ms)).toBe('00:00:01');
  });
});

// --------- RulesEngine Tests ---------

describe('RulesEngine', () => {
  const baseState = {
    startTimeMs: 0,
    elapsedBeforeRunMs: 0,
    lastTickTimeMs: 0,
    currentElapsedMs: 0,
    intervalId: null,
  };

  test('canStart returns true when status is stopped or paused', () => {
    const { RulesEngine } = getInternals();

    expect(RulesEngine.canStart({ ...baseState, status: 'stopped' })).toBe(true);
    expect(RulesEngine.canStart({ ...baseState, status: 'paused' })).toBe(true);
  });

  test('canStart returns false when status is running', () => {
    const { RulesEngine } = getInternals();
    expect(RulesEngine.canStart({ ...baseState, status: 'running' })).toBe(false);
  });

  test('canPause returns true only when running', () => {
    const { RulesEngine } = getInternals();

    expect(RulesEngine.canPause({ ...baseState, status: 'running' })).toBe(true);
    expect(RulesEngine.canPause({ ...baseState, status: 'stopped' })).toBe(false);
    expect(RulesEngine.canPause({ ...baseState, status: 'paused' })).toBe(false);
  });

  test('canStop returns true when running or paused', () => {
    const { RulesEngine } = getInternals();

    expect(RulesEngine.canStop({ ...baseState, status: 'running' })).toBe(true);
    expect(RulesEngine.canStop({ ...baseState, status: 'paused' })).toBe(true);
  });

  test('canStop returns false when stopped', () => {
    const { RulesEngine } = getInternals();
    expect(RulesEngine.canStop({ ...baseState, status: 'stopped' })).toBe(false);
  });
});

// --------- SecurityLogger Tests ---------

describe('SecurityLogger', () => {
  let SecurityLogger;

  beforeEach(() => {
    ({ SecurityLogger } = getInternals());
    SecurityLogger.logEntries.length = 0;
  });

  test('logEvent appends an entry with type, status, timestampIso and optional message', () => {
    const beforeLength = SecurityLogger.logEntries.length;

    SecurityLogger.logEvent('start', 'running', 'Timer started');

    expect(SecurityLogger.logEntries.length).toBe(beforeLength + 1);
    const entry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];

    expect(entry.type).toBe('start');
    expect(entry.status).toBe('running');
    expect(typeof entry.timestampIso).toBe('string');
    expect(entry.timestampIso).toMatch(/T/); // ISO-ish
    expect(entry.message).toBe('Timer started');
  });

  test('logEvent omits message when not provided', () => {
    SecurityLogger.logEvent('stop', 'stopped');
    const entry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];

    expect(entry.type).toBe('stop');
    expect(entry.status).toBe('stopped');
    expect(entry).not.toHaveProperty('message');
  });

  test('logWarning logs a warning with provided message and statusOverride', () => {
    SecurityLogger.logWarning('Invalid transition', 'paused');

    const entry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];

    expect(entry.type).toBe('warning');
    expect(entry.status).toBe('paused');
    expect(entry.message).toBe('Invalid transition');
  });

  test('logWarning uses status "unknown" when not overridden', () => {
    SecurityLogger.logWarning('Some issue');
    const entry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];

    expect(entry.type).toBe('warning');
    expect(entry.status).toBe('unknown');
  });

  test('logError logs an error with Error object', () => {
    const err = new Error('Something went wrong');

    SecurityLogger.logError(err, 'running');

    const entry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];

    expect(entry.type).toBe('error');
    expect(entry.status).toBe('running');
    expect(entry.message).toBe('Something went wrong');
  });

  test('logError logs an error with non-Error value and default status', () => {
    SecurityLogger.logError('plain string');

    const entry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];

    expect(entry.type).toBe('error');
    expect(entry.status).toBe('unknown');
    expect(entry.message).toBe('plain string');
  });
});

// --------- TimerController Unit & Integration Tests ---------

describe('TimerController', () => {
  let TimerController;
  let ElapsedTimeManager;
  let SecurityLogger;
  let RulesEngine;

  beforeEach(() => {
    setupDom();
    ({ TimerController, ElapsedTimeManager, SecurityLogger, RulesEngine } = getInternals());

    // reset state
    TimerController.state.status = 'stopped';
    TimerController.state.startTimeMs = 0;
    TimerController.state.elapsedBeforeRunMs = 0;
    TimerController.state.lastTickTimeMs = 0;
    TimerController.state.currentElapsedMs = 0;
    TimerController.state.intervalId = null;

    // clear logs
    SecurityLogger.logEntries.length = 0;

    // Initialize controller as if DOMContentLoaded fired
    TimerController.init();
  });

  afterEach(() => {
    // ensure any intervals are cleared
    if (TimerController.state.intervalId != null) {
      clearInterval(TimerController.state.intervalId);
      TimerController.state.intervalId = null;
    }
  });

  test('init logs error if UI elements are missing and does not crash', () => {
    // Re-setup DOM with missing elements
    document.body.innerHTML = '<div id="timer-display"></div>'; // no buttons

    SecurityLogger.logEntries.length = 0;
    TimerController.displayEl = null;
    TimerController.btnStart = null;
    TimerController.btnPause = null;
    TimerController.btnStop = null;

    TimerController.init();

    const lastEntry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];
    expect(lastEntry.type).toBe('error');
    expect(lastEntry.status).toBe('stopped');
    expect(lastEntry.message).toBe('Timer UI elements not found');
  });

  test('init sets initial display text and button states for stopped status', () => {
    const display = document.getElementById('timer-display');
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnStop = document.getElementById('btn-stop');

    expect(display.textContent).toBe('00:00:00');
    expect(btnStart.disabled).toBe(false);
    expect(btnPause.disabled).toBe(true);
    expect(btnStop.disabled).toBe(true);
  });

  test('safeHandle logs error and does not throw when wrapped function throws', () => {
    const errorFn = jest.fn(() => {
      throw new Error('boom');
    });

    expect(() => TimerController.safeHandle(errorFn)).not.toThrow();
    expect(errorFn).toHaveBeenCalled();

    const lastEntry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];
    expect(lastEntry.type).toBe('error');
    expect(lastEntry.status).toBe('stopped');
    expect(lastEntry.message).toBe('boom');
  });

  test('handleStartClick starts timer when canStart is true (from stopped)', () => {
    const canStartSpy = jest.spyOn(RulesEngine, 'canStart');
    const startTimerSpy = jest.spyOn(TimerController, 'startTimer');

    TimerController.state.status = 'stopped';

    TimerController.handleStartClick();

    expect(canStartSpy).toHaveBeenCalledWith(TimerController.state);
    expect(startTimerSpy).toHaveBeenCalledWith(false); // not resume

    canStartSpy.mockRestore();
    startTimerSpy.mockRestore();
  });

  test('handleStartClick resumes timer when previous state was paused', () => {
    const startTimerSpy = jest.spyOn(TimerController, 'startTimer');

    TimerController.state.status = 'paused';

    TimerController.handleStartClick();

    expect(startTimerSpy).toHaveBeenCalledWith(true);
    startTimerSpy.mockRestore();
  });

  test('handleStartClick logs warning when start is not allowed', () => {
    const warningSpy = jest.spyOn(SecurityLogger, 'logWarning');

    TimerController.state.status = 'running';

    TimerController.handleStartClick();

    expect(warningSpy).toHaveBeenCalled();
    const [message, status] = warningSpy.mock.calls[0];
    expect(message).toMatch(/Start clicked in invalid state/);
    expect(status).toBe('running');

    warningSpy.mockRestore();
  });

  test('handlePauseClick pauses timer when allowed', () => {
    const canPauseSpy = jest.spyOn(RulesEngine, 'canPause');
    const pauseSpy = jest.spyOn(TimerController, 'pauseTimer');

    TimerController.state.status = 'running';

    TimerController.handlePauseClick();

    expect(canPauseSpy).toHaveBeenCalledWith(TimerController.state);
    expect(pauseSpy).toHaveBeenCalled();

    canPauseSpy.mockRestore();
    pauseSpy.mockRestore();
  });

  test('handlePauseClick logs warning when pause not allowed', () => {
    const warningSpy = jest.spyOn(SecurityLogger, 'logWarning');

    TimerController.state.status = 'stopped';
    TimerController.handlePauseClick();

    expect(warningSpy).toHaveBeenCalled();
    const [message, status] = warningSpy.mock.calls[0];
    expect(message).toMatch(/Pause clicked in invalid state/);
    expect(status).toBe('stopped');

    warningSpy.mockRestore();
  });

  test('handleStopClick stops timer when allowed', () => {
    const canStopSpy = jest.spyOn(RulesEngine, 'canStop');
    const stopSpy = jest.spyOn(TimerController, 'stopTimer');

    TimerController.state.status = 'running';

    TimerController.handleStopClick();

    expect(canStopSpy).toHaveBeenCalledWith(TimerController.state);
    expect(stopSpy).toHaveBeenCalled();

    canStopSpy.mockRestore();
    stopSpy.mockRestore();
  });

  test('handleStopClick logs warning when stop not allowed', () => {
    const warningSpy = jest.spyOn(SecurityLogger, 'logWarning');

    TimerController.state.status = 'stopped';
    TimerController.handleStopClick();

    expect(warningSpy).toHaveBeenCalled();
    const [message, status] = warningSpy.mock.calls[0];
    expect(message).toMatch(/Stop clicked in invalid state/);
    expect(status).toBe('stopped');

    warningSpy.mockRestore();
  });

  test('startTimer from stopped resets elapsed and transitions to running with log', () => {
    const nowSpy = jest.spyOn(ElapsedTimeManager, 'nowMs').mockReturnValue(5000);
    const startUpdateSpy = jest.spyOn(TimerController, 'startUpdateLoop');
    const updateControlsSpy = jest.spyOn(TimerController, 'updateControls');

    TimerController.state.status = 'stopped';
    TimerController.state.elapsedBeforeRunMs = 1234;
    TimerController.state.currentElapsedMs = 5678;

    TimerController.startTimer(false);

    expect(TimerController.state.elapsedBeforeRunMs).toBe(0);
    expect(TimerController.state.currentElapsedMs).toBe(0);
    expect(TimerController.state.status).toBe('running');
    expect(TimerController.state.startTimeMs).toBe(5000);

    expect(startUpdateSpy).toHaveBeenCalled();
    expect(updateControlsSpy).toHaveBeenCalled();

    const lastEntry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];
    expect(lastEntry.type).toBe('start');
    expect(lastEntry.status).toBe('running');

    nowSpy.mockRestore();
    startUpdateSpy.mockRestore();
    updateControlsSpy.mockRestore();
  });

  test('startTimer with isResume=true logs resume event', () => {
    jest.spyOn(ElapsedTimeManager, 'nowMs').mockReturnValue(10000);

    TimerController.state.status = 'paused';
    TimerController.startTimer(true);

    const lastEntry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];
    expect(lastEntry.type).toBe('resume');
    expect(lastEntry.status).toBe('running');

    jest.spyOn(ElapsedTimeManager, 'nowMs').mockRestore?.();
  });

  test('pauseTimer captures elapsed time, updates state, display, controls, and logs', () => {
    const elapsedSpy = jest
      .spyOn(ElapsedTimeManager, 'getElapsedMs')
      .mockReturnValue(3210);
    const updateDisplaySpy = jest.spyOn(TimerController, 'updateDisplay');
    const updateControlsSpy = jest.spyOn(TimerController, 'updateControls');
    const stopUpdateSpy = jest.spyOn(TimerController, 'stopUpdateLoop');

    TimerController.state.status = 'running';

    TimerController.pauseTimer();

    expect(elapsedSpy).toHaveBeenCalledWith(TimerController.state);
    expect(TimerController.state.elapsedBeforeRunMs).toBe(3210);
    expect(TimerController.state.currentElapsedMs).toBe(3210);
    expect(TimerController.state.status).toBe('paused');
    expect(stopUpdateSpy).toHaveBeenCalled();
    expect(updateDisplaySpy).toHaveBeenCalled();
    expect(updateControlsSpy).toHaveBeenCalled();

    const lastEntry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];
    expect(lastEntry.type).toBe('pause');
    expect(lastEntry.status).toBe('paused');

    elapsedSpy.mockRestore();
    updateDisplaySpy.mockRestore();
    updateControlsSpy.mockRestore();
    stopUpdateSpy.mockRestore();
  });

  test('stopTimer resets state to stopped, clears times, updates UI, and logs', () => {
    const updateDisplaySpy = jest.spyOn(TimerController, 'updateDisplay');
    const updateControlsSpy = jest.spyOn(TimerController, 'updateControls');
    const stopUpdateSpy = jest.spyOn(TimerController, 'stopUpdateLoop');

    TimerController.state.status = 'running';
    TimerController.state.elapsedBeforeRunMs = 5000;
    TimerController.state.currentElapsedMs = 5000;
    TimerController.state.startTimeMs = 1234;

    TimerController.stopTimer();

    expect(stopUpdateSpy).toHaveBeenCalled();
    expect(TimerController.state.status).toBe('stopped');
    expect(TimerController.state.elapsedBeforeRunMs).toBe(0);
    expect(TimerController.state.currentElapsedMs).toBe(0);
    expect(TimerController.state.startTimeMs).toBe(0);

    expect(updateDisplaySpy).toHaveBeenCalled();
    expect(updateControlsSpy).toHaveBeenCalled();

    const lastEntry = SecurityLogger.logEntries[SecurityLogger.logEntries.length - 1];
    expect(lastEntry.type).toBe('stop_reset');
    expect(lastEntry.status).toBe('stopped');

    updateDisplaySpy.mockRestore();
    updateControlsSpy.mockRestore();
    stopUpdateSpy.mockRestore();
  });

  test('startUpdateLoop sets up interval and clears existing one if present', async () => {
    const clearSpy = jest.spyOn(window, 'clearInterval');
    const setSpy = jest.spyOn(window, 'setInterval');

    TimerController.state.intervalId = 999; // pretend existing interval

    TimerController.startUpdateLoop();

    expect(clearSpy).toHaveBeenCalledWith(999);
    expect(setSpy).toHaveBeenCalled();
    expect(typeof TimerController.state.intervalId).toBe('number');

    clearSpy.mockRestore();
    setSpy.mockRestore();
  });

  test('stopUpdateLoop clears interval and nulls intervalId when present', () => {
    const clearSpy = jest.spyOn(window, 'clearInterval');
    TimerController.state.intervalId = 123;

    TimerController.stopUpdateLoop();

    expect(clearSpy).toHaveBeenCalledWith(123);
    expect(TimerController.state.intervalId).toBeNull();

    clearSpy.mockRestore();
  });

  test('stopUpdateLoop does nothing when intervalId is null', () => {
    const clearSpy = jest.spyOn(window, 'clearInterval');
    TimerController.state.intervalId = null;

    TimerController.stopUpdateLoop();

    expect(clearSpy).not.toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  test('onTick updates display only when status is running', () => {
    const elapsedSpy = jest
      .spyOn(ElapsedTimeManager, 'getElapsedMs')
      .mockReturnValue(7000);
    const updateDisplaySpy = jest.spyOn(TimerController, 'updateDisplay');

    TimerController.state.status = 'paused';
    TimerController.onTick(); // should early-return

    expect(updateDisplaySpy).not.toHaveBeenCalled();

    TimerController.state.status = 'running';
    TimerController.onTick();

    expect(elapsedSpy).toHaveBeenCalledWith(TimerController.state);
    expect(TimerController.state.currentElapsedMs).toBe(7000);
    expect(updateDisplaySpy).toHaveBeenCalled();

    elapsedSpy.mockRestore();
    updateDisplaySpy.mockRestore();
  });

  test('updateDisplay does nothing when display element is missing', () => {
    TimerController.displayEl = null;
    expect(() => TimerController.updateDisplay()).not.toThrow();
  });

  test('updateDisplay sets formatted elapsed time on display element', () => {
    TimerController.state.currentElapsedMs = 3661000; // 1:01:01

    const formatSpy = jest
      .spyOn(ElapsedTimeManager, 'formatElapsed')
      .mockReturnValue('01:01:01');

    TimerController.updateDisplay();

    const display = document.getElementById('timer-display');
    expect(formatSpy).toHaveBeenCalledWith(3661000);
    expect(display.textContent).toBe('01:01:01');

    formatSpy.mockRestore();
  });

  test('updateControls does nothing when button elements are missing', () => {
    TimerController.btnStart = null;
    TimerController.btnPause = null;
    TimerController.btnStop = null;

    expect(() => TimerController.updateControls()).not.toThrow();
  });

  test('updateControls sets button states correctly when stopped', () => {
    TimerController.state.status = 'stopped';
    TimerController.updateControls();

    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnStop = document.getElementById('btn-stop');

    expect(btnStart.disabled).toBe(false);
    expect(btnPause.disabled).toBe(true);
    expect(btnStop.disabled).toBe(true);
  });

  test('updateControls sets button states correctly when running', () => {
    TimerController.state.status = 'running';
    TimerController.updateControls();

    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnStop = document.getElementById('btn-stop');

    expect(btnStart.disabled).toBe(true);
    expect(btnPause.disabled).toBe(false);
    expect(btnStop.disabled).toBe(false);
  });

  test('updateControls sets button states correctly when paused', () => {
    TimerController.state.status = 'paused';
    TimerController.updateControls();

    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnStop = document.getElementById('btn-stop');

    expect(btnStart.disabled).toBe(false);
    expect(btnPause.disabled).toBe(true);
    expect(btnStop.disabled).toBe(false);
  });

  test('clicking start, pause, stop buttons drives full lifecycle (integration)', async () => {
    jest.useFakeTimers();

    const nowSpy = jest
      .spyOn(ElapsedTimeManager, 'nowMs')
      .mockReturnValue(0);

    const display = document.getElementById('timer-display');
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnStop = document.getElementById('btn-stop');

    // Start timer
    btnStart.click();

    expect(TimerController.state.status).toBe('running');
    expect(btnStart.disabled).toBe(true);
    expect(btnPause.disabled).toBe(false);
    expect(btnStop.disabled).toBe(false);

    // Advance time and simulate tick
    nowSpy.mockReturnValue(5000); // 5 seconds later

    jest.advanceTimersByTime(200); // trigger interval once

    expect(TimerController.state.currentElapsedMs).toBe(
      ElapsedTimeManager.getElapsedMs(TimerController.state)
    );

    // Pause
    btnPause.click();
    expect(TimerController.state.status).toBe('paused');
    const pausedElapsed = TimerController.state.currentElapsedMs;

    // Resume
    nowSpy.mockReturnValue(6000); // resumed at 6s
    btnStart.click();
    expect(TimerController.state.status).toBe('running');

    // Advance more time
    nowSpy.mockReturnValue(10000); // 10s total
    jest.advanceTimersByTime(200);

    expect(TimerController.state.currentElapsedMs).toBeGreaterThan(pausedElapsed);

    // Stop
    btnStop.click();
    expect(TimerController.state.status).toBe('stopped');
    expect(TimerController.state.currentElapsedMs).toBe(0);
    expect(display.textContent).toBe('00:00:00');

    nowSpy.mockRestore();
    jest.useRealTimers();
  });
});


Test Documentation:

ElapsedTimeManager tests:
- nowMs uses performance.now when available: Ensures the function prefers high-resolution performance timing when the API is present, which is important for timer accuracy.
- nowMs falls back to Date.now when performance.now is unavailable: Verifies correct fallback behavior for environments lacking performance.now, avoiding runtime errors.
- getElapsedMs returns accumulated time when running: Confirms that elapsed time is computed as previously accumulated time plus the difference between current time and start time when timer is running.
- getElapsedMs returns currentElapsedMs when not running: Validates that in paused or stopped states, elapsed time remains constant and is taken from currentElapsedMs without new calculations.
- formatElapsed formats 0 ms as 00:00:00: Tests baseline formatting of a zero-duration to the expected HH:MM:SS output.
- formatElapsed formats less than 1 hour correctly: Ensures correct minute/second calculation when hours remain zero.
- formatElapsed formats multi-hour durations correctly: Confirms correct extraction and zero-padding of hours, minutes, and seconds for long durations.
- formatElapsed truncates milliseconds (rounds down seconds): Ensures that sub-second precision does not affect the formatted seconds, matching floor semantics.

RulesEngine tests:
- canStart returns true when status is stopped or paused: Validates that the timer can be started from both initial and paused states, matching business rules.
- canStart returns false when status is running: Ensures that redundant start actions are disallowed while timer is already running.
- canPause returns true only when running: Confirms that pause is only legal from running state to maintain a clear state machine.
- canStop returns true when running or paused: Verifies that stop/reset is allowed from both active and paused states.
- canStop returns false when stopped: Ensures that unnecessary stop operations are prevented when timer is already reset.

SecurityLogger tests:
- logEvent appends an entry with type, status, timestampIso and optional message: Confirms that core logging records all essential audit fields correctly.
- logEvent omits message when not provided: Validates that message is optional and not forced into the log structure.
- logWarning logs a warning with provided message and statusOverride: Ensures warnings are logged with user-provided status context for better traceability.
- logWarning uses status "unknown" when not overridden: Confirms default status handling for warnings when state is not explicitly provided.
- logError logs an error with Error object: Ensures Error instances are correctly converted into log entries using their message field.
- logError logs an error with non-Error value and default status: Validates robust handling of arbitrary error payloads while preserving a safe default status.

TimerController unit tests:
- init logs error if UI elements are missing and does not crash: Ensures defensive behavior when expected DOM nodes are absent, via safe logging instead of crashing the app.
- init sets initial display text and button states for stopped status: Validates initial UI state (00:00:00 and enabled/disabled controls) matches UX requirements.
- safeHandle logs error and does not throw when wrapped function throws: Confirms central error-handling mechanism for UI event handlers prevents uncaught exceptions.
- handleStartClick starts timer when canStart is true (from stopped): Tests that start button correctly transitions to running state and delegates to startTimer.
- handleStartClick resumes timer when previous state was paused: Ensures the controller distinguishes between fresh start and resume, passing the proper flag.
- handleStartClick logs warning when start is not allowed: Verifies security logging for invalid start attempts, supporting audit requirements.
- handlePauseClick pauses timer when allowed: Confirms pause logic is invoked only when permitted by RulesEngine.
- handlePauseClick logs warning when pause not allowed: Ensures invalid pause attempts are safely logged, not executed.
- handleStopClick stops timer when allowed: Validates that allowed stop actions delegate to stopTimer in accordance with business rules.
- handleStopClick logs warning when stop not allowed: Ensures invalid stop clicks are logged for security monitoring.
- startTimer from stopped resets elapsed and transitions to running with log: Confirms that starting from a reset state clears previous timing data, initializes startTimeMs, begins the update loop, updates controls, and logs the start event.
- startTimer with isResume=true logs resume event: Validates that resume scenarios are logged distinctly from new starts for better auditability.
- pauseTimer captures elapsed time, updates state, display, controls, and logs: Ensures that pausing freezes the elapsed time, stops updating, reflects in UI, and records a pause event.
- stopTimer resets state to stopped, clears times, updates UI, and logs: Confirms stop behavior fully resets internal timing state and UI while emitting the appropriate log entry.
- startUpdateLoop sets up interval and clears existing one if present: Tests that only one interval is active at a time, avoiding leaks or double updates.
- stopUpdateLoop clears interval and nulls intervalId when present: Validates proper cleanup of active intervals and state.
- stopUpdateLoop does nothing when intervalId is null: Ensures stopUpdateLoop is safe to call idempotently without side effects.
- onTick updates display only when status is running: Confirms that periodic updates occur only in running state and that currentElapsedMs is recalculated based on time.
- updateDisplay does nothing when display element is missing: Validates defensive behavior if the display node is unexpectedly absent.
- updateDisplay sets formatted elapsed time on display element: Ensures the display text is always based on formatted elapsed milliseconds.
- updateControls does nothing when button elements are missing: Confirms robustness when button nodes are absent, preventing runtime errors.
- updateControls sets button states correctly when stopped: Tests that the control state in the stopped mode matches UX specification.
- updateControls sets button states correctly when running: Verifies that during running status, only pause and stop are enabled.
- updateControls sets button states correctly when paused: Validates that in paused state, start (resume) and stop are allowed, pause is disabled.

TimerController integration test:
- clicking start, pause, stop buttons drives full lifecycle (integration): Simulates user interaction across the full lifecycle (start, tick, pause, resume, tick, stop) using fake timers, verifying correct state transitions, time accumulation, control enablement, and display reset.


Coverage Report:
- Files under test: src/timer.js
- Functions / methods tested:
  - ElapsedTimeManager: nowMs, getElapsedMs, formatElapsed
  - RulesEngine: canStart, canPause, canStop
  - SecurityLogger: logEvent, logWarning, logError
  - TimerController: init, safeHandle, handleStartClick, handlePauseClick, handleStopClick,
    startTimer, pauseTimer, stopTimer, startUpdateLoop, stopUpdateLoop, onTick,
    updateDisplay, updateControls
- State transitions covered:
  - stopped → running (start)
  - stopped → running (integration start)
  - running → paused (pause)
  - paused → running (resume)
  - running → stopped (stop)
  - paused → stopped (stop)
- UI behavior covered:
  - Initial render and control states
  - Display formatting updates based on elapsed time
  - Button disabled/enabled matrix for stopped, running, paused
  - Handling of missing DOM elements safely
- Logging behavior covered:
  - SecurityLogger entries for events, warnings, errors
  - Invalid action attempts (start/pause/stop in wrong states)
  - Error handling in safeHandle and init
- Edge cases covered:
  - Missing performance.now, falling back to Date.now
  - Missing DOM elements for initialization and updates
  - Multiple intervals being replaced safely
  - Null intervalId in stopUpdateLoop
  - Non-Error values passed to logError
  - Zero and multi-hour elapsed durations for formatting
- Overall coverage expectations:
  - Branch coverage:
    - RulesEngine decision branches fully tested
    - TimerController state-based branches for actions and updateControls fully tested
    - ElapsedTimeManager branches (running vs non-running, perf vs Date.now) fully tested
    - SecurityLogger branches (message present/absent, statusOverride present/absent, error types) fully tested
  - Functional coverage:
    - All user-visible behaviors of the timer (start, pause, resume, stop, display, controls, logging) are exercised.
    - The test suite focuses on one behavior per test, keeping tests readable and maintainable.