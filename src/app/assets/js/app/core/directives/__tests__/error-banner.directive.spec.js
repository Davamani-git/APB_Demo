describe('Directive: errorBanner', function() {
  var $compile, $rootScope;

  beforeEach(module('appmrn25.shared'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should render an alert with the provided message when message is set', function() {
    // Arrange
    var scope = $rootScope.$new();
    scope.msg = 'Error occurred';
    var element = $compile('<error-banner message="{{msg}}"></error-banner>')(scope);

    // Act
    scope.$digest();

    // Assert
    expect(element.html()).toContain('Error occurred');
    expect(element.find('div').hasClass('alert-danger')).toBe(true);
  });

  it('should not render content when message is empty', function() {
    // Arrange
    var scope = $rootScope.$new();
    scope.msg = '';
    var element = $compile('<error-banner message="{{msg}}"></error-banner>')(scope);

    // Act
    scope.$digest();

    // Assert
    expect(element.children().length).toBe(0);
  });
});

/*
Test Documentation:
- Test Name: errorBanner directive rendering
- Purpose: Validate that errorBanner shows or hides the alert based on message.
- Scenario: Compile directive with non-empty and empty messages.
- Expected Result: With non-empty message, alert with message text is rendered; with empty message, no alert DOM is rendered.
*/

/*
Coverage Report:
- Functions tested: directive factory function in error-banner.directive.js (returned directive definition object behavior through Angular).
- Statements covered: All fields of directive definition (scope, template, restrict) via behavior.
- Branches covered: ng-if truthy and falsy branches for message.
- Error scenarios covered: None (directive has no explicit error handling).
- Uncovered scenarios: Styling and CSS classes beyond presence of alert-danger class.
*/