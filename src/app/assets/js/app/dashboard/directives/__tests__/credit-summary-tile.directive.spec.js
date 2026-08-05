describe('Directive: creditSummaryTile', function() {
  var $compile, $rootScope;

  beforeEach(module('appmrn25.dashboard'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should bind summary to directive scope', function() {
    // Arrange
    var scope = $rootScope.$new();
    scope.summary = { totalCreditLimit: 100 };

    var element = $compile('<credit-summary-tile summary="summary"></credit-summary-tile>')(scope);

    // Act
    scope.$digest();

    // Assert
    var isoScope = element.isolateScope();
    expect(isoScope.summary.totalCreditLimit).toBe(100);
  });
});

/*
Test Documentation:
- Test Name: creditSummaryTile directive binding
- Purpose: Verify that summary object is bound into the directive scope.
- Scenario: Compile creditSummaryTile with a summary object.
- Expected Result: Isolated scope.summary equals passed summary.
*/

/*
Coverage Report:
- Functions tested: Directive factory function for creditSummaryTile (binding behavior).
- Statements covered: Directive scope and templateUrl usage.
- Branches covered: None.
- Error scenarios covered: None.
- Uncovered scenarios: Template content and filter applications within the template.
*/