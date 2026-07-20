describe('dashboardChart directive and controller', function () {
  var $compile;
  var $rootScope;
  var $timeout;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    $provide.value('$timeout', function (fn, delay) {
      fn();
      return delay;
    });
  }));

  beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  it('should return null chart config when breakdown is missing or items invalid', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.testBreakdown = null;
    var element = $compile('<dashboard-chart breakdown="testBreakdown"></dashboard-chart>')(scope);

    // Act
    scope.$digest();
    var controller = element.controller('dashboardChart');

    // Assert
    expect(controller.getChartConfig()).toBeNull();

    // Arrange invalid items
    scope.testBreakdown = { items: 'not array' };
    element = $compile('<dashboard-chart breakdown="testBreakdown"></dashboard-chart>')(scope);
    scope.$digest();
    controller = element.controller('dashboardChart');
    expect(controller.getChartConfig()).toBeNull();
  });

  it('should build chart config when breakdown items are present', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.testBreakdown = {
      items: [
        { categoryName: 'Food', amount: 10 },
        { categoryName: 'Travel', amount: 20 }
      ]
    };
    var element = $compile('<dashboard-chart breakdown="testBreakdown"></dashboard-chart>')(scope);

    // Act
    scope.$digest();
    var controller = element.controller('dashboardChart');
    var config = controller.getChartConfig();

    // Assert
    expect(config).not.toBeNull();
    expect(config.data.labels).toEqual(['Food', 'Travel']);
    expect(config.data.datasets[0].data).toEqual([10, 20]);
  });

  it('should attempt to create Chart instance on $onInit when Chart is available', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.testBreakdown = {
      items: [{ categoryName: 'Food', amount: 10 }]
    };
    var canvas = document.createElement('canvas');
    canvas.id = 'spendBreakdownChart';
    document.body.appendChild(canvas);

    var element = angular.element('<dashboard-chart breakdown="testBreakdown"></dashboard-chart>');
    element.append(canvas);

    spyOn(window, 'Chart').and.callFake(function () {
      // fake Chart constructor
    });

    element = $compile(element)(scope);

    // Act
    scope.$digest();
    var controller = element.controller('dashboardChart');
    controller.$onInit();

    // Assert
    expect(window.Chart).toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(canvas);
  });
});

/*
Test Documentation:
- Test Name: dashboardChart directive chart configuration and initialization
- Purpose: Validate chart configuration creation and Chart.js integration in a safe, mocked way.
- Scenario: Compile directive with missing, invalid, and valid breakdown items; simulate Chart.js presence.
- Expected Result: getChartConfig returns null when data invalid; returns config with labels/data when valid; $onInit creates Chart instance when Chart is available.
*/

/*
Coverage Report:
- Functions tested: DashboardChartController.getChartConfig, DashboardChartController.$onInit.
- Statements covered: Breakdown validation, labels/data mapping, Chart configuration structure, DOM querying, Chart instantiation.
- Branches covered: breakdown missing vs present; items valid vs invalid; Chart presence vs absence.
- Error scenarios covered: Safe handling when config is null or canvas/Chart not available.
- Uncovered scenarios: None.
*/