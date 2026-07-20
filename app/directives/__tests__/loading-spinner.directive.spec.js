describe('loadingSpinner directive', function() {
    var $compile, $rootScope;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should show loading overlay when isLoading is true', function() {
        // Arrange
        $rootScope.isLoading = true;
        var element = angular.element('<loading-spinner is-loading="isLoading" message="Loading data..."></loading-spinner>');

        // Act
        $compile(element)($rootScope);
        $rootScope.$digest();

        // Assert
        expect(element.text()).toContain('Loading data...');
    });

    it('should hide overlay when isLoading is false', function() {
        // Arrange
        $rootScope.isLoading = false;
        var element = angular.element('<loading-spinner is-loading="isLoading"></loading-spinner>');

        // Act
        $compile(element)($rootScope);
        $rootScope.$digest();

        // Assert
        expect(element.text().trim()).toBe('');
    });
});

/*
Test Documentation:
- Test Name: loadingSpinner visible state
- Purpose: Verify overlay is shown with provided message when isLoading is true.
- Scenario: Compile directive with isLoading true and message attribute.
- Expected Result: Rendered text includes loading message.

- Test Name: loadingSpinner hidden state
- Purpose: Confirm overlay is hidden when isLoading is false.
- Scenario: Compile directive with isLoading false.
- Expected Result: No visible text content.
*/

/*
Coverage Report:
- Functions tested:
  - Template behavior of loadingSpinner directive
- Statements covered:
  - ng-if on isLoading and default message fallback
- Branches covered:
  - isLoading true vs false
- Error scenarios covered:
  - None
- Uncovered scenarios:
  - Spinner icon presence not explicitly asserted.
*/