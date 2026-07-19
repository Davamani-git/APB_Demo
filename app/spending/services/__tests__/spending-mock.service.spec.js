describe('SpendingMockService', function () {
  var SpendingMockService, $http, $q, $timeout, EnvConfigService, LoggingService, SpendSummaryModel, MetricsModel, ErrorModel;
  var $rootScope;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $q = angular.injector(['ng']).get('$q');
    $timeout = jasmine.createSpy('$timeout').and.callFake(function (fn) { fn(); });
    $http = jasmine.createSpyObj('$http', ['get']);
    EnvConfigService = jasmine.createSpyObj('EnvConfigService', ['getConfig']);
    LoggingService = jasmine.createSpyObj('LoggingService', ['error']);

    SpendSummaryModel = function (props) { angular.extend(this, props); };
    MetricsModel = function (props) { angular.extend(this, props); };
    ErrorModel = function (props) { angular.extend(this, props); };

    $provide.value('$q', $q);
    $provide.value('$timeout', $timeout);
    $provide.value('$http', $http);
    $provide.value('EnvConfigService', EnvConfigService);
    $provide.value('LoggingService', LoggingService);
    $provide.value('SpendSummaryModel', SpendSummaryModel);
    $provide.value('MetricsModel', MetricsModel);
    $provide.value('ErrorModel', ErrorModel);
  }));

  beforeEach(inject(function (_SpendingMockService_, _$rootScope_) {
    SpendingMockService = _SpendingMockService_;
    $rootScope = _$rootScope_;
  }));

  it('should load mock data once and resolve summary on match', function () {
    // Arrange
    var cardId = 'CARD-12345';
    var month = '2025-01';

    var mockData = {
      summaries: [
        {
          cardId: cardId,
          month: month,
          currency: 'USD',
          metrics: { totalSpend: 123.45, transactionCount: 5, averageTransactionAmount: 24.69 },
          breakdown: { Groceries: 50, Restaurants: 73.45 },
          lastUpdated: '2025-02-01T12:00:00Z'
        }
      ]
    };

    var loadDeferred = $q.defer();
    $http.get.and.returnValue(loadDeferred.promise);

    var promise = SpendingMockService.getMonthlySummary(cardId, month);

    // Resolve mock data
    loadDeferred.resolve({ data: mockData });
    $rootScope.$apply();

    var result;
    promise.then(function (summary) { result = summary; });
    $rootScope.$apply();

    // Assert
    expect($http.get).toHaveBeenCalledWith('mocks/api/spend-summary.mock.json');
    expect(result instanceof SpendSummaryModel).toBe(true);
    expect(result.metrics instanceof MetricsModel).toBe(true);
    expect(result.cardId).toBe(cardId);
    expect(result.month).toBe(month);

    // Second call should reuse _mockLoadPromise
    var secondPromise = SpendingMockService.getMonthlySummary(cardId, month);
    expect($http.get.calls.count()).toBe(1);
  });

  it('should reject with SUMMARY_NOT_FOUND when no matching summary exists', function () {
    // Arrange
    var mockData = { summaries: [] };
    var loadDeferred = $q.defer();
    $http.get.and.returnValue(loadDeferred.promise);

    var promise = SpendingMockService.getMonthlySummary('CARD-1', '2025-01');

    loadDeferred.resolve({ data: mockData });
    $rootScope.$apply();

    var rejection;
    promise.catch(function (err) { rejection = err; });
    $rootScope.$apply();

    // Assert
    expect(rejection.code).toBe('SUMMARY_NOT_FOUND');
    expect(rejection.retryable).toBe(false);
    expect(rejection.httpStatus).toBe(404);
  });

  it('should reject with MOCK_LOAD_FAILED when mock data fails to load', function () {
    // Arrange
    var loadDeferred = $q.defer();
    $http.get.and.returnValue(loadDeferred.promise);

    var promise = SpendingMockService.getMonthlySummary('CARD-1', '2025-01');

    loadDeferred.reject({ status: 500 });
    $rootScope.$apply();

    var rejection;
    promise.catch(function (err) { rejection = err; });
    $rootScope.$apply();

    // Assert
    expect(LoggingService.error).toHaveBeenCalled();
    expect(rejection.code).toBe('MOCK_LOAD_FAILED');
    expect(rejection.retryable).toBe(false);
    expect(rejection.httpStatus).toBe(500);
  });
});

/*
Test Documentation:
- Test Name: SpendingMockService getMonthlySummary
- Purpose: Validate mock data loading, caching, summary matching, and error behaviors.
- Scenario: Successful match with cached data, missing summary, and mock data load failure.
- Expected Result: Mock data loaded once; summary mapped to SpendSummaryModel with MetricsModel on match; appropriate ErrorModel returned for missing summary and load failure.
*/

/*
Coverage Report:
- Functions tested: getMonthlySummary, _ensureMockDataLoaded, _mapMockToModel.
- Statements covered: Mock data loading HTTP call; matching summaries; timeout-based delayed resolution/rejection; error logging; ErrorModel construction.
- Branches covered: _mockLoadPromise cached vs not; match found vs not found; mock load success vs failure.
- Error scenarios covered: No matching summary; mock data HTTP failure.
- Uncovered scenarios: Extremely large mock data sets; timeout delay variations.
*/