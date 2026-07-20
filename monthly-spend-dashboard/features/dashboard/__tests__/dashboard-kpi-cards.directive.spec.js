describe('dashboardKpiCards directive and controller', function () {
  var $compile;
  var $rootScope;

  beforeEach(module('app'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should return empty KPI list when kpis input is missing', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.testKpis = null;
    var element = $compile('<dashboard-kpi-cards kpis="testKpis"></dashboard-kpi-cards>')(scope);

    // Act
    scope.$digest();
    var controller = element.controller('dashboardKpiCards');
    var kpiList = controller.getKpiList();

    // Assert
    expect(kpiList).toEqual([]);
  });

  it('should build KPI list when kpis input is present', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.testKpis = {
      totalSpend: 100,
      transactionCount: 10,
      averageTransactionAmount: 10,
      maxTransactionAmount: 50
    };
    var element = $compile('<dashboard-kpi-cards kpis="testKpis"></dashboard-kpi-cards>')(scope);

    // Act
    scope.$digest();
    var controller = element.controller('dashboardKpiCards');
    var kpiList = controller.getKpiList();

    // Assert
    expect(kpiList.length).toBe(4);
    expect(kpiList[0].key).toBe('totalSpend');
    expect(kpiList[1].key).toBe('transactionCount');
    expect(kpiList[2].key).toBe('averageTransactionAmount');
    expect(kpiList[3].key).toBe('maxTransactionAmount');
  });
});

/*
Test Documentation:
- Test Name: dashboardKpiCards directive KPI list behavior
- Purpose: Ensure that KPI cards are generated only when KPI data is provided.
- Scenario: Compile directive with null and valid kpis object.
- Expected Result: getKpiList returns empty array for null kpis and four KPI entries for valid data.
*/

/*
Coverage Report:
- Functions tested: DashboardKpiCardsController.getKpiList.
- Statements covered: Null check and static KPI list construction.
- Branches covered: kpis present vs absent.
- Error scenarios covered: None; null kpis handled by returning empty list.
- Uncovered scenarios: None.
*/