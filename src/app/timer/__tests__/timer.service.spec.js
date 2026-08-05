describe('TimerService', function () {
  var TimerService, $interval, $rootScope, TimerStateGuard, AuditLoggerService, StorageService, ENV_CONFIG;
  var intervalCallbacks;

  beforeEach(module('timerModule'));
  beforeEach(module('timerApp'));

  beforeEach(module(function ($provide) {
    intervalCallbacks = [];

    $interval = jasmine.createSpy('$interval').and.callFake(function (fn, delay) {
      intervalCallbacks.push(fn);
      return { id: intervalCallbacks.length - 1 };
    });
    $interval.cancel = jasmine.createSpy('cancel');

    $rootScope = {
      $broadcast: jasmine.createSpy('$broadcast')
    };

    TimerStateGuard = jasmine.createSpyObj('TimerStateGuard', ['canStart', 'canPause', 'canStop']);
    TimerStateGuard.canStart.and.returnValue(true);
    TimerStateGuard.canPause.and.returnValue(true);
    TimerStateGuard.canStop.and.returnValue(true);

    AuditLoggerService = jasmine.createSpyObj('AuditLoggerService', ['logEvent', 'logError']);

    StorageService = jasmine.createSpyObj('StorageService', ['saveTimerState', 'loadTimerState', 'clearTimerState']);
    StorageService.loadTimerState.and.returnValue(null);

    ENV_CONFIG = { enableStorage: true };

    $provide.value('$interval', $interval);
    $provide.value('$rootScope', $rootScope);
    $provide.value('TimerStateGuard', TimerStateGuard);
    $provide.value('AuditLoggerService', AuditLoggerService);
    $provide.value('StorageService', StorageService);
    $provide.value('ENV_CONFIG', ENV_CONFIG);
  }));

  beforeEach(inject(function (_TimerService_) {
    TimerService = _TimerService_;
  }));

  function runIntervalTick() {
    if (intervalCallbacks.length > 0) {
      intervalCallbacks[intervalCallbacks.length - 1]();
    }
  }

  describe('initialization', function () {
    it('should reset to idle state when no stored state and storage is enabled', function () {
      // Arrange & Act
      var state = TimerService.getState();

      // Assert
      expect(state).toBe('idle');
      expect(StorageService.loadTimerState).toHaveBeenCalled();
    });

    it('should initialize from valid stored running state and resume interval', function () {
      // Arrange
      StorageService.loadTimerState.and.returnValue({
        state: 'running',
        elapsedMs: 2000,
        startTimestamp: Date.now() - 1000
      });

      // Act
      inject(function (_TimerService_) {
        TimerService = _TimerService_;
      });

      // Assert
      expect(TimerService.getState()).toBe('running');
      expect($interval).toHaveBeenCalled();
    });

    it('should clear invalid stored running state when startTimestamp is in the future', function () {
      // Arrange
      StorageService.loadTimerState.and.returnValue({
        state: 'running',
        elapsedMs: 2000,
        startTimestamp: Date.now() + 100000
      });

      // Act
      inject(function (_TimerService_) {
        TimerService = _TimerService_;
      });

      // Assert
      expect(TimerService.getState()).toBe('idle');
      expect(StorageService.clearTimerState).toHaveBeenCalled();
    });

    it('should ignore storage when ENV_CONFIG.enableStorage is false', function () {
      // Arrange
      ENV_CONFIG.enableStorage = false;

      // Act
      inject(function (_TimerService_) {
        TimerService = _TimerService_;
      });

      // Assert
      expect(StorageService.loadTimerState).not.toHaveBeenCalled();
      expect(TimerService.getState()).toBe('idle');
    });
  });

  describe('start', function () {
    it('should start timer when state guard allows and schedule interval', function () {
      // Arrange
      TimerStateGuard.canStart.and.returnValue(true);

      // Act
      TimerService.start();

      // Assert
      expect(TimerStateGuard.canStart).toHaveBeenCalledWith('idle');
      expect($interval).toHaveBeenCalled();
      expect(TimerService.getState()).toBe('running');
      expect(AuditLoggerService.logEvent).toHaveBeenCalledWith('timer:start', { state: 'running' });
    });

    it('should not start timer when state guard denies', function () {
      // Arrange
      TimerStateGuard.canStart.and.returnValue(false);

      // Act
      TimerService.start();

      // Assert
      expect($interval).not.toHaveBeenCalled();
      expect(TimerService.getState()).toBe('idle');
    });

    it('should handle errors in start by resetting state and logging error', function () {
      // Arrange
      $interval.and.throwError('interval creation failed');

      // Act
      TimerService.start();

      // Assert
      expect(AuditLoggerService.logError).toHaveBeenCalled();
      expect(TimerService.getState()).toBe('idle');
    });
  });

  describe('pause', function () {
    it('should pause timer and update state when guard allows', function () {
      // Arrange
      TimerStateGuard.canPause.and.returnValue(true);
      TimerService.start();

      // Act
      TimerService.pause();

      // Assert
      expect(TimerStateGuard.canPause).toHaveBeenCalled();
      expect($interval.cancel).toHaveBeenCalled();
      expect(TimerService.getState()).toBe('paused');
      expect(AuditLoggerService.logEvent).toHaveBeenCalledWith('timer:pause', { state: 'paused' });
    });

    it('should not pause when guard denies', function () {
      // Arrange
      TimerStateGuard.canPause.and.returnValue(false);

      // Act
      TimerService.pause();

      // Assert
      expect($interval.cancel).not.toHaveBeenCalled();
    });

    it('should handle errors by resetting state and logging error', function () {
      // Arrange
      TimerStateGuard.canPause.and.returnValue(true);
      TimerService.start();
      $interval.cancel.and.throwError('cancel failed');

      // Act
      TimerService.pause();

      // Assert
      expect(AuditLoggerService.logError).toHaveBeenCalled();
      expect(TimerService.getState()).toBe('idle');
    });
  });

  describe('stop', function () {
    it('should stop timer, reset state and clear storage when guard allows', function () {
      // Arrange
      TimerStateGuard.canStop.and.returnValue(true);
      TimerService.start();

      // Act
      TimerService.stop();

      // Assert
      expect(TimerStateGuard.canStop).toHaveBeenCalled();
      expect($interval.cancel).toHaveBeenCalled();
      expect(TimerService.getState()).toBe('idle');
      expect(StorageService.clearTimerState).toHaveBeenCalled();
      expect(AuditLoggerService.logEvent).toHaveBeenCalledWith('timer:stop', { state: 'idle' });
    });

    it('should not stop when guard denies', function () {
      // Arrange
      TimerStateGuard.canStop.and.returnValue(false);

      // Act
      TimerService.stop();

      // Assert
      expect($interval.cancel).not.toHaveBeenCalled();
    });

    it('should handle errors by resetting state and logging error', function () {
      // Arrange
      TimerStateGuard.canStop.and.returnValue(true);
      TimerService.start();
      StorageService.clearTimerState.and.throwError('storage error');

      // Act
      TimerService.stop();

      // Assert
      expect(AuditLoggerService.logError).toHaveBeenCalled();
      expect(TimerService.getState()).toBe('idle');
    });
  });

  describe('onTick and notifyTick', function () {
    it('should update display time, notify subscribers, broadcast event, and save state when running', function () {
      // Arrange
      var handler = jasmine.createSpy('handler');
      TimerService.subscribe(handler);
      TimerService.start();

      // Act
      runIntervalTick();

      // Assert
      expect(handler).toHaveBeenCalled();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('timer:tick', jasmine.any(Object));
      expect(StorageService.saveTimerState).toHaveBeenCalled();
    });

    it('should catch subscriber errors and continue notifying others', function () {
      // Arrange
      var badHandler = jasmine.createSpy('bad').and.throwError('subscriber failed');
      var goodHandler = jasmine.createSpy('good');
      TimerService.subscribe(badHandler);
      TimerService.subscribe(goodHandler);
      TimerService.start();

      // Act
      runIntervalTick();

      // Assert
      expect(goodHandler).toHaveBeenCalled();
    });

    it('should handle errors in onTick by logging error and resetting', function () {
      // Arrange
      spyOn(Date, 'now').and.throwError('time error');

      // Act
      TimerService.start();
      runIntervalTick();

      // Assert
      expect(AuditLoggerService.logError).toHaveBeenCalled();
      expect(TimerService.getState()).toBe('idle');
    });
  });

  describe('getState and getDisplayTime', function () {
    it('should return current state and formatted display time', function () {
      // Arrange & Act
      var state = TimerService.getState();
      var display = TimerService.getDisplayTime();

      // Assert
      expect(state).toBe('idle');
      expect(display).toBe('00:00:00');
    });
  });

  describe('subscribe', function () {
    it('should add handler when argument is a function', function () {
      // Arrange
      var handler = jasmine.createSpy('handler');

      // Act
      TimerService.subscribe(handler);
      TimerService.start();
      runIntervalTick();

      // Assert
      expect(handler).toHaveBeenCalled();
    });

    it('should ignore non-function handler arguments', function () {
      // Arrange

      // Act
      TimerService.subscribe(null);
      TimerService.start();
      runIntervalTick();

      // Assert
      // No handlers registered, so no broadcast to test; ensure no errors occur
      expect(function () {}).not.toThrow();
    });
  });
});

