describe('EnvConfigService', function() {
    var EnvConfigService;
    var $q, $rootScope, $injector;
    var ENV_CONFIG;
    var $httpMock;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $httpMock = jasmine.createSpyObj('$http', ['get']);
        $provide.value('$http', $httpMock);
    }));

    beforeEach(inject(function(_EnvConfigService_, _$q_, _$rootScope_, _$injector_, _ENV_CONFIG_) {
        EnvConfigService = _EnvConfigService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $injector = _$injector_;
        ENV_CONFIG = _ENV_CONFIG_;

        spyOn($injector, 'get').and.callFake(function(token) {
            if (token === '$http') {
                return $httpMock;
            }
            return null;
        });
    }));

    function flushPromises() {
        $rootScope.$apply();
    }

    it('should resolve immediately with ENV_CONFIG when already loaded', function() {
        // Arrange
        var firstResponse = { data: { apiBaseUrl: '/api/test' } };
        var deferred = $q.defer();
        $httpMock.get.and.returnValue(deferred.promise);

        // Act: first load to mark as loaded
        var firstPromise = EnvConfigService.loadConfig();
        deferred.resolve(firstResponse);
        flushPromises();

        // Act: second load should resolve immediately using $q.resolve
        var secondPromise = EnvConfigService.loadConfig();

        // Assert
        var resolvedValue;
        secondPromise.then(function(config) {
            resolvedValue = config;
        });
        flushPromises();
        expect(resolvedValue).toBe(ENV_CONFIG);
    });

    it('should load configuration via $http and extend ENV_CONFIG on success', function() {
        // Arrange
        var responseData = { apiBaseUrl: '/api/test', useMockData: false };
        var deferred = $q.defer();
        $httpMock.get.and.returnValue(deferred.promise);

        // Act
        var promise = EnvConfigService.loadConfig();
        deferred.resolve({ data: responseData });
        flushPromises();

        // Assert
        var resolvedConfig;
        promise.then(function(config) {
            resolvedConfig = config;
        });
        flushPromises();
        expect($httpMock.get).toHaveBeenCalledWith('src/app/config/env.default.json');
        expect(resolvedConfig.apiBaseUrl).toBe('/api/test');
        expect(resolvedConfig.useMockData).toBe(false);
        expect(EnvConfigService.isLoaded()).toBe(true);
    });

    it('should handle response without data by resolving with existing ENV_CONFIG', function() {
        // Arrange
        var deferred = $q.defer();
        $httpMock.get.and.returnValue(deferred.promise);

        // Act
        var promise = EnvConfigService.loadConfig();
        deferred.resolve({});
        flushPromises();

        // Assert
        var resolvedConfig;
        promise.then(function(config) {
            resolvedConfig = config;
        });
        flushPromises();
        expect(resolvedConfig).toBe(ENV_CONFIG);
        expect(EnvConfigService.isLoaded()).toBe(true);
    });

    it('should resolve with ENV_CONFIG when $http.get fails', function() {
        // Arrange
        var deferred = $q.defer();
        $httpMock.get.and.returnValue(deferred.promise);

        // Act
        var promise = EnvConfigService.loadConfig();
        deferred.reject(new Error('network error'));
        flushPromises();

        // Assert
        var resolvedConfig;
        promise.then(function(config) {
            resolvedConfig = config;
        });
        flushPromises();
        expect(resolvedConfig).toBe(ENV_CONFIG);
        expect(EnvConfigService.isLoaded()).toBe(true);
    });

    it('should return isLoaded false before configuration is loaded', function() {
        // Arrange / Act / Assert
        expect(EnvConfigService.isLoaded()).toBe(false);
    });
});

/*
Test Documentation:
- Test Name: Immediate resolve when already loaded
- Purpose: Ensure subsequent calls to loadConfig return ENV_CONFIG via $q.resolve once loaded.
- Scenario: Call loadConfig, resolve initial HTTP request, then call loadConfig again.
- Expected Result: Second promise resolves immediately with ENV_CONFIG.

- Test Name: Successful config load and extension
- Purpose: Verify that ENV_CONFIG is extended with remote data on successful HTTP response.
- Scenario: $http.get resolves with response.data containing overrides.
- Expected Result: ENV_CONFIG reflects new values, isLoaded() returns true.

- Test Name: Response without data handling
- Purpose: Confirm robustness when HTTP response does not contain a data property.
- Scenario: $http.get resolves with an empty object.
- Expected Result: ENV_CONFIG remains unchanged but isLoaded() becomes true.

- Test Name: HTTP failure handling
- Purpose: Ensure loadConfig gracefully handles rejected HTTP promises.
- Scenario: $http.get rejects with an error.
- Expected Result: Promise resolves with ENV_CONFIG, isLoaded() returns true.

- Test Name: Initial isLoaded state
- Purpose: Validate initial state before any loadConfig calls.
- Scenario: Immediately call isLoaded().
- Expected Result: Returns false.
*/

/*
Coverage Report:
- Functions tested:
  - EnvConfigService.loadConfig
  - EnvConfigService.isLoaded
- Statements covered:
  - Early return when configLoaded is true
  - Creation and resolution of deferred promises
  - $injector.get('$http') call
  - Success path including angular.extend
  - Catch path resolving ENV_CONFIG
- Branches covered:
  - configLoaded true vs false
  - response.data present vs missing
  - HTTP success vs failure
- Error scenarios covered:
  - Network/HTTP failure
  - Missing data in response
- Uncovered scenarios:
  - Non-standard $injector.get behavior
  - Concurrent calls to loadConfig before first HTTP completes
*/