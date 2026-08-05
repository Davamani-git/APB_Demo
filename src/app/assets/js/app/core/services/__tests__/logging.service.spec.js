describe('Service: LoggingService', function() {
  var LoggingService, $log;

  beforeEach(module('appmrn25.shared', function($provide) {
    $log = jasmine.createSpyObj('$log', ['error', 'info']);
    $provide.value('$log', $log);
  }));

  beforeEach(inject(function(_LoggingService_) {
    LoggingService = _LoggingService_;
  }));

  it('should log error messages with tag prefix', function() {
    // Arrange
    var err = new Error('oops');

    // Act
    LoggingService.error('TAG', err);

    // Assert
    expect($log.error).toHaveBeenCalledWith('[LOG][TAG]', err);
  });

  it('should log info messages with tag prefix', function() {
    // Arrange
    var msg = 'something happened';

    // Act
    LoggingService.info('TAG', msg);

    // Assert
    expect($log.info).toHaveBeenCalledWith('[LOG][TAG]', msg);
  });
});

/*
Test Documentation:
- Test Name: LoggingService logging behavior
- Purpose: Verify LoggingService forwards messages to Angular $log with tag prefixes.
- Scenario: Call error and info methods with mock $log.
- Expected Result: $log.error/info called with formatted tag and provided arguments.
*/

/*
Coverage Report:
- Functions tested: error, info methods of LoggingService.
- Statements covered: String concatenation and $log call sites.
- Branches covered: None.
- Error scenarios covered: None (LoggingService does not handle errors internally).
- Uncovered scenarios: Logging other levels (not implemented).
*/