describe('AnalyticsService', function() {
    var AnalyticsService, RestApiService, $q, EnvConfigService, $rootScope;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        RestApiService = jasmine.createSpyObj('RestApiService', ['get']);
        EnvConfigService = jasmine.createSpyObj('EnvConfigService', ['get']);
        $provide.value('RestApiService', RestApiService);
        $provide.value('EnvConfigService', EnvConfigService);
    }));

    beforeEach(inject(function(_AnalyticsService_, _$q_, _$rootScope_) {
        AnalyticsService = _AnalyticsService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('should use mock data when useMockData is true', function() {
        // Arrange
        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'useMockData') return true;
            return null;
        });
        spyOn(window.AnalyticsMockData, 'getAnalytics').and.returnValue({ categoryWise: {} });

        // Act
        var promise = AnalyticsService.getSpendingAnalytics({});
        var result;
        promise.then(function(data) { result = data; });
        $rootScope.$apply();

        // Assert
        expect(window.AnalyticsMockData.getAnalytics).toHaveBeenCalled();
        expect(result.categoryWise).toBeDefined();
        expect(RestApiService.get).not.toHaveBeenCalled();
    });

    it('should call RestApiService when useMockData is false', function() {
        // Arrange
        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'useMockData') return false;
            return null;
        });
        RestApiService.get.and.returnValue($q.when({}));

        // Act
        var promise = AnalyticsService.getSpendingAnalytics({ cardIds: [] });
        var result;
        promise.then(function(data) { result = data; });
        $rootScope.$apply();

        // Assert
        expect(RestApiService.get).toHaveBeenCalledWith('/analytics/spending', { params: { cardIds: [] } });
    });
});

/*
Test Documentation:
- Test Name: AnalyticsService mock data path
- Purpose: Verify service uses window.AnalyticsMockData when useMockData config is true.
- Scenario: EnvConfigService.get('useMockData') returns true; mock getAnalytics spy returns data.
- Expected Result: RestApiService.get not called; returned data equals mock analytics.

- Test Name: AnalyticsService real API path
- Purpose: Confirm service delegates to RestApiService when useMockData is false.
- Scenario: EnvConfigService.get('useMockData') returns false.
- Expected Result: RestApiService.get called with /analytics/spending and params.
*/

/*
Coverage Report:
- Functions tested:
  - AnalyticsService.getSpendingAnalytics()
- Statements covered:
  - EnvConfigService.get('useMockData') branch
  - Mock path using $q and window.AnalyticsMockData.getAnalytics
  - API path using RestApiService.get
- Branches covered:
  - useMockData true vs false
- Error scenarios covered:
  - None (service simply forwards/retrieves data; error handling at caller side)
- Uncovered scenarios:
  - Behavior when window.AnalyticsMockData is undefined.
*/