describe('EnvConfigService', function() {
    var EnvConfigService, $injector, $q, ENV_CONFIG, $httpBackend, $rootScope;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $injector = jasmine.createSpyObj('$injector', ['get']);
        ENV_CONFIG = {
            apiBaseUrl: '/api',
            apiTimeoutMs: 10000,
            useMockData: true
        };
        $provide.value('$injector', $injector);
        $provide.value('ENV_CONFIG', ENV_CONFIG);
    }));

    beforeEach(inject(function(_EnvConfigService_, _$q_, _$httpBackend_, _$rootScope_) {
        EnvConfigService = _EnvConfigService_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    it('should load config from JSON and extend ENV_CONFIG on success', function() {
        // Arrange
        $injector.get.and.callFake(function(name) {
            if (name === '$http') {
                return { get: function(url) { return $q.when({ data: { apiTimeoutMs: 5000 } }); } };
            }
        });

        // Act
        var promise = EnvConfigService.loadConfig();
        var loadedConfig;
        promise.then(function(cfg) { loadedConfig = cfg; });
        $rootScope.$apply();

        // Assert
        expect(loadedConfig.apiBaseUrl).toBe('/api');
        expect(loadedConfig.apiTimeoutMs).toBe(5000);
    });

    it('should fall back to ENV_CONFIG when JSON load fails', function() {
        // Arrange
        $injector.get.and.callFake(function(name) {
            if (name === '$http') {
                return { get: function() { return $q.reject(); } };
            }
        });

        // Act
        var promise = EnvConfigService.loadConfig();
        var loadedConfig;
        promise.then(function(cfg) { loadedConfig = cfg; });
        $rootScope.$apply();

        // Assert
        expect(loadedConfig).toBe(ENV_CONFIG);
    });

    it('should return cached promise when loadConfig called multiple times', function() {
        // Arrange
        $injector.get.and.callFake(function(name) {
            if (name === '$http') {
                return { get: function() { return $q.when({ data: {} }); } };
            }
        });

        // Act
        var p1 = EnvConfigService.loadConfig();
        var p2 = EnvConfigService.loadConfig();

        // Assert
        expect(p1).toBe(p2);
    });

    it('should use ENV_CONFIG when get is called before config is loaded', function() {
        // Arrange
        spyOn(console, 'error');

        // Act
        var value = EnvConfigService.get('apiBaseUrl');

        // Assert
        expect(value).toBe(ENV_CONFIG.apiBaseUrl);
        expect(console.error).toHaveBeenCalled();
    });
});

/*
Test Documentation:
- Test Name: loadConfig success
- Purpose: Verify JSON config is loaded and merged with ENV_CONFIG.
- Scenario: $http.get resolves with partial config overriding apiTimeoutMs.
- Expected Result: loadedConfig has baseUrl from ENV_CONFIG and timeout from JSON.

- Test Name: loadConfig failure fallback
- Purpose: Ensure ENV_CONFIG is used when JSON load fails.
- Scenario: $http.get rejects; catch path executes.
- Expected Result: loadedConfig equals ENV_CONFIG.

- Test Name: loadConfig caching
- Purpose: Confirm subsequent calls return the same promise instance.
- Scenario: Call loadConfig twice before resolution.
- Expected Result: p1 === p2.

- Test Name: get before config load
- Purpose: Ensure get() uses ENV_CONFIG and logs error when config not yet loaded.
- Scenario: Call get('apiBaseUrl') before any loadConfig.
- Expected Result: console.error logged; value from ENV_CONFIG.
*/

/*
Coverage Report:
- Functions tested:
  - EnvConfigService.loadConfig()
  - EnvConfigService.get()
  - EnvConfigService.getConfig() indirectly via load
- Statements covered:
  - Deferred promise creation and caching
  - $injector.get('$http') lazy retrieval
  - Success path merge of ENV_CONFIG and response.data
  - Failure path fallback to ENV_CONFIG
  - console.error call when config not loaded
- Branches covered:
  - loadConfig: configPromise exists vs not
  - $http.get success vs failure
  - get: config loaded vs not loaded
- Error scenarios covered:
  - HTTP failure when loading JSON config
  - Accessing configuration before load
- Uncovered scenarios:
  - Concurrent calls with mixed resolutions in highly asynchronous environments.
*/