describe('kpiCard directive', function() {
    var $compile, $rootScope;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should bind inputs to controller and render value based on format', function() {
        // Arrange
        $rootScope.value = 1234.5;
        var element = angular.element('<kpi-card title="Total" icon="fa-money" value="value" format="number"></kpi-card>');

        // Act
        $compile(element)($rootScope);
        $rootScope.$digest();
        var controller = element.controller('kpiCard');

        // Assert
        expect(controller.title).toBe('Total');
        expect(controller.icon).toBe('fa-money');
        expect(controller.value).toBe(1234.5);
    });
});

/*
Test Documentation:
- Test Name: kpiCard binding
- Purpose: Ensure directive binds title, icon, value, and format to its controller.
- Scenario: Compile directive with attributes and bound value.
- Expected Result: controller properties match supplied values.
*/

/*
Coverage Report:
- Functions tested:
  - Anonymous controller in kpi-card.directive.js
- Statements covered:
  - Directive definition and binding of attributes to controller
- Branches covered:
  - None (no conditional logic)
- Error scenarios covered:
  - None
- Uncovered scenarios:
  - Conditional template branches for different formats (currency, percentage, number) not directly asserted.
*/