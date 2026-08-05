describe('appmrn25.shared constants', function() {
  var ENV, VERSION;

  beforeEach(module('appmrn25.shared'));

  beforeEach(inject(function(_ENV_, _VERSION_) {
    ENV = _ENV_;
    VERSION = _VERSION_;
  }));

  it('should expose ENV constant with value "local"', function() {
    // Arrange & Act done in beforeEach
    // Assert
    expect(ENV).toBe('local');
  });

  it('should expose VERSION constant with value "1..0"', function() {
    // Arrange & Act
    // Assert
    expect(VERSION).toBe('1.0.0');
  });
});

/*
Test Documentation:
- Test Name: constants exposure
- Purpose: Validate that ENV and VERSION constants are registered and have expected values.
- Scenario: Inject constants from appmrn25.shared module.
- Expected Result: ENV === 'local', VERSION === '1.0.0'.
*/

/*
Coverage Report:
- Functions tested: constant registrations (implicit, no functions).
- Statements covered: Both constant definitions in app.constants.js.
- Branches covered: None (no branching logic).
- Error scenarios covered: None.
- Uncovered scenarios: Alternate environments or versions (not present in current implementation).
*/