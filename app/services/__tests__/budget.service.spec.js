describe('BudgetService', function() {
    var BudgetService, RestApiService, $q, EnvConfigService, $rootScope;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        RestApiService = jasmine.createSpyObj('RestApiService', ['get']);
        EnvConfigService = jasmine.createSpyObj('EnvConfigService', ['get']);
        $provide.value('RestApiService', RestApiService);
        $provide.value('EnvConfigService', EnvConfigService);
    }));

    beforeEach(inject(function(_BudgetService_, _$q_, _$rootScope_) {
        BudgetService = _BudgetService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('should use BudgetMockData when useMockData is true', function() {
        // Arrange
        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'useMockData') return true;
            return null;
        });
        spyOn(window.BudgetMockData, 'getSummary').and.returnValue({ monthlyBudget: 50000 });

        // Act
        var promise = BudgetService.getBudgetSummary();
        var result;
        promise.then(function(data) { result = data; });
        $rootScope.$apply();

        // Assert
        expect(window.BudgetMockData.getSummary).toHaveBeenCalled();
        expect(result.monthlyBudget).toBe(50000);
        expect(RestApiService.get).not.toHaveBeenCalled();
    });

    it('should call RestApiService when useMockData is false', function() {
        // Arrange
        EnvConfigService.get.and.callFake(function(key) {
            if (key === 'useMockData') return false;
            return null;
        });
        RestApiService.get.and.returnValue($q.when({ monthlyBudget: 10000 }));

        // Act
        var promise = BudgetService.getBudgetSummary();
        var result;
        promise.then(function(data) { result = data; });
        $rootScope.$apply();

        // Assert
        expect(RestApiService.get).toHaveBeenCalledWith('/budget/summary');
        expect(result.monthlyBudget).toBe(10000);
    });
});

/*
Test Documentation:
- Test Name: BudgetService mock data path
- Purpose: Ensure service uses window.BudgetMockData when mock mode enabled.
- Scenario: EnvConfigService.get('useMockData') returns true.
- Expected Result: RestApiService.get not called; data from BudgetMockData.getSummary.

- Test Name: BudgetService real API path
- Purpose: Confirm service calls RestApiService.get when mock mode disabled.
- Scenario: EnvConfigService.get('useMockData') returns false.
- Expected Result: RestApiService.get called with '/budget/summary'; returned data propagated.
*/

/*
Coverage Report:
- Functions tested:
  - BudgetService.getBudgetSummary()
- Statements covered:
  - useMockData configuration branch
  - Mock path using window.BudgetMockData and $q
  - API path calling RestApiService.get
- Branches covered:
  - useMockData true vs false
- Error scenarios covered:
  - None (service delegates logic)
- Uncovered scenarios:
  - Undefined window.BudgetMockData behavior.
*/