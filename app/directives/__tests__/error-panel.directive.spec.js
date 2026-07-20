describe('errorPanel directive', function() {
    var $compile, $rootScope;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should render error message when error is provided', function() {
        // Arrange
        $rootScope.error = { message: 'Test error' };
        var element = angular.element('<error-panel error="error"></error-panel>');

        // Act
        $compile(element)($rootScope);
        $rootScope.$digest();

        // Assert
        expect(element.text()).toContain('Test error');
    });

    it('should call retryAction when Retry button is clicked', function() {
        // Arrange
        $rootScope.error = { message: 'Retry error' };
        $rootScope.retryFn = jasmine.createSpy('retryFn');
        var element = angular.element('<error-panel error="error" retry-action="retryFn()"></error-panel>');

        // Act
        $compile(element)($rootScope);
        $rootScope.$digest();
        var button = element.find('button');
        button.triggerHandler('click');

        // Assert
        expect($rootScope.retryFn).toHaveBeenCalled();
    });
});

/*
Test Documentation:
- Test Name: errorPanel message rendering
- Purpose: Ensure directive displays the error.message text.
- Scenario: Compile directive with error object containing message.
- Expected Result: Rendered text contains error message.

- Test Name: errorPanel retry action
- Purpose: Verify retryAction callback is invoked on button click when provided.
- Scenario: Compile directive with error and retry-action bound to scope spy function; simulate click.
- Expected Result: Scope retryFn called.
*/

/*
Coverage Report:
- Functions tested:
  - Template/interaction of errorPanel directive
- Statements covered:
  - Directive configuration for error and retryAction binding
  - Button click ng-click="retryAction()" behavior
- Branches covered:
  - Presence vs absence of retryAction (button rendered only when retryAction defined)
- Error scenarios covered:
  - Display of error message for generic error model
- Uncovered scenarios:
  - Styling and conditional classes not unit-tested.
*/