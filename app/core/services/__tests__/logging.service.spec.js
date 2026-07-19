describe('LoggingService', function () {
  var LoggingService, $log, $injector, TELEMETRY_CONFIG;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $log = jasmine.createSpyObj('$log', ['debug', 'info', 'warn', 'error']);
    $injector = jasmine.createSpyObj('$injector', ['get']);
    TELEMETRY_CONFIG = { logLevel: 'debug', enableClientMetrics: true };

    $provide.value('$log', $log);
    $provide.value('$injector', $injector);
    $provide.value('TELEMETRY_CONFIG', TELEMETRY_CONFIG);
  }));

  beforeEach(inject(function (_LoggingService_) {
    LoggingService = _LoggingService_;
  }));

  it('should log debug messages only when logLevel is debug', function () {
    // Act
    LoggingService.debug('test debug', { a: 1 });

    // Assert
    expect($log.debug).toHaveBeenCalledWith('test debug', { a: 1 });

    // Arrange: change logLevel to info
    TELEMETRY_CONFIG.logLevel = 'info';

    // Act: debug should be suppressed
    LoggingService.debug('test debug 2');

    // Assert
    expect($log.debug.calls.count()).toBe(1);
  });

  it('should forward info, warn, and error logs unconditionally', function () {
    // Act
    LoggingService.info('info msg', { x: 1 });
    LoggingService.warn('warn msg', { y: 2 });
    LoggingService.error('error msg', { z: 3 });

    // Assert
    expect($log.info).toHaveBeenCalledWith('info msg', { x: 1 });
    expect($log.warn).toHaveBeenCalledWith('warn msg', { y: 2 });
    expect($log.error).toHaveBeenCalledWith('error msg', { z: 3 });
  });

  it('should send audit events via $http and swallow failures', function () {
    // Arrange
    var $httpMock = jasmine.createSpyObj('$http', ['post']);
    var postDeferred = {
      catch: function (handler) {
        this._catchHandler = handler;
        return this;
      }
    };
    $httpMock.post.and.returnValue(postDeferred);
    $injector.get.and.returnValue($httpMock);

    // Act
    LoggingService.audit('EVENT_NAME', { key: 'value' });

    // Assert
    expect($injector.get).toHaveBeenCalledWith('$http');
    expect($httpMock.post).toHaveBeenCalled();

    var payload = $httpMock.post.calls.mostRecent().args[1];
    expect(payload.eventName).toBe('EVENT_NAME');
    expect(payload.metadata).toEqual({ key: 'value' });
    expect(payload.timestamp).toBeDefined();

    // Simulate failure
    postDeferred._catchHandler({ status: 500 });

    // No exception should propagate (cannot assert directly, but lack of thrown error is implicit).
  });

  it('should handle missing $http in audit gracefully', function () {
    // Arrange
    $injector.get.and.throwError('No $http');

    // Act
    LoggingService.audit('EVENT_NAME', {});

    // Assert: no calls to $log.error or thrown errors
    expect($log.error).not.toHaveBeenCalled();
  });
});

/*
Test Documentation:
- Test Name: LoggingService logging and audit behavior
- Purpose: Validate log level handling and fire-and-forget audit logging, including failure handling.
- Scenario: Debug logging under different log levels, info/warn/error forwarding, audit sending with successful and failing $http retrieval/post.
- Expected Result: Debug logs only when logLevel is 'debug'; other logs always forwarded; audit uses $http when available and swallows errors.
*/

/*
Coverage Report:
- Functions tested: debug, info, warn, error, audit, internal _getHttp via $injector.
- Statements covered: log level check; $log method calls; audit payload construction; $http.post invocation; try/catch blocks.
- Branches covered: TELEMETRY_CONFIG.logLevel === 'debug' vs other; _getHttp success vs exception; audit try/catch.
- Error scenarios covered: Missing $http from injector; $http.post rejection.
- Uncovered scenarios: Invalid telemetry config object; errors thrown by $log methods.
*/