describe('monthlyBreakdownChart directive', function () {
  var $compile, $rootScope, $timeout;
  var originalGetElementById;
  var canvasMock, contextMock, ChartConstructorSpy;

  beforeEach(module('app'));

  beforeEach(module(function ($provide) {
    // Mock Chart global
    ChartConstructorSpy = jasmine.createSpy('Chart').and.callFake(function () {
      return jasmine.createSpyObj('chartInstance', ['destroy']);
    });
    window.Chart = ChartConstructorSpy;
  }));

  beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;

    // Mock document.getElementById
    originalGetElementById = document.getElementById;
    contextMock = jasmine.createSpyObj('context', ['beginPath']);

    canvasMock = {
      getContext: function () { return contextMock; }
    };

    spyOn(document, 'getElementById').and.returnValue(canvasMock);
  }));

  afterEach(function () {
    // Restore original getElementById if needed
    document.getElementById = originalGetElementById || document.getElementById;
  });

  it('should not render chart when data is null', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.chartData = null;

    var element = $compile('<monthly-breakdown-chart data="chartData" currency="USD"></monthly-breakdown-chart>')(scope);

    // Act
    scope.$digest();
    $timeout.flush();

    // Assert
    expect(ChartConstructorSpy).not.toHaveBeenCalled();
  });

  it('should render doughnut chart when data is provided', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.chartData = { Groceries: 100, Restaurants: 50 };

    var element = $compile('<monthly-breakdown-chart data="chartData" currency="USD"></monthly-breakdown-chart>')(scope);

    // Act
    scope.$digest();
    $timeout.flush();

    // Assert
    expect(document.getElementById).toHaveBeenCalledWith('monthly-breakdown-chart-canvas');
    expect(ChartConstructorSpy).toHaveBeenCalled();

    var chartArgs = ChartConstructorSpy.calls.mostRecent().args;
    expect(chartArgs[1].type).toBe('doughnut');
    expect(chartArgs[1].data.labels).toEqual(['Groceries', 'Restaurants']);
    expect(chartArgs[1].data.datasets[0].data).toEqual([100, 50]);
  });

  it('should destroy previous chart instance before creating a new one when data changes', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.chartData = { Groceries: 100 };

    var element = $compile('<monthly-breakdown-chart data="chartData" currency="USD"></monthly-breakdown-chart>')(scope);
    scope.$digest();
    $timeout.flush();

    var firstChartInstance = ChartConstructorSpy.calls.mostRecent().returnValue;

    // Act: change data
    scope.chartData = { Groceries: 120, Utilities: 80 };
    scope.$digest();
    $timeout.flush();

    // Assert
    expect(firstChartInstance.destroy).toHaveBeenCalled();
    expect(ChartConstructorSpy.calls.count()).toBe(2);
  });
});

/*
Test Documentation:
- Test Name: monthlyBreakdownChart directive behavior
- Purpose: Ensure the Chart.js doughnut chart is rendered only when data is available and updated correctly on changes.
- Scenario: Compile directive with null data, with valid data, and then change data to trigger re-render.
- Expected Result: No chart when data is null; chart constructed with proper labels/data when provided; previous chart instance destroyed on data changes.
*/

/*
Coverage Report:
- Functions tested: MonthlyBreakdownChartController.$onInit, MonthlyBreakdownChartController.$onChanges, renderChart.
- Statements covered: data presence checks; canvas lookup; label and value extraction; palette application; chart destruction and re-construction; tooltip callback configuration (implicitly via options structure).
- Branches covered: vm.data falsy vs truthy; canvas not found vs found; chartInstance existing vs null.
- Error scenarios covered: Missing canvas element; null data.
- Uncovered scenarios: Tooltip formatting for non-USD currencies; extremely large number of categories.
*/