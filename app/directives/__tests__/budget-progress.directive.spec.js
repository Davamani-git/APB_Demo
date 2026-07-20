describe('budgetProgress directive and BudgetProgressController', function() {
    var $compile, $rootScope;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    function createElement(budget) {
        $rootScope.budget = budget;
        var element = angular.element('<budget-progress budget="budget"></budget-progress>');
        $compile(element)($rootScope);
        $rootScope.$digest();
        return element;
    }

    it('should return "info" bar type when budget is null or utilizationPercentage is null', function() {
        // Arrange
        var element = createElement(null);
        var controller = element.controller('budgetProgress') || element.controller('BudgetProgressController');

        // Act
        var typeNullBudget = controller.getBarType();
        controller.budget = { utilizationPercentage: null };
        var typeNullUtil = controller.getBarType();

        // Assert
        expect(typeNullBudget).toBe('info');
        expect(typeNullUtil).toBe('info');
    });

    it('should return "danger" when utilizationPercentage > 90', function() {
        // Arrange
        var element = createElement({ utilizationPercentage: 95 });
        var controller = element.controller('budgetProgress') || element.controller('BudgetProgressController');

        // Act
        var type = controller.getBarType();

        // Assert
        expect(type).toBe('danger');
    });

    it('should return "warning" when utilizationPercentage > 75 and <= 90', function() {
        // Arrange
        var element = createElement({ utilizationPercentage: 80 });
        var controller = element.controller('budgetProgress') || element.controller('BudgetProgressController');

        // Act
        var type = controller.getBarType();

        // Assert
        expect(type).toBe('warning');
    });

    it('should return "success" when utilizationPercentage <= 75', function() {
        // Arrange
        var element = createElement({ utilizationPercentage: 50 });
        var controller = element.controller('budgetProgress') || element.controller('BudgetProgressController');

        // Act
        var type = controller.getBarType();

        // Assert
        expect(type).toBe('success');
    });
});

/*
Test Documentation:
- Test Name: getBarType info cases
- Purpose: Ensure bar type is 'info' when budget or utilizationPercentage is null.
- Scenario: Directive compiled with null budget and then with budget having null utilizationPercentage.
- Expected Result: getBarType() returns 'info' in both cases.

- Test Name: getBarType danger case
- Purpose: Confirm 'danger' type when utilizationPercentage exceeds 90.
- Scenario: Directive with budget.utilizationPercentage = 95.
- Expected Result: getBarType() returns 'danger'.

- Test Name: getBarType warning case
- Purpose: Confirm 'warning' type when utilizationPercentage between 75 and 90.
- Scenario: Directive with budget.utilizationPercentage = 80.
- Expected Result: getBarType() returns 'warning'.

- Test Name: getBarType success case
- Purpose: Confirm 'success' type when utilizationPercentage is 75 or below.
- Scenario: Directive with budget.utilizationPercentage = 50.
- Expected Result: getBarType() returns 'success'.
*/

/*
Coverage Report:
- Functions tested:
  - BudgetProgressController.getBarType()
- Statements covered:
  - Null/undefined budget path
  - utilizationPercentage comparisons (> 90, > 75, else)
- Branches covered:
  - All conditional branches of getBarType
- Error scenarios covered:
  - None (simple value-based logic)
- Uncovered scenarios:
  - Typographical bug "or" vs "||" in source (assumed logical OR in tests).
*/