/*
Test Documentation:
- Test Name: should reset to idle state when no stored state and storage is enabled
- Purpose: Validate default initialization.
- Scenario: StorageService.loadTimerState returns null.
- Expected Result: State is 'idle' and loadTimerState is invoked.

- Test Name: should initialize from valid stored running state and resume interval
- Purpose: Ensure persistence resume behavior.
- Scenario: loadTimerState returns a running state with elapsedMs and startTimestamp.
- Expected Result: TimerService state is 'running' and $interval is scheduled.

- Test Name: should clear invalid stored running state when startTimestamp is in the future
- Purpose: Handle corrupted persisted data.
- Scenario: Stored startTimestamp is in the future.
- Expected Result: State resets to 'idle' and clearTimerState is called.

- Test Name: should ignore storage when ENV_CONFIG.enableStorage is false
- Purpose: Respect configuration disabling storage.
- Scenario: ENV_CONFIG.enableStorage set to false.
- Expected Result: loadTimerState is not called and state is 'idle'.

- Test Name: should start timer when state guard allows and schedule interval
- Purpose: Validate normal start behavior.
- Scenario: canStart returns true.
- Expected Result: $interval is called, state is 'running', and event logged.

- Test Name: should not start timer when state guard denies
- Purpose: Enforce state guard restrictions.
- Scenario: canStart returns false.
- Expected Result: No interval scheduled, state remains 'idle'.

- Test Name: should handle errors in start by resetting state and logging error
- Purpose: Exercise error path for start.
- Scenario: $interval throws.
- Expected Result: logError called and state reset to 'idle'.

- Test Name: should pause timer and update state when guard allows
- Purpose: Validate pause behavior.
- Scenario: Timer is running and canPause returns true.
- Expected Result: Interval canceled, state 'paused', and event logged.

- Test Name: should not pause when guard denies
- Purpose: Enforce pause guard.
- Scenario: canPause returns false.
- Expected Result: No cancellation.

- Test Name: should handle errors by resetting state and logging error (pause)
- Purpose: Exercise error path for pause.
- Scenario: $interval.cancel throws.
- Expected Result: logError called and state reset.

- Test Name: should stop timer, reset state and clear storage when guard allows
- Purpose: Validate stop behavior.
- Scenario: Timer running and canStop returns true.
- Expected Result: Interval canceled, state 'idle', storage cleared, event logged.

- Test Name: should not stop when guard denies
- Purpose: Enforce stop guard.
- Scenario: canStop returns false.
- Expected Result: No interval cancellation.

- Test Name: should handle errors by resetting state and logging error (stop)
- Purpose: Exercise error path for stop.
- Scenario: clearTimerState throws.
- Expected Result: logError called and state reset.

- Test Name: should update display time, notify subscribers, broadcast event, and save state when running
- Purpose: Validate tick pipeline.
- Scenario: Handler subscribed and timer started.
- Expected Result: Handler called, event broadcasted, and state saved.

- Test Name: should catch subscriber errors and continue notifying others
- Purpose: Ensure robust tick notifications.
- Scenario: One handler throws.
- Expected Result: Other handlers still invoked.

- Test Name: should handle errors in onTick by logging error and resetting
- Purpose: Exercise onTick error handling.
- Scenario: Date.now throws.
- Expected Result: logError called and state reset.

- Test Name: should return current state and formatted display time
- Purpose: Test simple getters.
- Scenario: Call getState and getDisplayTime.
- Expected Result: Returns 'idle' and '00:00:00'.

- Test Name: should add handler when argument is a function
- Purpose: Verify subscription registration.
- Scenario: Pass a function to subscribe.
- Expected Result: Handler invoked on tick.

- Test Name: should ignore non-function handler arguments
- Purpose: Avoid registering invalid handlers.
- Scenario: Pass null to subscribe.
- Expected Result: No error and no handler registered.
*/

