describe('Directive: loadingSpinner', function() {
  var $compile, $rootScope;

  beforeEach(module('appmrn25.shared'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should render loading overlay when loading is true', function() {
    // Arrange
    var scope = $rootScope.$new();
    scope.flag = true;
    var element = $compile('<loading-spinner loading="flag"></loading-spinner>')(scope);

    // Act
    scope.$digest();

    // Assert
    expect(element.find('div').length).toBe(1);
    expect(element.find('div').hasClass('loading-overlay')).toBe(true);
  });

  it('should not render loading overlay when loading is false', function() {
    // Arrange
    var scope = $rootScope.$new();
    scope.flag = false;
    var element = $compile('<loading-spinner loading="flag"></loading-spinner>')(scope);

    // Act
    scope.$digest();

    // Assert
    expect(element.find('div').length).toBe(0);
  });
});

/*
Test Documentation:
- Test Name: loadingSpinner directive rendering
- Purpose: Validate that loadingSpinner shows or hides the overlay based on loading flag.
- Scenario: Compile directive with loading true and false.
- Expected Result: With loading true, overlay div is rendered; with loading false, no overlay is rendered.
*/

/*
Coverage Report:
- Functions tested: directive factory function in loading-spinner.directive.js.
- Statements covered: Directive definition fields and ng-if behavior.
- Branches covered: ng-if truthy and falsy branches for loading.
- Error scenarios covered: None.
- Uncovered scenarios: Interaction with nested content or styling specifics.
*/