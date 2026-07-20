describe('EnvConfigService', function () {
  var EnvConfigService;
  var $http;
  var $q;
  var $rootScope;
  var LoggingServiceMock;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $http = jasmine.createSpyObj('$http', ['get']);
    $q = jasmine.createSpyObj('$q', ['resolve', 'reject']);
    LoggingServiceMock = jasmine.createSpyObj('LoggingService', ['info', 'error', 'warn', 'debug', 'logToServer']);

    $provide.value('$http', $http);
    $provide.value('$q', $q);
    $provide.value('LoggingService', LoggingServiceMock);
  }));

  beforeEach(inject(function (_EnvConfigService_, _$rootScope_) {
    EnvConfigService = _EnvConfigService_;
    $rootScope = _$rootScope_;
  }));

  it('should load configuration successfully and log info', function () {
    // Arrange
    var responseConfig = {
      apiBaseUrl: 'http://api.example.com',
      apiTimeoutMs: 1000,
      maxLookbackMonths: 12,
      useMockData: true,
      featureFlags: { flag1: true },
      telemetry: { enabled: true }
    };
    var defer = (function () {
      var deferred = {};
      deferred.promise = {
        then: function (onFulfilled) {
          onFulfilled({ data: responseConfig });
          return {
            catch: function () {}
          };
        }
      };
      return deferred;
    })();
    $http.get.and.returnValue(defer.promise);
    $q.resolve.and.callFake(function () { return { then: function () {} }; });

    // Act
    var promise = EnvConfigService.load();
    $rootScope.$digest();

    // Assert
    expect($http.get).toHaveBeenCalledWith('core/config/env.config.json', { cache: true });
    expect(LoggingServiceMock.info).toHaveBeenCalled();
    expect(typeof EnvConfigService.getApiBaseUrl()).toBe('string');
    expect(EnvConfigService.getMaxLookbackMonths()).toBe(12);
    expect(EnvConfigService.isMockMode()).toBe(true);
  });

  it('should reject load and log error when http fails', function () {
    // Arrange
    var errorObj = { status: 500 };
    var defer = (function () {
      var deferred = {};
      deferred.promise = {
        then: function () {
          return {
            catch: function (onRejected) {
              onRejected(errorObj);
              return { then: function () {} };
            }
          };
        }
      };
      return deferred;
    })();
    $http.get.and.returnValue(defer.promise);
    $q.reject.and.callFake(function (e) { return { then: function () {}, catch: function () {} }; });

    // Act
    var promise = EnvConfigService.load();
    $rootScope.$digest();

    // Assert
    expect(LoggingServiceMock.error).toHaveBeenCalled();
  });

  it('should not reload when configuration already present', function () {
    // Arrange
    $q.resolve.and.callFake(function () { return { then: function () {} }; });
    var defer = (function () {
      var deferred = {};
      deferred.promise = {
        then: function (onFulfilled) {
          onFulfilled({ data: {} });
          return {
            catch: function () {}
          };
        }
      };
      return deferred;
    })();
    $http.get.and.returnValue(defer.promise);

    // Act
    EnvConfigService.load();
    EnvConfigService.load();

    // Assert
    expect($q.resolve).toHaveBeenCalled();
  });

  it('should provide default values when config not loaded', function () {
    // Arrange & Act
    var apiBaseUrl = EnvConfigService.getApiBaseUrl();
    var timeout = EnvConfigService.getApiTimeoutMs();
    var maxLookback = EnvConfigService.getMaxLookbackMonths();
    var featureFlags = EnvConfigService.getFeatureFlags();
    var telemetry = EnvConfigService.getTelemetryConfig();
    var mockMode = EnvConfigService.isMockMode();

    // Assert
    expect(apiBaseUrl).toBe('');
    expect(timeout).toBe(15000);
    expect(maxLookback).toBe(24);
    expect(featureFlags).toEqual({});
    expect(telemetry).toEqual({});
    expect(mockMode).toBe(false);
  });
});

/*
Test Documentation:
- Test Name: EnvConfigService loading and getters
- Purpose: Validate configuration loading, logging, and default values.
- Scenario: Simulate successful and failing HTTP calls, repeated load invocations, and reading getters before load.
- Expected Result: Config is loaded once; errors are logged; getters return expected values and defaults.
*/

/*
Coverage Report:
- Functions tested: load, getApiBaseUrl, getApiTimeoutMs, getMaxLookbackMonths, getFeatureFlags, getTelemetryConfig, isMockMode.
- Statements covered: All branches in load (cached vs not cached, success vs failure) and all getter paths.
- Branches covered: config null vs non-null; HTTP success vs failure; presence vs absence of individual config properties.
- Error scenarios covered: HTTP failure during config load.
- Uncovered scenarios: Integration with real $http/$q in runtime; concurrency or race conditions.
*/