describe('dashboardSummary directive and controller', function () {
  var $compile;
  var $rootScope;

  beforeEach(module('app'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should return empty string when summary is missing', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.testSummary = null;
    var element = $compile('<dashboard-summary summary="testSummary"></dashboard-summary>')(scope);

    // Act
    scope.$digest();
    var controller = element.controller('dashboardSummary');
    var formatted = controller.getFormattedTotal();

    // Assert
    expect(formatted).toBe('');
  });

  it('should format total spend when summary is provided', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.testSummary = {
      currency: 'USD',
      totalSpend: 123.456
    };
    var element = $compile('<dashboard-summary summary="testSummary"></dashboard-summary>')(scope);

    // Act
    scope.$digest();
    var controller = element.controller('dashboardSummary');
    var formatted = controller.getFormattedTotal();

    // Assert
    expect(formatted).toBe('USD 123.46');
  });
});

/*
Test Documentation:
- Test Name: dashboardSummary directive formatted total behavior
- Purpose: Verify that total spend is formatted correctly and safely when summary is missing.
- Scenario: Compile directive with null and valid summary object.
- Expected Result: getFormattedTotal returns empty string for null summary and currency + amount to two decimal places otherwise.
*/

/*
Coverage Report:
- Functions tested: DashboardSummaryController.getFormattedTotal.
- Statements covered: Null check and formatted string creation.
- Branches covered: summary present vs absent.
- Error scenarios covered: None; null summary handled gracefully.
- Uncovered scenarios: None.
*/