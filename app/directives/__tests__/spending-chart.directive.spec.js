describe('spendingChart directive', function() {
    var $compile, $rootScope;
    var originalChart;

    beforeEach(function() {
        // Mock global Chart constructor
        originalChart = window.Chart;
        window.Chart = jasmine.createSpy('Chart').and.callFake(function(ctx, config) {
            return {
                destroy: jasmine.createSpy('destroy')
            };
        });
    });

    afterEach(function() {
        window.Chart = originalChart;
    });

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should create chart when chartData has labels and datasets', function() {
        // Arrange
        $rootScope.data = {
            labels: ['Jan', 'Feb'],
            datasets: [{ data: [1, 2] }]
        };
        var element = angular.element('<spending-chart chart-data="data"></spending-chart>');

        // Act
        $compile(element)($rootScope);
        $rootScope.$digest();

        // Assert
        expect(window.Chart).toHaveBeenCalled();
        var args = window.Chart.calls.mostRecent().args[1];
        expect(args.type).toBe('bar');
        expect(args.data.labels).toEqual(['Jan', 'Feb']);
    });

    it('should destroy existing chart before creating a new one when data changes', function() {
        // Arrange
        $rootScope.data = {
            labels: ['Jan'],
            datasets: [{ data: [1] }]
        };
        var element = angular.element('<spending-chart chart-data="data"></spending-chart>');

        // Act
        $compile(element)($rootScope);
        $rootScope.$digest();

        var chartInstance = window.Chart.calls.mostRecent().returnValue;
        $rootScope.data = {
            labels: ['Feb'],
            datasets: [{ data: [2] }]
        };
        $rootScope.$digest();

        // Assert
        expect(chartInstance.destroy).toHaveBeenCalled();
        expect(window.Chart.calls.count()).toBeGreaterThan(1);
    });

    it('should not create chart when chartData is missing labels or datasets', function() {
        // Arrange
        $rootScope.data = {};
        var element = angular.element('<spending-chart chart-data="data"></spending-chart>');

        // Act
        $compile(element)($rootScope);
        $rootScope.$digest();

        // Assert
        expect(window.Chart).not.toHaveBeenCalled();
    });
});

/*
Test Documentation:
- Test Name: spendingChart basic creation
- Purpose: Verify a Chart instance is created when chartData contains labels and datasets.
- Scenario: Compile directive with minimal valid chartData.
- Expected Result: window.Chart called with config having type 'bar' and data.labels.

- Test Name: spendingChart re-creation
- Purpose: Ensure existing chart is destroyed before new chart is created when chartData changes.
- Scenario: Change chartData on scope to trigger $watch.
- Expected Result: previous chartInstance.destroy() called; Chart constructor called again.

- Test Name: spendingChart invalid data
- Purpose: Confirm no chart is created when chartData lacks labels or datasets.
- Scenario: chartData set to empty object.
- Expected Result: window.Chart not called.
*/

/*
Coverage Report:
- Functions tested:
  - spendingChart directive link function behavior
- Statements covered:
  - Creation of canvas and context
  - $watch on chartData and conditional creation of Chart
  - Destroying existing chartInstance when new data arrives
- Branches covered:
  - chartData valid (labels & datasets) vs invalid
- Error scenarios covered:
  - None explicitly; invalid data path which avoids chart creation
- Uncovered scenarios:
  - Option merging via angular.extend not deeply asserted.
*/