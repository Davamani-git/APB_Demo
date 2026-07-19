describe('monthlySummaryCard directive', function () {
  var $compile, $rootScope;

  beforeEach(module('app'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should bind inputs to controller and render template', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.card = {
      title: 'Total Spend',
      iconCssClass: 'kpi-icon-total',
      value: '$100.00',
      subtitle: 'Subtitle',
      cssClass: 'kpi-card-total'
    };

    var elementHtml = '<monthly-summary-card ' +
      'css-class="{{card.cssClass}}" ' +
      'title="{{card.title}}" ' +
      'icon="{{card.iconCssClass}}" ' +
      'value="card.value" ' +
      'subtitle="{{card.subtitle}}">' +
      '</monthly-summary-card>';

    var element = $compile(elementHtml)(scope);

    // Act
    scope.$digest();

    var vm = element.isolateScope().vm;

    // Assert
    expect(vm.title).toBe('Total Spend');
    expect(vm.icon).toBe('kpi-icon-total');
    expect(vm.value).toBe('$100.00');
    expect(vm.subtitle).toBe('Subtitle');
    expect(vm.cssClass).toBe('kpi-card-total');
  });

  it('should have a controller instance even with no extra logic', function () {
    // Arrange
    var scope = $rootScope.$new();
    scope.value = '$0.00';
    var element = $compile('<monthly-summary-card value="value"></monthly-summary-card>')(scope);

    // Act
    scope.$digest();

    var vm = element.isolateScope().vm;

    // Assert
    expect(vm).toBeDefined();
  });
});

/*
Test Documentation:
- Test Name: monthlySummaryCard directive bindings
- Purpose: Verify that directive binds isolated scope properties to its controller and template correctly.
- Scenario: Compile directive with all inputs and inspect controller properties; compile with minimal input.
- Expected Result: Controller vm properties mirror attribute and bound values; controller exists even without additional logic.
*/

/*
Coverage Report:
- Functions tested: MonthlySummaryCardController (trivial), directive definition bindings.
- Statements covered: Directive configuration for scope attributes and bindToController.
- Branches covered: None (no branching logic).
- Error scenarios covered: None.
- Uncovered scenarios: Template rendering specifics and DOM-level behavior outside controller bindings.
*/