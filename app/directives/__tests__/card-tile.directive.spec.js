describe('cardTile directive', function() {
    var $compile, $rootScope;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should bind card data to isolated scope', function() {
        // Arrange
        $rootScope.card = {
            cardName: 'Enterprise Platinum',
            issuingBank: 'Global Bank',
            maskedCardNumber: '**** **** **** 1234',
            creditLimit: 100000,
            availableCredit: 80000,
            currentOutstanding: 20000,
            dueDate: '2026-09-05'
        };
        var element = angular.element('<card-tile card="card"></card-tile>');

        // Act
        $compile(element)($rootScope);
        $rootScope.$digest();
        var controller = element.controller('cardTile');

        // Assert
        expect(controller.card.cardName).toBe('Enterprise Platinum');
        expect(controller.card.issuingBank).toBe('Global Bank');
        expect(controller.card.maskedCardNumber).toBe('**** **** **** 1234');
    });
});

/*
Test Documentation:
- Test Name: cardTile scope binding
- Purpose: Ensure directive correctly binds passed card object to its controller.
- Scenario: Compile directive with card object on parent scope.
- Expected Result: controller.card properties match parent card object.
*/

/*
Coverage Report:
- Functions tested:
  - Anonymous controller in card-tile.directive.js (binding-only behavior)
- Statements covered:
  - Directive definition object (restrict, scope, bindToController)
- Branches covered:
  - None (no conditional logic)
- Error scenarios covered:
  - None (pure data binding)
- Uncovered scenarios:
  - Template rendering correctness (covered by end-to-end testing, not unit tests).
*/