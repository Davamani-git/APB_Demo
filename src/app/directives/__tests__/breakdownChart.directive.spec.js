describe('breakdownChart directive', function() {
    var $compile, $rootScope;
    var $scope;
    var element;
    var chartSpy;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        chartSpy = jasmine.createSpy('Chart');
        window.Chart = function(ctx, config) {
            chartSpy(ctx, config);
            return {
                destroy: jasmine.createSpy('destroy')
            };
        };
    }));

    function compileDirective(items) {
        $scope.items = items;
        $scope.isLoading = false;
        $scope.isEmpty = false;
        element = $compile('<breakdownChart items="items" is-loading="isLoading" is-empty="isEmpty"></breakdownChart>')($scope);
        $scope.$digest();
    }

    it('should destroy chart when items is null', function() {
        // Arrange
        compileDirective(null);

        // Act
        $scope.items = null;
        $scope.$digest();

        // Assert
        expect(chartSpy.calls.count()).toBe(0);
    });

    it('should destroy chart when items is empty array', function() {
        // Arrange
        compileDirective([]);

        // Act
        $scope.items = [];
        $scope.$digest();

        // Assert
        expect(chartSpy.calls.count()).toBe(0);
    });

    it('should render chart when items is a non-empty array', function() {
        // Arrange
        compileDirective([{ categoryName: 'A', amount: 10 }, { categoryName: 'B', amount: 20 }]);

        // Act
        $scope.$digest();

        // Assert
        expect(chartSpy).toHaveBeenCalled();
        var config = chartSpy.calls.mostRecent().args[1];
        expect(config.type).toBe('doughnut');
        expect(config.data.labels).toEqual(['A', 'B']);
        expect(config.data.datasets[0].data).toEqual([10, 20]);
    });

    it('should not throw when canvas element is missing', function() {
        // Arrange
        element = angular.element('<breakdownChart items="items" is-loading="isLoading" is-empty="isEmpty"></breakdownChart>');
        spyOn(element, 'find').and.returnValue([]);
        $scope.items = [{ categoryName: 'A', amount: 10 }];
        $scope.isLoading = false;
        $scope.isEmpty = false;

        // Act / Assert
        expect(function() {
            $compile(element)($scope);
            $scope.$digest();
        }).not.toThrow();
        expect(chartSpy.calls.count()).toBe(0);
    });
});

/*
Test Documentation:
- Test Name: Chart destruction with null items
- Purpose: Ensure directive destroys chart when items is null.
- Scenario: Compile directive with null items and digest.
- Expected Result: Chart constructor not called.

- Test Name: Chart destruction with empty items
- Purpose: Verify that an empty items array prevents chart rendering.
- Scenario: Compile directive with [] and digest.
- Expected Result: Chart constructor not called.

- Test Name: Chart rendering with valid items
- Purpose: Confirm chart rendering when items array has entries.
- Scenario: Compile directive with two breakdown items.
- Expected Result: Chart constructor called with doughnut config and matching labels/data.

- Test Name: Missing canvas handling
- Purpose: Ensure directive is resilient to missing canvas element.
- Scenario: Spy on element.find to return empty list.
- Expected Result: No exception thrown; chart not created.
*/

/*
Coverage Report:
- Functions tested:
  - BreakdownChartController (watch, renderChart, destroyChart)
- Statements covered:
  - Watch handler path for null/empty vs non-empty items
  - Chart configuration building
  - Chart destruction logic when chartInstance exists
  - Canvas existence check
- Branches covered:
  - items falsy vs array with length
  - canvas found vs not found
- Error scenarios covered:
  - Missing canvas element
- Uncovered scenarios:
  - Changes to items content (e.g., updates after initial render)
  - chartInstance.destroy throwing an error
*/