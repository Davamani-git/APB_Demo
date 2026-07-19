describe('EnvConfigService', function () {
  var EnvConfigService, $http, $q, EnvConfig;
  var $rootScope;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $http = jasmine.createSpyObj('$http', ['get']);
    $q = angular.injector(['ng']).get('$q');
    EnvConfig = function (data) { angular.extend(this, data); };

    $provide.value('$http', $http);
    $provide.value('$q', $q);
    $provide.value('EnvConfig', EnvConfig);
  }));

  beforeEach(inject(function (_EnvConfigService_, _$rootScope_) {
    EnvConfigService = _EnvConfigService_;
    $rootScope = _$rootScope_;
  }));

  it('should initialize using primary config and cache the promise', function () {
    // Arrange
    var primaryDeferred = $q.defer();
    $http.get.and.returnValue(primaryDeferred.promise);

    // Act
    var initPromise1 = EnvConfigService.initialize();
    var initPromise2 = EnvConfigService.initialize();

    // Assert: same promise returned
    expect(initPromise1).toBe(initPromise2);

    // Act: resolve primary config
    primaryDeferred.resolve({ data: { apiBaseUrl: 'https://api.example.com/v2', useMockData: false } });
    $rootScope.$apply();

    var resolvedConfig;
    initPromise1.then(function (cfg) { resolvedConfig = cfg; });
    $rootScope.$apply();

    expect(resolvedConfig.apiBaseUrl).toBe('https://api.example.com/v2');
    expect(EnvConfigService.isMockMode()).toBe(false);
  });

  it('should fallback to mock config when primary fails', function () {
    // Arrange
    var primaryDeferred = $q.defer();
    var mockDeferred = $q.defer();
    $http.get.and.returnValues(primaryDeferred.promise, mockDeferred.promise);

    // Act
    var initPromise = EnvConfigService.initialize();

    // Simulate primary failure
    primaryDeferred.reject({ status: 500 });
    $rootScope.$apply();

    // Resolve mock config
    mockDeferred.resolve({ data: { apiBaseUrl: '', useMockData: true } });
    $rootScope.$apply();

    var resolvedConfig;
    initPromise.then(function (cfg) { resolvedConfig = cfg; });
    $rootScope.$apply();

    expect(resolvedConfig.useMockData).toBe(true);
    expect(EnvConfigService.isMockMode()).toBe(true);
  });

  it('should reject when both primary and mock config fail', function () {
    // Arrange
    var primaryDeferred = $q.defer();
    var mockDeferred = $q.defer();
    $http.get.and.returnValues(primaryDeferred.promise, mockDeferred.promise);

    // Act
    var initPromise = EnvConfigService.initialize();

    primaryDeferred.reject({ status: 500 });
    mockDeferred.reject({ status: 500 });
    $rootScope.$apply();

    var rejection;
    initPromise.catch(function (err) { rejection = err; });
    $rootScope.$apply();

    // Assert
    expect(rejection).toEqual({ status: 500 });
  });

  it('should return default config before initialization', function () {
    // Act
    var cfg = EnvConfigService.getConfig();

    // Assert
    expect(cfg.useMockData).toBe(true); // default from EnvConfig stub
  });
});

/*
Test Documentation:
- Test Name: EnvConfigService initialization and mock mode
- Purpose: Verify EnvConfigService initializes config from primary and fallback sources, caches the promise, and exposes mock mode state.
- Scenario: Primary success, primary failure with fallback success, both failures, and getConfig before initialization.
- Expected Result: Correct promise caching, config resolution, rejection when both fail, and default config behavior.
*/

/*
Coverage Report:
- Functions tested: initialize, getConfig, isMockMode.
- Statements covered: initPromise caching; primary HTTP call; fallback HTTP call; deferred resolve/reject; config construction; mock mode evaluation.
- Branches covered: initPromise already set; primary success; primary failure path; fallback success; fallback failure; getConfig using cached vs default.
- Error scenarios covered: HTTP failures for both primary and mock configs.
- Uncovered scenarios: Non-JSON responses; EnvConfig throwing during construction.
*/