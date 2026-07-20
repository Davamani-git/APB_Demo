describe('ConfigService', function() {
    var ConfigService;
    var $q, $rootScope, $injector;
    var ENV_CONFIG;
    var $httpMock;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        ENV_CONFIG = { apiBaseUrl: '/api', apiTimeoutMs: 15000 };
        $httpMock = jasmine.createSpyObj('$http', ['get']);
        $provide.value('ENV_CONFIG', ENV_CONFIG);
        $provide.value('$http', $httpMock);
    }));

    beforeEach(inject(function(_ConfigService_, _$q_, _$rootScope_, _$injector_) {
        ConfigService = _ConfigService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $injector = _$injector_;

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

    it('should return ENV_CONFIG immediately when already loaded', function() {
        // Arrange
        var deferred = $q.defer();
        $httpMock.get.and.returnValue(deferred.promise);
        var firstPromise = ConfigService.loadEnvConfig('dev');
        deferred.resolve({ data: { apiBaseUrl: '/api/dev' } });
        flushPromises();

        // Act
        var secondPromise = ConfigService.loadEnvConfig('dev');

        // Assert
        var resolvedConfig;
        secondPromise.then(function(config) {
            resolvedConfig = config;
        });
        flushPromises();
        expect(resolvedConfig).toBe(ENV_CONFIG);
    });

    it('should load env.dev.json when envName is dev', function() {
        // Arrange
        var deferred = $q.defer();
        $httpMock.get.and.returnValue(deferred.promise);

        // Act
        var promise = ConfigService.loadEnvConfig('dev');
        deferred.resolve({ data: { apiBaseUrl: '/api/dev' } });
        flushPromises();

        // Assert
        expect($httpMock.get).toHaveBeenCalledWith('src/app/config/env.dev.json');
        var resolvedConfig;
        promise.then(function(config) { resolvedConfig = config; });
        flushPromises();
        expect(resolvedConfig.apiBaseUrl).toBe('/api/dev');
        expect(ConfigService.isLoaded()).toBe(true);
    });

    it('should load env.prod.json when envName is prod', function() {
        // Arrange
        var deferred = $q.defer();
        $httpMock.get.and.returnValue(deferred.promise);

        // Act
        var promise = ConfigService.loadEnvConfig('prod');
        deferred.resolve({ data: { apiBaseUrl: '/api/prod' } });
        flushPromises();

        // Assert
        expect($httpMock.get).toHaveBeenCalledWith('src/app/config/env.prod.json');
        var resolvedConfig;
        promise.then(function(config) { resolvedConfig = config; });
        flushPromises();
        expect(resolvedConfig.apiBaseUrl).toBe('/api/prod');
        expect(ConfigService.isLoaded()).toBe(true);
    });

    it('should load env.default.json when envName is neither dev nor prod', function() {
        // Arrange
        var deferred = $q.defer();
        $httpMock.get.and.returnValue(deferred.promise);

        // Act
        var promise = ConfigService.loadEnvConfig('other');
        deferred.resolve({ data: { apiBaseUrl: '/api/other' } });
        flushPromises();

        // Assert
        expect($httpMock.get).toHaveBeenCalledWith('src/app/config/env.default.json');
        var resolvedConfig;
        promise.then(function(config) { resolvedConfig = config; });
        flushPromises();
        expect(resolvedConfig.apiBaseUrl).toBe('/api/other');
        expect(ConfigService.isLoaded()).toBe(true);
    });

    it('should resolve with ENV_CONFIG when $http.get fails', function() {
        // Arrange
        var deferred = $q.defer();
        $httpMock.get.and.returnValue(deferred.promise);

        // Act
        var promise = ConfigService.loadEnvConfig('dev');
        deferred.reject(new Error('network error'));
        flushPromises();

        // Assert
        var resolvedConfig;
        promise.then(function(config) { resolvedConfig = config; });
        flushPromises();
        expect(resolvedConfig).toBe(ENV_CONFIG);
        expect(ConfigService.isLoaded()).toBe(true);
    });

    it('should report isLoaded false before configuration is loaded', function() {
        // Arrange / Act / Assert
        expect(ConfigService.isLoaded()).toBe(false);
    });
});

/*
Test Documentation:
- Test Name: Immediate resolve when already loaded
- Purpose: Ensure subsequent calls to loadEnvConfig return ENV_CONFIG via $q.resolve once loaded.
- Scenario: Call loadEnvConfig, resolve initial HTTP request, then call loadEnvConfig again.
- Expected Result: Second promise resolves immediately with ENV_CONFIG.

- Test Name: Load dev environment config
- Purpose: Verify correct file selection when envName='dev'.
- Scenario: Call loadEnvConfig('dev').
- Expected Result: $http.get called with 'env.dev.json'; ENV_CONFIG extended; isLoaded true.

- Test Name: Load prod environment config
- Purpose: Verify correct file selection when envName='prod'.
- Scenario: Call loadEnvConfig('prod').
- Expected Result: $http.get called with 'env.prod.json'; ENV_CONFIG extended; isLoaded true.

- Test Name: Load default environment config
- Purpose: Confirm env.default.json used when envName is other value.
- Scenario: Call loadEnvConfig('other').
- Expected Result: $http.get called with 'env.default.json'; ENV_CONFIG extended; isLoaded true.

- Test Name: HTTP failure handling
- Purpose: Ensure loadEnvConfig gracefully handles rejected HTTP promises.
- Scenario: $http.get rejects.
- Expected Result: Promise resolves with ENV_CONFIG; isLoaded true.

- Test Name: Initial isLoaded state
- Purpose: Validate isLoaded before any configuration loading.
- Scenario: Call isLoaded immediately.
- Expected Result: Returns false.
*/

/*
Coverage Report:
- Functions tested:
  - ConfigService.loadEnvConfig
  - ConfigService.isLoaded
- Statements covered:
  - Early return when loaded is true
  - EnvName-based fileName selection
  - $injector.get('$http') and $http.get
  - Success path including angular.extend
  - Catch path resolving ENV_CONFIG
- Branches covered:
  - loaded true vs false
  - envName 'dev' vs 'prod' vs other
  - HTTP success vs failure
- Error scenarios covered:
  - Network/HTTP failure
- Uncovered scenarios:
  - Concurrent calls before first completes
*/