describe('Service: DashboardService', function() {
  var DashboardService, BaseHttpServiceMock, ConfigServiceMock, $q, $rootScope, $cacheFactory;

  beforeEach(module('appmrn25.dashboard', function($provide) {
    BaseHttpServiceMock = jasmine.createSpyObj('BaseHttpService', ['get']);
    ConfigServiceMock = jasmine.createSpyObj('ConfigService', ['getApiBaseUrl']);
    ConfigServiceMock.getApiBaseUrl.and.returnValue('/api/v1/dashboard');

    $provide.value('BaseHttpService', BaseHttpServiceMock);
    $provide.value('ConfigService', ConfigServiceMock);
  }));

  beforeEach(inject(function(_DashboardService_, _$q_, _$rootScope_, _$cacheFactory_) {
    DashboardService = _DashboardService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $cacheFactory = _$cacheFactory_;
  }));

  function flushPromises() {
    $rootScope.$apply();
  }

  it('should fetch overview when cache empty and normalize response', function() {
    // Arrange
    var apiResponse = { data: { totalCreditLimit: 100, totalOutstandingAmount: 50, totalAvailableCredit: 50, monthlySpend: 10, monthLabel: 'Jan', currency: 'USD', asOfTimestamp: '2024', cards: [], isStale: false } };
    var deferred = $q.defer();
    BaseHttpServiceMock.get.and.returnValue(deferred.promise);

    // Act
    var promise = DashboardService.getOverview();
    var result;
    promise.then(function(res) { result = res; });
    deferred.resolve(apiResponse);
    flushPromises();

    // Assert
    expect(BaseHttpServiceMock.get).toHaveBeenCalledWith('/api/v1/dashboard/overview');
    expect(result.summary.totalCreditLimit).toBe(100);
    expect(result.summary.totalOutstandingAmount).toBe(50);
    expect(result.summary.totalAvailableCredit).toBe(50);
    expect(result.summary.monthlySpend).toBe(10);
    expect(result.summary.currency).toBe('USD');
    expect(result.cards).toEqual([]);
    expect(result.isStale).toBe(false);
  });

  it('should return cached overview when available and forceRefresh not set', function() {
    // Arrange
    var payload = { summary: { totalCreditLimit: 1 }, cards: [], isStale: false };
    // prime cache by calling getOverview once
    var deferred = $q.defer();
    BaseHttpServiceMock.get.and.returnValue(deferred.promise);
    var promise1 = DashboardService.getOverview();
    deferred.resolve({ data: { totalCreditLimit: 1, totalOutstandingAmount: 0, totalAvailableCredit: 1, monthlySpend: 0, isStale: false } });
    flushPromises();

    // Act
    var promise2 = DashboardService.getOverview();
    var result;
    promise2.then(function(res) { result = res; });
    flushPromises();

    // Assert
    expect(BaseHttpServiceMock.get.calls.count()).toBe(1);
    expect(result.summary.totalCreditLimit).toBe(payload.summary.totalCreditLimit);
  });

  it('should bypass cache when forceRefresh option is true', function() {
    // Arrange
    var deferred1 = $q.defer();
    BaseHttpServiceMock.get.and.returnValue(deferred1.promise);
    DashboardService.getOverview();
    deferred1.resolve({ data: {} });
    flushPromises();

    var deferred2 = $q.defer();
    BaseHttpServiceMock.get.and.returnValue(deferred2.promise);

    // Act
    var promise = DashboardService.getOverview({ forceRefresh: true });
    deferred2.resolve({ data: {} });
    flushPromises();

    // Assert
    expect(BaseHttpServiceMock.get.calls.count()).toBe(2);
  });

  it('should expose invalidateCache that clears the cache', function() {
    // Arrange
    var deferred = $q.defer();
    BaseHttpServiceMock.get.and.returnValue(deferred.promise);
    DashboardService.getOverview();
    deferred.resolve({ data: {} });
    flushPromises();

    // Act
    DashboardService.invalidateCache();

    // Assert: next call should hit BaseHttpService again
    var deferred2 = $q.defer();
    BaseHttpServiceMock.get.and.returnValue(deferred2.promise);
    DashboardService.getOverview();
    deferred2.resolve({ data: {} });
    flushPromises();

    expect(BaseHttpServiceMock.get.calls.count()).toBe(2);
  });

  describe('toUserMessage', function() {
    it('should return friendly messages for known error codes', function() {
      // Arrange & Act
      var authMsg = DashboardService.toUserMessage({ code: 'AUTH_REQUIRED' });
      var accessMsg = DashboardService.toUserMessage({ code: 'ACCESS_DENIED' });
      var upstreamMsg = DashboardService.toUserMessage({ code: 'UPSTREAM_UNAVAILABLE' });

      // Assert
      expect(authMsg).toMatch(/session has expired/i);
      expect(accessMsg).toMatch(/not authorized/i);
      expect(upstreamMsg).toMatch(/temporarily unavailable/i);
    });

    it('should return generic message for unknown error code or missing code', function() {
      // Arrange & Act
      var unknownMsg = DashboardService.toUserMessage({ code: 'OTHER' });
      var noCodeMsg = DashboardService.toUserMessage({});

      // Assert
      expect(unknownMsg).toMatch(/unexpected error/i);
      expect(noCodeMsg).toMatch(/unexpected error/i);
    });
  });

  it('should normalize overview payload handling invalid values and missing fields', function() {
    // Arrange
    var apiResponse = { data: { totalCreditLimit: -1, totalOutstandingAmount: 'abc', totalAvailableCredit: null, monthlySpend: undefined, cards: 'not-array', isStale: 'truthy' } };
    var deferred = $q.defer();
    BaseHttpServiceMock.get.and.returnValue(deferred.promise);

    // Act
    var promise = DashboardService.getOverview();
    var result;
    promise.then(function(res) { result = res; });
    deferred.resolve(apiResponse);
    flushPromises();

    // Assert
    expect(result.summary.totalCreditLimit).toBe(0);
    expect(result.summary.totalOutstandingAmount).toBe(0);
    expect(result.summary.totalAvailableCredit).toBe(0);
    expect(result.summary.monthlySpend).toBe(0);
    expect(result.cards).toEqual([]);
    expect(result.isStale).toBe(true);
  });
});

/*
Test Documentation:
- Test Name: DashboardService behavior
- Purpose: Validate overview fetching, caching, normalization, and user message generation.
- Scenario: Simulate BaseHttpService.get responses with valid and invalid payloads, test cache behavior and toUserMessage mappings.
- Expected Result: API called with correct URL, responses normalized, cache used and invalidated appropriately, user messages mapped based on error codes.
*/

/*
Coverage Report:
- Functions tested: getOverview, invalidateCache, toUserMessage, internal normalizeOverview and nonNegative via behavior.
- Statements covered: Cache lookup and population, forceRefresh option, URL construction, BaseHttpService.get invocation, response normalization, cache clearing, switch in toUserMessage, nonNegative helper logic, array handling for cards, isStale boolean coercion.
- Branches covered: cache hit vs miss; forceRefresh true vs false; presence vs absence of invalid numeric values; known vs unknown error codes; cards array vs non-array; negative vs positive numeric values.
- Error scenarios covered: Invalid numeric fields, unknown error codes, missing fields.
- Uncovered scenarios: Network-level errors from BaseHttpService.get (assumed covered in BaseHttpService tests).
*/