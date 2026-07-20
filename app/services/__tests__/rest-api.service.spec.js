describe('RestApiService', function() {
    var RestApiService, $http, EnvConfigService, LoggingService, $rootScope, $q;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $http = jasmine.createSpy('http').and.callFake(function(config) {
            var deferred;
            inject(function(_$q_) { deferred = _$q_; });
            var d = deferred.defer();
            d.resolve({ data: { ok: true } });
            return d.promise;
        });
        EnvConfigService = jasmine.createSpyObj('EnvConfigService', ['get']);
        LoggingService = jasmine.createSpyObj('LoggingService', ['info']);

        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'apiBaseUrl') return '/api';
            if (key === 'apiTimeoutMs') return 15000;
            return null;
        });

        $provide.value('$http', $http);
        $provide.value('EnvConfigService', EnvConfigService);
        $provide.value('LoggingService', LoggingService);
    }));

    beforeEach(inject(function(_RestApiService_, _$rootScope_, _$q_) {
        RestApiService = _RestApiService_;
        $rootScope = _$rootScope_;
        $q = _$q_;
    }));

    it('should perform GET request with baseUrl and timeout', function() {
        // Arrange
        var result;

        // Act
        RestApiService.get('/test', { params: { a: 1 } }).then(function(data) {
            result = data;
        });
        $rootScope.$apply();

        // Assert
        expect($http).toHaveBeenCalled();
        var config = $http.calls.mostRecent().args[0];
        expect(config.method).toBe('GET');
        expect(config.url).toBe('/api' + '/test');
        expect(config.timeout).toBe(15000);
        expect(LoggingService.info).toHaveBeenCalled();
        expect(result.ok).toBe(true);
    });

    it('should perform POST request with data', function() {
        // Arrange
        var payload = { x: 1 };

        // Act
        RestApiService.post('/submit', payload, {});
        $rootScope.$apply();

        // Assert
        var config = $http.calls.mostRecent().args[0];
        expect(config.method).toBe('POST');
        expect(config.data).toBe(payload);
        expect(config.url).toBe('/api' + '/submit');
    });
});

/*
Test Documentation:
- Test Name: RestApiService GET
- Purpose: Verify GET builds correct request config and returns response.data.
- Scenario: Call get('/test', {params:{a:1}}).
- Expected Result: $http called with method 'GET', url '/api/test', timeout 15000, LoggingService.info invoked, resolved data.ok true.

- Test Name: RestApiService POST
- Purpose: Confirm POST builds request with method 'POST' and includes payload.
- Scenario: Call post('/submit', payload).
- Expected Result: $http called with POST, config.data equals payload, url '/api/submit'.
*/

/*
Coverage Report:
- Functions tested:
  - RestApiService.get()
  - RestApiService.post()
  - Internal createRequest() via both methods
- Statements covered:
  - Retrieval of apiBaseUrl and apiTimeoutMs from EnvConfigService
  - LoggingService.info of API request
  - Configuration of method, url, timeout, data
  - Returning response.data from $http
- Branches covered:
  - Presence vs absence of data for GET vs POST
- Error scenarios covered:
  - None (error handling deferred to callers)
- Uncovered scenarios:
  - Behavior when $http rejects.
*/