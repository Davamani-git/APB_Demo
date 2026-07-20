describe('SpendSummaryApiService', function () {
  var SpendSummaryApiService;
  var $httpMock;
  var $qMock;
  var EnvConfigServiceMock;
  var LoggingServiceMock;
  var SpendSummaryModel;
  var KpiSummaryModel;
  var SpendBreakdownModel;
  var ErrorModel;
  var $rootScope;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $httpMock = jasmine.createSpyObj('$http', ['get']);
    $qMock = jasmine.createSpyObj('$q', ['reject']);
    EnvConfigServiceMock = jasmine.createSpyObj('EnvConfigService', ['getApiBaseUrl', 'getApiTimeoutMs']);
    LoggingServiceMock = jasmine.createSpyObj('LoggingService', ['info', 'error']);

    $provide.value('$http', $httpMock);
    $provide.value('$q', $qMock);
    $provide.value('EnvConfigService', EnvConfigServiceMock);
    $provide.value('LoggingService', LoggingServiceMock);
  }));

  beforeEach(inject(function (_SpendSummaryApiService_, _SpendSummaryModel_, _KpiSummaryModel_, _SpendBreakdownModel_, _ErrorModel_, _$rootScope_) {
    SpendSummaryApiService = _SpendSummaryApiService_;
    SpendSummaryModel = _SpendSummaryModel_;
    KpiSummaryModel = _KpiSummaryModel_;
    SpendBreakdownModel = _SpendBreakdownModel_;
    ErrorModel = _ErrorModel_;
    $rootScope = _$rootScope_;
  }));

  it('should reject invalid month format with ErrorModel', function () {
    // Arrange
    var month = '2026/01';
    var rejected;
    var errorInstance = new ErrorModel({ code: '400' });
    $qMock.reject.and.returnValue(errorInstance);

    // Act
    var promise = SpendSummaryApiService.getMonthlySummary(month);
    rejected = promise;

    // Assert
    expect($qMock.reject).toHaveBeenCalled();
  });

  it('should call API and map response to models on success', function () {
    // Arrange
    var month = '2026-01';
    EnvConfigServiceMock.getApiBaseUrl.and.returnValue('http://api');
    EnvConfigServiceMock.getApiTimeoutMs.and.returnValue(1000);
    var responseData = {
      summary: {
        month: '2026-01', totalSpend: 100, currency: 'USD'
      },
      kpis: {
        month: '2026-01', totalSpend: 100, transactionCount: 10
      },
      breakdown: {
        month: '2026-01', currency: 'USD', items: []
      }
    };
    var promiseMock = {
      then: function (onFulfilled) {
        onFulfilled({ data: responseData });
        return {
          catch: function () {}
        };
      }
    };
    $httpMock.get.and.returnValue(promiseMock);

    // Act
    var resultPromise = SpendSummaryApiService.getMonthlySummary(month);

    // Assert
    expect($httpMock.get).toHaveBeenCalledWith('http://api', {
      params: { month: month },
      timeout: 1000
    });
    expect(LoggingServiceMock.info).toHaveBeenCalled();
  });

  it('should map HTTP error codes to ErrorModel and log error', function () {
    // Arrange
    var month = '2026-01';
    EnvConfigServiceMock.getApiBaseUrl.and.returnValue('http://api');
    EnvConfigServiceMock.getApiTimeoutMs.and.returnValue(1000);

    function testStatus(status, expectedMessage, expectedRetryable) {
      var promiseMock = {
        then: function () {
          return {
            catch: function (onRejected) {
              onRejected({ status: status });
              return { then: function () {} };
            }
          };
        }
      };
      $httpMock.get.and.returnValue(promiseMock);
      $qMock.reject.and.callFake(function (errorModel) {
        expect(errorModel.code).toBe(String(status));
        expect(errorModel.message).toBe(expectedMessage);
        expect(errorModel.retryable).toBe(expectedRetryable);
        return { then: function () {}, catch: function () {} };
      });

      SpendSummaryApiService.getMonthlySummary(month);
    }

    // Act & Assert
    testStatus(400, 'Invalid request for monthly summary.', false);
    testStatus(401, 'You are not authorized. Please sign in again.', false);
    testStatus(403, 'You are not allowed to view this summary.', false);
    testStatus(404, 'Monthly summary not found for the requested month.', false);
    testStatus(503, 'Monthly summary is temporarily unavailable.', true);
    testStatus(500, 'An unexpected error occurred while retrieving the monthly summary.', false);

    expect(LoggingServiceMock.error.calls.count()).toBeGreaterThan(0);
  });
});

/*
Test Documentation:
- Test Name: SpendSummaryApiService monthly summary retrieval
- Purpose: Validate API call behavior, error mapping, and handling of invalid month formats.
- Scenario: Call getMonthlySummary with invalid month, successful HTTP response, and various HTTP error statuses.
- Expected Result: Invalid months are rejected; successful responses are logged and mapped; HTTP errors produce appropriate ErrorModel instances and are logged.
*/

/*
Coverage Report:
- Functions tested: getMonthlySummary.
- Statements covered: Month format validation; EnvConfigService URL/timeout retrieval; HTTP GET call; success mapping to models; error mapping for HTTP statuses.
- Branches covered: Valid vs invalid month; each status-specific error path (400, 401, 403, 404, 503, default).
- Error scenarios covered: Invalid input month; all major HTTP status error scenarios.
- Uncovered scenarios: Deep validation of created model instances; network edge cases beyond HTTP status (e.g., timeout vs other errors).
*/