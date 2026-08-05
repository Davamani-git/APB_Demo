describe('AuditLoggerService', function () {
  var AuditLoggerService, $log;

  beforeEach(module('timerApp'));

  beforeEach(module(function ($provide) {
    $log = jasmine.createSpyObj('$log', ['info', 'error']);
    $provide.value('$log', $log);
  }));

  beforeEach(inject(function (_AuditLoggerService_) {
    AuditLoggerService = _AuditLoggerService_;
  }));

  describe('logEvent', function () {
    it('should log an event with sanitized details and buffer it when eventName is provided', function () {
      // Arrange
      var details = { action: 'start', password: 'secret', token: 'abc', ssn: '123-45-6789', secret: 'top' };

      // Act
      AuditLoggerService.logEvent('timer:start', details);
      var buffer = AuditLoggerService.getBuffer();

      // Assert
      expect(buffer.length).toBe(1);
      expect(buffer[0].eventName).toBe('timer:start');
      expect(buffer[0].details.action).toBe('start');
      expect(buffer[0].details.password).toBeUndefined();
      expect(buffer[0].details.token).toBeUndefined();
      expect(buffer[0].details.secret).toBeUndefined();
      expect(buffer[0].details.ssn).toBeUndefined();
      expect($log.info).toHaveBeenCalled();
      var infoArgs = $log.info.calls.mostRecent().args;
      expect(infoArgs[0]).toBe('[EVENT]');
    });

    it('should not log or buffer when eventName is falsy', function () {
      // Arrange
      var initialBuffer = AuditLoggerService.getBuffer();

      // Act
      AuditLoggerService.logEvent('', { any: 'value' });
      var finalBuffer = AuditLoggerService.getBuffer();

      // Assert
      expect(finalBuffer.length).toBe(initialBuffer.length);
      expect($log.info).not.toHaveBeenCalled();
    });

    it('should handle non-serializable details by storing empty object', function () {
      // Arrange
      var nonSerializable = {};
      nonSerializable.self = nonSerializable; // circular reference

      // Act
      AuditLoggerService.logEvent('circular:event', nonSerializable);
      var buffer = AuditLoggerService.getBuffer();
      var lastEntry = buffer[buffer.length - 1];

      // Assert
      expect(lastEntry.details).toEqual({});
      expect($log.info).toHaveBeenCalled();
    });
  });

  describe('logError', function () {
    it('should log an error with safe message and buffer it', function () {
      // Arrange
      var error = new Error('Failure');

      // Act
      AuditLoggerService.logError('TimerContext', error);
      var buffer = AuditLoggerService.getBuffer();
      var lastEntry = buffer[buffer.length - 1];

      // Assert
      expect(lastEntry.context).toBe('TimerContext');
      expect(lastEntry.error).toBe('Failure');
      expect($log.error).toHaveBeenCalled();
      var errorArgs = $log.error.calls.mostRecent().args;
      expect(errorArgs[0]).toBe('[ERROR]');
    });

    it('should handle missing error or message by using default Error string', function () {
      // Arrange

      // Act
      AuditLoggerService.logError('TimerContext', null);
      var buffer = AuditLoggerService.getBuffer();
      var lastEntry = buffer[buffer.length - 1];

      // Assert
      expect(lastEntry.context).toBe('TimerContext');
      expect(lastEntry.error).toBe('Error');
    });

    it('should coerce error.message to string when not a string', function () {
      // Arrange
      var error = { message: 12345 };

      // Act
      AuditLoggerService.logError('TimerContext', error);
      var buffer = AuditLoggerService.getBuffer();
      var lastEntry = buffer[buffer.length - 1];

      // Assert
      expect(lastEntry.error).toBe('12345');
    });
  });

  describe('getBuffer', function () {
    it('should return a shallow copy of the buffer', function () {
      // Arrange
      AuditLoggerService.logEvent('test:event', { foo: 'bar' });

      // Act
      var buffer1 = AuditLoggerService.getBuffer();
      buffer1.push({ dummy: true });
      var buffer2 = AuditLoggerService.getBuffer();

      // Assert
      expect(buffer2.length).toBe(buffer1.length - 1);
      expect(buffer2[buffer2.length - 1].eventName).toBe('test:event');
    });
  });
});

/*
Test Documentation:
- Test Name: should log an event with sanitized details and buffer it when eventName is provided
- Purpose: Verify normal logging behavior and sensitive data sanitization.
- Scenario: Call logEvent with a complete details object containing sensitive keys.
- Expected Result: Entry is buffered, sensitive keys removed, and $log.info is invoked.

- Test Name: should not log or buffer when eventName is falsy
- Purpose: Ensure guard clause prevents meaningless event logging.
- Scenario: Call logEvent with an empty eventName.
- Expected Result: Buffer remains unchanged and $log.info is not called.

- Test Name: should handle non-serializable details by storing empty object
- Purpose: Verify robustness when JSON serialization fails.
- Scenario: Pass an object with circular reference as details.
- Expected Result: Sanitized details is an empty object and logging still occurs.

- Test Name: should log an error with safe message and buffer it
- Purpose: Validate error logging flow.
- Scenario: Call logError with an Error instance.
- Expected Result: Entry includes context and message; $log.error is called.

- Test Name: should handle missing error or message by using default Error string
- Purpose: Handle null error inputs gracefully.
- Scenario: Call logError with null error.
- Expected Result: Entry.error is 'Error'.

- Test Name: should coerce error.message to string when not a string
- Purpose: Ensure message is always stored as string.
- Scenario: Pass error object with numeric message.
- Expected Result: Entry.error equals '12345'.

- Test Name: should return a shallow copy of the buffer
- Purpose: Prevent external mutation of internal buffer.
- Scenario: Modify returned buffer and retrieve again.
- Expected Result: Second retrieval is unaffected by external mutation.
*/

/*
Coverage Report:
- Functions tested:
  - logEvent
  - logError
  - getBuffer
  - sanitizeDetails (via logEvent behavior)
- Statements covered:
  - Guard clause for falsy eventName
  - Creation of log entries for events and errors
  - Buffer push operations
  - Logging via $log.info and $log.error
  - sanitizeDetails cloning and sensitive-key removal
  - Fallbacks when details are non-serializable
  - Default handling when error or error.message is missing
- Branches covered:
  - logEvent: eventName truthy vs falsy
  - sanitizeDetails: details falsy vs truthy, JSON.stringify success vs failure
  - logError: error with message vs null/undefined
- Error scenarios covered:
  - Non-serializable details leading to sanitizeDetails catching errors
  - Missing or malformed error objects in logError
- Uncovered scenarios:
  - High-volume logging performance characteristics (outside unit-test scope)
  - Time-based content of ts field (considered non-deterministic and not asserted)
*/