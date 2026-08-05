describe('Directive: monthlySpendChart', function() {
  var $compile, $rootScope, TransactionDataServiceMock;

  beforeEach(module('appmrn25.dashboard', function($provide) {
    TransactionDataServiceMock = jasmine.createSpyObj('TransactionDataService', ['buildMonthlySpendSeries']);
    $provide.value('TransactionDataService', TransactionDataServiceMock);
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should build series when summary changes', function() {
    // Arrange
    var scope = $rootScope.$new();
    scope.summary = { monthLabel: 'Jan', monthlySpend: 100, currency: 'INR' };
    TransactionDataServiceMock.buildMonthlySpendSeries.and.returnValue([{ label: 'Jan', value: 100, currency: 'INR' }]);

    var element = $compile('<monthly-spend-chart summary="summary"></monthly-spend-chart>')(scope);

    // Act
    scope.$digest();
    var isoScope = element.isolateScope();

    // Assert
    expect(TransactionDataServiceMock.buildMonthlySpendSeries).toHaveBeenCalledWith(scope.summary);
    expect(isoScope.series.length).toBe(1);
    expect(isoScope.series[0].label).toBe('Jan');
  });

  it('should handle summary becoming null and set series accordingly', function() {
    // Arrange
    var scope = $rootScope.$new();
    scope.summary = { monthLabel: 'Jan', monthlySpend: 100, currency: 'INR' };
    TransactionDataServiceMock.buildMonthlySpendSeries.and.returnValue([]);

    var element = $compile('<monthly-spend-chart summary="summary"></monthly-spend-chart>')(scope);

    // Act
    scope.$digest();
    scope.summary = null;
    scope.$digest();

    var isoScope = element.isolateScope();

    // Assert
    expect(TransactionDataServiceMock.buildMonthlySpendSeries).toHaveBeenCalledWith(null);
    expect(isoScope.series).toEqual([]);
  });
});

/*
Test Documentation:
- Test Name: monthlySpendChart directive behavior
- Purpose: Ensure directive watches summary and populates series via TransactionDataService.
- Scenario: Change summary from valid object to null.
- Expected Result: buildMonthlySpendSeries called with new summary values and null, series set accordingly.
*/

/*
Coverage Report:
- Functions tested: Directive factory and link function behavior (watch on summary).
- Statements covered: $watch callback, series assignment.
- Branches covered: summary non-null vs null transitions.
- Error scenarios covered: None specific; null summary handled by service (mock) returning empty series.
- Uncovered scenarios: Complex watch behavior with deep changes (out of scope).
*/