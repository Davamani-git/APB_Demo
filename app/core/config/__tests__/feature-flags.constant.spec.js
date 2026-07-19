describe('FEATURE_FLAGS constant', function () {
  var FEATURE_FLAGS;

  beforeEach(module('app'));

  beforeEach(inject(function (_FEATURE_FLAGS_) {
    FEATURE_FLAGS = _FEATURE_FLAGS_;
  }));

  it('should expose default feature flags', function () {
    // Assert
    expect(FEATURE_FLAGS).toBeDefined();
    expect(FEATURE_FLAGS.enableBreakdownChart).toBe(true);
    expect(FEATURE_FLAGS.showActiveDaysCount).toBe(true);
  });
});

/*
Test Documentation:
- Test Name: FEATURE_FLAGS default values
- Purpose: Ensure that feature flags constant is defined with expected defaults.
- Scenario: Inject FEATURE_FLAGS and inspect properties.
- Expected Result: enableBreakdownChart and showActiveDaysCount are true.
*/

/*
Coverage Report:
- Functions tested: None (constant definition only).
- Statements covered: Constant object properties.
- Branches covered: None.
- Error scenarios covered: None.
- Uncovered scenarios: Changes to feature flags at runtime or additional flags added later.
*/