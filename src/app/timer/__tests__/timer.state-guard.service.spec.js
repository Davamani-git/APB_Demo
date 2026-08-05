describe('TimerStateGuard', function () {
  var TimerStateGuard;

  beforeEach(module('timerModule'));

  beforeEach(inject(function (_TimerStateGuard_) {
    TimerStateGuard = _TimerStateGuard_;
  }));

  describe('canStart', function () {
    it('should allow start when state is idle', function () {
      // Arrange

      // Act
      var result = TimerStateGuard.canStart('idle');

      // Assert
      expect(result).toBe(true);
    });

    it('should allow start when state is paused', function () {
      // Arrange & Act
      var result = TimerStateGuard.canStart('paused');

      // Assert
      expect(result).toBe(true);
    });

    it('should not allow start when state is running or others', function () {
      // Arrange & Act
      var running = TimerStateGuard.canStart('running');
      var other = TimerStateGuard.canStart('unknown');

      // Assert
      expect(running).toBe(false);
      expect(other).toBe(false);
    });
  });

  describe('canPause', function () {
    it('should allow pause when state is running', function () {
      // Arrange & Act
      var result = TimerStateGuard.canPause('running');

      // Assert
      expect(result).toBe(true);
    });

    it('should not allow pause when state is not running', function () {
      // Arrange & Act
      var idle = TimerStateGuard.canPause('idle');
      var paused = TimerStateGuard.canPause('paused');

      // Assert
      expect(idle).toBe(false);
      expect(paused).toBe(false);
    });
  });

  describe('canStop', function () {
    it('should allow stop when state is running', function () {
      // Arrange & Act
      var result = TimerStateGuard.canStop('running');

      // Assert
      expect(result).toBe(true);
    });

    it('should allow stop when state is paused', function () {
      // Arrange & Act
      var result = TimerStateGuard.canStop('paused');

      // Assert
      expect(result).toBe(true);
    });

    it('should not allow stop when state is idle or others', function () {
      // Arrange & Act
      var idle = TimerStateGuard.canStop('idle');
      var other = TimerStateGuard.canStop('other');

      // Assert
      expect(idle).toBe(false);
      expect(other).toBe(false);
    });
  });
});

/*
Test Documentation:
- Test Name: canStart should allow start when state is idle
- Purpose: Validate start permission rule for idle state.
- Scenario: Call canStart with 'idle'.
- Expected Result: Returns true.

- Test Name: canStart should allow start when state is paused
- Purpose: Validate start permission rule for paused state.
- Scenario: Call canStart with 'paused'.
- Expected Result: Returns true.

- Test Name: canStart should not allow start when state is running or others
- Purpose: Prevent start in running or unknown states.
- Scenario: Call canStart with 'running' and 'unknown'.
- Expected Result: Returns false.

- Test Name: canPause should allow pause when state is running
- Purpose: Validate pause permission rule.
- Scenario: Call canPause with 'running'.
- Expected Result: Returns true.

- Test Name: canPause should not allow pause when state is not running
- Purpose: Prevent pause in non-running states.
- Scenario: Call canPause with 'idle' and 'paused'.
- Expected Result: Returns false.

- Test Name: canStop should allow stop when state is running
- Purpose: Validate stop rule for running state.
- Scenario: Call canStop with 'running'.
- Expected Result: Returns true.

- Test Name: canStop should allow stop when state is paused
- Purpose: Validate stop rule for paused state.
- Scenario: Call canStop with 'paused'.
- Expected Result: Returns true.

- Test Name: canStop should not allow stop when state is idle or others
- Purpose: Prevent stop in idle or unknown states.
- Scenario: Call canStop with 'idle' and 'other'.
- Expected Result: Returns false.
*/

/*
Coverage Report:
- Functions tested:
  - canStart
  - canPause
  - canStop
- Statements covered:
  - All return statements in TimerStateGuard methods
- Branches covered:
  - canStart: state 'idle'/'paused' vs other
  - canPause: state 'running' vs other
  - canStop: state 'running'/'paused' vs other
- Error scenarios covered:
  - None; methods have no error handling and assume valid input strings
- Uncovered scenarios:
  - Non-string inputs for state parameter (behavior is implicitly false but not explicitly tested)
*/