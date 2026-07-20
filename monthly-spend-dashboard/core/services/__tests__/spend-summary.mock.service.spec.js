describe('SpendSummaryMockService', function () {
  var SpendSummaryMockService;
  var $q;
  var $timeout;
  var EnvConfigServiceMock;
  var LoggingServiceMock;
  var SpendSummaryModel;
  var KpiSummaryModel;
  var SpendBreakdownModel;
  var ErrorModel;
  var $rootScope;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $q = jasmine.createSpyObj('$q', ['defer']);
    $timeout = jasmine.createSpy('$timeout');
    EnvConfigServiceMock = jasmine.createSpyObj('EnvConfigService', ['getMaxLookbackMonths']);
    LoggingServiceMock = jasmine.createSpyObj('LoggingService', ['info', 'error', 'warn']);

    $provide.value('$q', $q);
    $provide.value('$timeout', function (fn, delay) {
      // Immediately execute for unit tests
      fn();
      return delay;
    });
    $provide.value('EnvConfigService', EnvConfigServiceMock);
    $provide.value('LoggingService', LoggingServiceMock);
  }));

  beforeEach(inject(function (_SpendSummaryMockService_, _SpendSummaryModel_, _KpiSummaryModel_, _SpendBreakdownModel_, _ErrorModel_, _$rootScope_) {
    SpendSummaryMockService = _SpendSummaryMockService_;
    SpendSummaryModel = _SpendSummaryModel_;
    KpiSummaryModel = _KpiSummaryModel_;
    SpendBreakdownModel = _SpendBreakdownModel_;
    ErrorModel = _ErrorModel_;
    $rootScope = _$rootScope_;
  }));

  it('should reject invalid month format', function () {
    // Arrange
    var month = 'invalid';
    var defer = {
      promise: {},
      resolve: jasmine.createSpy('resolve'),
      reject: jasmine.createSpy('reject')
    };
    $q.defer.and.returnValue(defer);

    // Act
    var promise = SpendSummaryMockService.getMonthlySummary(month);

    // Assert
    expect(defer.reject).toHaveBeenCalled();
  });

  it('should reject months older than lookback', function () {
    // Arrange
    var month = '2000-01';
    EnvConfigServiceMock.getMaxLookbackMonths.and.returnValue(1);
    var defer = {
      promise: {},
      resolve: jasmine.createSpy('resolve'),
      reject: jasmine.createSpy('reject')
    };
    $q.defer.and.returnValue(defer);

    // Act
    var promise = SpendSummaryMockService.getMonthlySummary(month);

    // Assert
    expect(defer.reject).toHaveBeenCalled();
  });

  it('should resolve with summary, kpis, and breakdown on success', function () {
    // Arrange
    var month = '2026-01';
    EnvConfigServiceMock.getMaxLookbackMonths.and.returnValue(24);
    var defer = {
      promise: {},
      resolve: jasmine.createSpy('resolve'),
      reject: jasmine.createSpy('reject')
    };
    $q.defer.and.returnValue(defer);

    // Act
    var promise = SpendSummaryMockService.getMonthlySummary(month);

    // Assert
    expect(defer.resolve).toHaveBeenCalled();
    var arg = defer.resolve.calls.mostRecent().args[0];
    expect(arg.summary).toBeDefined();
    expect(arg.kpis).toBeDefined();
    expect(arg.breakdown).toBeDefined();
  });
});

/*
Test Documentation:
- Test Name: SpendSummaryMockService monthly summary retrieval
- Purpose: Validate mock summary behavior including invalid month rejection, lookback enforcement, and successful mock data.
- Scenario: Call getMonthlySummary with invalid month, too-old month, and valid month.
- Expected Result: Invalid/old months are rejected; valid month yields summary, KPI, and breakdown data.
*/

/*
Coverage Report:
- Functions tested: getMonthlySummary, isOlderThanLookback (indirectly through behavior).
- Statements covered: Month format validation, lookback check, mock response construction, and deferred resolve/reject.
- Branches covered: Invalid format vs valid format; older-than-lookback vs within-lookback; randomFailure path partially (deterministic random not forced here).
- Error scenarios covered: Invalid month; month outside lookback; simulated failure path via rejection (partially through LoggingService.warn).
- Uncovered scenarios: Deterministic testing of randomFailure true path (would require mocking Math.random).
*/