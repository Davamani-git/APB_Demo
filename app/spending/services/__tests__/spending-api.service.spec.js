describe('SpendingApiService', function () {
  var SpendingApiService, $http, $q, EnvConfigService, LoggingService, SpendSummaryModel, MetricsModel;
  var $rootScope;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $http = jasmine.createSpyObj('$http', ['']);
    $http.and.callFake(function (config) {
      var deferred = $q.defer();
      $http._lastConfig = config;
      $http._deferred = deferred;
      return deferred.promise;
    });

    $q = angular.injector(['ng']).get('$q');
    EnvConfigService = jasmine.createSpyObj('EnvConfigService', ['getConfig']);
    LoggingService = jasmine.createSpyObj('LoggingService', ['debug', 'error']);

    SpendSummaryModel = function (props) { angular.extend(this, props); };
    MetricsModel = function (props) { angular.extend(this, props); };

    EnvConfigService.getConfig.and.returnValue({
      apiBaseUrl: 'https://api.example.com/v1',
      apiTimeoutMs: 10000
    });

    $provide.value('$http', $http);
    $provide.value('$q', $q);
    $provide.value('EnvConfigService', EnvConfigService);
    $provide.value('LoggingService', LoggingService);
    $provide.value('SpendSummaryModel', SpendSummaryModel);
    $provide.value('MetricsModel', MetricsModel);
  }));

  beforeEach(inject(function (_SpendingApiService_, _$rootScope_) {
    SpendingApiService = _SpendingApiService_;
    $rootScope = _$rootScope_;
  }));

  it('should build correct URL and map response to SpendSummaryModel on success', function () {
    // Arrange
    var cardId = 'CARD-12345';
    var month = '2025-01';

    var promise = SpendingApiService.getMonthlySummary(cardId, month);

    // Simulate HTTP success
    var rawResponse = {
      data: {
        cardId: cardId,
        month: month,
        currency: 'USD',
        metrics: { totalSpend: 100, transactionCount: 2, averageTransactionAmount: 50 },
        breakdown: { Groceries: 60, Restaurants: 40 },
        lastUpdated: '2025-02-01T12:00:00Z'
      }
    };

    $http._deferred.resolve(rawResponse);
    $rootScope.$apply();

    var result;
    promise.then(function (summary) { result = summary; });
    $rootScope.$apply();

    // Assert URL and config
    expect($http._lastConfig.url).toBe('https://api.example.com/v1/spend-summary');
    expect($http._lastConfig.method).toBe('GET');
    expect($http._lastConfig.params.cardId).toBe(cardId);
    expect($http._lastConfig.params.month).toBe(month);
    expect($http._lastConfig.timeout).toBe(10000);

    // Assert mapped model
    expect(result instanceof SpendSummaryModel).toBe(true);
    expect(result.metrics instanceof MetricsModel).toBe(true);
    expect(result.cardId).toBe(cardId);
    expect(result.month).toBe(month);
    expect(result.currency).toBe('USD');
  });

  it('should strip trailing slash from apiBaseUrl when building URL', function () {
    // Arrange
    EnvConfigService.getConfig.and.returnValue({ apiBaseUrl: 'https://api.example.com/v1/', apiTimeoutMs: 10000 });

    SpendingApiService.getMonthlySummary('CARD-1', '2025-01');

    // Assert
    expect($http._lastConfig.url).toBe('https://api.example.com/v1/spend-summary');
  });

  it('should propagate error from $http via rejected promise', function () {
    // Arrange
    var cardId = 'CARD-12345';
    var month = '2025-01';

    var promise = SpendingApiService.getMonthlySummary(cardId, month);

    var errorModel = { code: 'UNKNOWN_ERROR', message: 'Server error' };

    // Simulate HTTP failure
    $http._deferred.reject(errorModel);
    $rootScope.$apply();

    var rejection;
    promise.catch(function (err) { rejection = err; });
    $rootScope.$apply();

    // Assert
    expect(rejection).toBe(errorModel);
  });
});

/*
Test Documentation:
- Test Name: SpendingApiService getMonthlySummary
- Purpose: Validate API URL construction, config usage, response mapping, and error propagation.
- Scenario: Successful API call with trailing and non-trailing slash base URLs, and failed API call.
- Expected Result: URL is normalized; HTTP config uses provided cardId/month/timeout; response mapped to SpendSummaryModel with MetricsModel; errors propagated as-is.
*/

/*
Coverage Report:
- Functions tested: getMonthlySummary, internal _buildUrl, internal _mapResponseToModel.
- Statements covered: Config retrieval; URL building; $http invocation; promise resolve/reject; MetricsModel and SpendSummaryModel construction.
- Branches covered: apiBaseUrl trailing slash vs not; successful vs failed HTTP call.
- Error scenarios covered: HTTP failure resulting in promise rejection.
- Uncovered scenarios: Non-object response.data; unexpected MetricsModel or SpendSummaryModel constructor failures.
*/