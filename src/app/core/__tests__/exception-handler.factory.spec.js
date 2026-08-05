describe('$exceptionHandler factory', function () {
  var $exceptionHandler, AuditLoggerService;

  beforeEach(module('timerApp'));

  beforeEach(module(function ($provide) {
    AuditLoggerService = jasmine.createSpyObj('AuditLoggerService', ['logError']);
    $provide.value('AuditLoggerService', AuditLoggerService);
  }));

  beforeEach(inject(function (_$exceptionHandler_) {
    $exceptionHandler = _$exceptionHandler_;
  }));

  it('should log errors via AuditLoggerService when exception is provided', function () {
    // Arrange
    var error = new Error('Something went wrong');
    var cause = 'unit test cause';

    // Act
    $exceptionHandler(error, cause);

    // Assert
    expect(AuditLoggerService.logError).toHaveBeenCalledWith('Global', error);
  });

  it('should log a default error object when exception is falsy', function () {
    // Arrange
    var cause = 'missing exception';

    // Act
    $exceptionHandler(null, cause);

    // Assert
    expect(AuditLoggerService.logError).toHaveBeenCalled();
    var callArgs = AuditLoggerService.logError.calls.mostRecent().args;
    expect(callArgs[0]).toBe('Global');
    expect(callArgs[1].message).toBe('Unknown error');
    expect(callArgs[1].cause).toBe(cause);
  });

  it('should swallow errors thrown by AuditLoggerService.logError', function () {
    // Arrange
    AuditLoggerService.logError.and.throwError('logging failure');
    var error = new Error('domain error');

    // Act & Assert
    expect(function () {
      $exceptionHandler(error, 'cause');
    }).not.toThrow();
  });
});

/*
Test Documentation:
- Test Name: should log errors via AuditLoggerService when exception is provided
- Purpose: Verify delegation of global exceptions to AuditLoggerService.
- Scenario: Call $exceptionHandler with a real Error and cause.
- Expected Result: AuditLoggerService.logError is invoked with 'Global' and the same Error instance.

- Test Name: should log a default error object when exception is falsy
- Purpose: Ensure graceful handling when no exception object is provided.
- Scenario: Invoke $exceptionHandler with null exception and a cause.
- Expected Result: AuditLoggerService.logError is called with a synthetic error object containing message 'Unknown error' and the provided cause.

- Test Name: should swallow errors thrown by AuditLoggerService.logError
- Purpose: Validate robustness of the global handler when logging fails internally.
- Scenario: Configure AuditLoggerService.logError to throw and call $exceptionHandler.
- Expected Result: No exception is propagated from $exceptionHandler.
*/

/*
Coverage Report:
- Functions tested:
  - exceptionHandler (factory-produced function implementing $exceptionHandler)
- Statements covered:
  - Construction of default error object when exception is falsy
  - Invocation of AuditLoggerService.logError
  - try/catch guard around AuditLoggerService.logError
- Branches covered:
  - Branch where exception is truthy
  - Branch where exception is falsy
  - Branch where AuditLoggerService.logError throws and is caught
- Error scenarios covered:
  - Missing exception object
  - AuditLoggerService.logError throwing an error
- Uncovered scenarios:
  - None significant; function is small and fully branched
*/