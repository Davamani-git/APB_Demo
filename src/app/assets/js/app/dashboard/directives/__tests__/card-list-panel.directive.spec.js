describe('Directive: cardListPanel', function() {
  var $compile, $rootScope;

  beforeEach(module('appmrn25.dashboard'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should bind cards and selectedCardId to CardListController', function() {
    // Arrange
    var scope = $rootScope.$new();
    scope.cards = [{ cardId: '1' }];
    scope.selected = '1';
    scope.onSelect = function() {};

    var element = $compile('<card-list-panel cards="cards" selected-card-id="selected" on-select="onSelect(cardId)"></card-list-panel>')(scope);

    // Act
    scope.$digest();
    var isolatedScope = element.isolateScope();
    var vm = isolatedScope.vm;

    // Assert
    expect(vm.cards).toEqual(scope.cards);
    expect(vm.selectedCardId).toBe('1');
    expect(typeof vm.onSelect).toBe('function');
  });
});

/*
Test Documentation:
- Test Name: cardListPanel directive bindings
- Purpose: Verify that the directive correctly binds attributes to the CardListController.
- Scenario: Compile cardListPanel with cards, selected-card-id, and on-select attributes.
- Expected Result: Isolated scope's vm has the same cards and selectedCardId values; onSelect is a function.
*/

/*
Coverage Report:
- Functions tested: Directive factory function for cardListPanel (behavior via Angular binding).
- Statements covered: Directive definition properties including scope, templateUrl, controller, controllerAs, bindToController.
- Branches covered: None.
- Error scenarios covered: None.
- Uncovered scenarios: Template rendering and interactions inside CardListPanel template.
*/