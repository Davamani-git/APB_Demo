describe('DashboardService', function() {
    var DashboardService, RestApiService, $q, EnvConfigService, $rootScope;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        RestApiService = jasmine.createSpyObj('RestApiService', ['get']);
        EnvConfigService = jasmine.createSpyObj('EnvConfigService', ['get']);
        $provide.value('RestApiService', RestApiService);
        $provide.value('EnvConfigService', EnvConfigService);
    }));

    beforeEach(inject(function(_DashboardService_, _$q_, _$rootScope_) {
        DashboardService = _DashboardService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('should use DashboardMockData when useMockData is true', function() {
        // Arrange
        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'useMockData') return true;
            return null;
        });
        spyOn(window.DashboardMockData, 'getSummary').and.returnValue({ summary: {} });

        // Act
        var promise = DashboardService.getDashboardSummary();
        var result;
        promise.then(function(data) { result = data; });
        $rootScope.$apply();

        // Assert
        expect(window.DashboardMockData.getSummary).toHaveBeenCalled();
        expect(result.summary).toBeDefined();
        expect(RestApiService.get).not.toHaveBeenCalled();
    });

    it('should call RestApiService.get when useMockData is false', function() {
        // Arrange
        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'useMockData') return false;
            return null;
        });
        RestApiService.get.and.returnValue($q.when({ summary: { totalMonthlySpend: 10 } }));

        // Act
        var promise = DashboardService.getDashboardSummary();
        var result;
        promise.then(function(data) { result = data; });
        $rootScope.$apply();

        // Assert
        expect(RestApiService.get).toHaveBeenCalledWith('/dashboard/summary');
        expect(result.summary.totalMonthlySpend).toBe(10);
    });
});

/*
Test Documentation:
- Test Name: DashboardService mock data path
- Purpose: Verify service uses window.DashboardMockData when mock mode enabled.
- Scenario: EnvConfigService.get('useMockData') returns true.
- Expected Result: RestApiService.get not called; data from DashboardMockData.getSummary.

- Test Name: DashboardService real API path
- Purpose: Confirm service calls RestApiService.get when mock mode disabled.
- Scenario: EnvConfigService.get('useMockData') returns false.
- Expected Result: RestApiService.get called with '/dashboard/summary'; data propagated.
*/

/*
Coverage Report:
- Functions tested:
  - DashboardService.getDashboardSummary()
- Statements covered:
  - useMockData branch, mock and real API paths
- Branches covered:
  - useMockData true vs false
- Error scenarios covered:
  - None
- Uncovered scenarios:
  - Handling of missing or malformed data from API.
*/