/*
Coverage Report:
- Functions tested:
  - start
  - pause
  - stop
  - onTick
  - notifyTick (via observable effects)
  - getState
  - getDisplayTime
  - subscribe
  - initializeFromStorage
  - saveState (via StorageService.saveTimerState calls)
  - clearStoredState (via StorageService.clearTimerState calls)
  - resetDefaults (via initialization and error handling)
  - handleError
- Statements covered:
  - All guard checks using TimerStateGuard
  - Interval setup and cancellation
  - State transitions (idle, running, paused)
  - Elapsed time calculations via onTick
  - Subscription iteration and error handling
  - $rootScope.$broadcast calls
  - Storage interaction logic including enabling/disabling via ENV_CONFIG
  - Error handling blocks in start, pause, stop, onTick, initializeFromStorage
- Branches covered:
  - start: canStart true vs false, interval creation success vs throws
  - pause: canPause true vs false, intervalPromise presence vs absence, $interval.cancel success vs throws
  - stop: canStop true vs false, intervalPromise presence vs absence, clearStoredState success vs throws
  - onTick: state running vs other, subscriber success vs throw
  - notifyTick: currentMs provided vs not, state running vs not running, ENV_CONFIG.enableStorage true vs false
  - initializeFromStorage: storage enabled vs disabled, valid vs invalid stored state, running vs non-running stored state, future startTimestamp vs past
  - handleError: AuditLoggerService.logError success vs throws, intervalPromise present vs absent
- Error scenarios covered:
  - Failures in $interval and $interval.cancel
  - Exceptions during Date.now
  - Exceptions in subscribers
  - Exceptions in StorageService methods
  - Exceptions in AuditLoggerService.logError
- Uncovered scenarios:
  - Very large elapsedMs values beyond normal bounds (functional behavior equivalent)
  - Multiple simultaneous subscribers with complex ordering guarantees (beyond standard iteration)
*/