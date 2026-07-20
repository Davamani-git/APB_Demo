describe('breakdownTable directive', function() {
    var $compile, $rootScope;
    var $scope;
    var element;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
    }));

    it('should render table rows for provided items when not empty', function() {
        // Arrange
        $scope.items = [
            { categoryName: 'Groceries', amount: 100, percentageOfTotal: 50 },
            { categoryName: 'Travel', amount: 200, percentageOfTotal: 50 }
        ];
        $scope.isEmpty = false;

        // Act
        element = $compile('<breakdownTable items="items" is-empty="isEmpty"></breakdownTable>')($scope);
        $scope.$digest();

        // Assert
        var rows = element.find('tr');
        expect(rows.length).toBeGreaterThan(1); // header + body rows
    });

    it('should show empty state when isEmpty is true', function() {
        // Arrange
        $scope.items = [];
        $scope.isEmpty = true;

        // Act
        element = $compile('<breakdownTable items="items" is-empty="isEmpty"></breakdownTable>')($scope);
        $scope.$digest();

        // Assert
        var emptyState = element[0].querySelector('.empty-state');
        expect(emptyState).not.toBeNull();
    });
});

/*
Test Documentation:
- Test Name: Table rows rendering
- Purpose: Validate that directive renders rows for each item when not empty.
- Scenario: Compile directive with non-empty items and isEmpty=false.
- Expected Result: Multiple table rows exist in DOM.

- Test Name: Empty state rendering
- Purpose: Ensure directive displays empty state when isEmpty is true.
- Scenario: Compile directive with empty items and isEmpty=true.
- Expected Result: Element with class 'empty-state' is present.
*/

/*
Coverage Report:
- Functions tested:
  - BreakdownTableController (no logic, but directive integration)
- Statements covered:
  - Directive template conditional rendering based on isEmpty
- Branches covered:
  - isEmpty false vs true
- Error scenarios covered:
  - N/A (no error handling logic present)
- Uncovered scenarios:
  - Complex table interactions (sorting, clicking) not implemented
*/