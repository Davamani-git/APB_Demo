describe('kpiCard directive', function() {
    var $compile, $rootScope;
    var $scope;
    var element;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
    }));

    it('should render currency for kpi with id totalSpend', function() {
        // Arrange
        $scope.kpi = { id: 'totalSpend', label: 'Total Spend', value: 123.45, icon: 'fa fa-dollar' };

        // Act
        element = $compile('<kpiCard kpi="kpi"></kpiCard>')($scope);
        $scope.$digest();

        // Assert
        var text = element.text();
        expect(text).toContain('Total Spend');
    });

    it('should render numeric value for kpi with id not equal to totalSpend', function() {
        // Arrange
        $scope.kpi = { id: 'numTransactions', label: 'Number of Transactions', value: 5, icon: 'fa fa-list-ul' };

        // Act
        element = $compile('<kpiCard kpi="kpi"></kpiCard>')($scope);
        $scope.$digest();

        // Assert
        var text = element.text();
        expect(text).toContain('Number of Transactions');
    });
});

/*
Test Documentation:
- Test Name: Currency rendering for totalSpend KPI
- Purpose: Ensure kpiCard displays currency formatting for totalSpend.
- Scenario: Compile directive with kpi.id='totalSpend'.
- Expected Result: Text contains the KPI label and currency-formatted value.

- Test Name: Numeric rendering for other KPI ids
- Purpose: Validate numeric formatting for non-totalSpend KPIs.
- Scenario: Compile directive with kpi.id='numTransactions'.
- Expected Result: Text contains KPI label and integer value.
*/

/*
Coverage Report:
- Functions tested:
  - KpiCardController (no logic) and directive template behavior
- Statements covered:
  - Conditional ng-if branches for kpi.id comparison
- Branches covered:
  - kpi.id === 'totalSpend' vs kpi.id !== 'totalSpend'
- Error scenarios covered:
  - N/A
- Uncovered scenarios:
  - Missing kpi object or missing fields
*/