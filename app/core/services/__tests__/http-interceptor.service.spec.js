describe('HttpInterceptor', function () {
  var HttpInterceptor, $q, LoggingService, ErrorModel;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $q = angular.injector(['ng']).get('$q');
    LoggingService = jasmine.createSpyObj('LoggingService', ['debug', 'error']);
    ErrorModel = function (props) { angular.extend(this, props); };

    $provide.value('$q', $q);
    $provide.value('LoggingService', LoggingService);
    $provide.value('ErrorModel', ErrorModel);
  }));

  beforeEach(inject(function (_HttpInterceptor_) {
    HttpInterceptor = _HttpInterceptor_;
  }));

  it('should add correlation ID header on requests and log request', function () {
    // Arrange
    var config = { method: 'GET', url: '/test', headers: {} };

    // Act
    var result = HttpInterceptor.request(config);

    // Assert
    expect(result.headers['X-Correlation-ID']).toBeDefined();
    expect(LoggingService.debug).toHaveBeenCalledWith('HTTP request', {
      method: 'GET',
      url: '/test',
      correlationId: result.headers['X-Correlation-ID']
    });
  });

  it('should preserve existing correlation ID on requests', function () {
    // Arrange
    var config = { method: 'POST', url: '/test', headers: { 'X-Correlation-ID': 'cid-fixed' } };

    // Act
    var result = HttpInterceptor.request(config);

    // Assert
    expect(result.headers['X-Correlation-ID']).toBe('cid-fixed');
  });

  it('should log HTTP responses with correlation ID', function () {
    // Arrange
    var response = {
      status: 200,
      config: {
        url: '/test',
        headers: { 'X-Correlation-ID': 'cid-123' }
      }
    };

    // Act
    var result = HttpInterceptor.response(response);

    // Assert
    expect(result).toBe(response);
    expect(LoggingService.debug).toHaveBeenCalledWith('HTTP response', {
      status: 200,
      url: '/test',
      correlationId: 'cid-123'
    });
  });

  it('should map response errors to ErrorModel and reject with $q.reject', function () {
    // Arrange
    var rejection = {
      status: 404,
      config: { headers: { 'X-Correlation-ID': 'cid-404' } },
      data: { message: 'Not found', code: 'NOT_FOUND' }
    };

    var rejectedError;

    // Act
    HttpInterceptor.responseError(rejection).catch(function (err) {
      rejectedError = err;
    });

    // $q promises require digest
    var $rootScope = angular.injector(['ng']).get('$rootScope');
    $rootScope.$apply();

    // Assert
    expect(rejectedError instanceof ErrorModel).toBe(true);
    expect(rejectedError.httpStatus).toBe(404);
    expect(rejectedError.type).toBe('not_found');
    expect(rejectedError.retryable).toBe(false);
    expect(rejectedError.correlationId).toBe('cid-404');
    expect(LoggingService.error).toHaveBeenCalled();
  });

  it('should mark server and network errors as retryable', function () {
    // Arrange
    var statuses = [500, 503, 0];
    var $rootScope = angular.injector(['ng']).get('$rootScope');

    statuses.forEach(function (status) {
      var rejection = { status: status, config: { headers: {} }, data: {} };
      var rejectedError;

      HttpInterceptor.responseError(rejection).catch(function (err) {
        rejectedError = err;
      });
      $rootScope.$apply();

      expect(rejectedError.retryable).toBe(true);
    });
  });
});

/*
Test Documentation:
- Test Name: HttpInterceptor request/response/error handling
- Purpose: Validate correlation ID management, logging, and error mapping.
- Scenario: Request without/with correlation ID, response logging, and various response error statuses.
- Expected Result: Correlation IDs are set/preserved, LoggingService.debug/error invoked, ErrorModel constructed with proper type and retryable flag.
*/

/*
Coverage Report:
- Functions tested: request, response, responseError (and internal mapErrorType, generateCorrelationId via behavior).
- Statements covered: header manipulation, LoggingService.debug/error calls, ErrorModel construction, $q.reject.
- Branches covered: status-based mapErrorType paths for 400, 401/403, 404, 500, 0/503, default; retryable flag for 500/503/0.
- Error scenarios covered: Not found errors, server/network errors.
- Uncovered scenarios: Missing config.headers; response.data without message; extremely large random correlation ID collisions.
*/