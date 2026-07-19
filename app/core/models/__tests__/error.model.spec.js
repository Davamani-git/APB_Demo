describe('ErrorModel', function () {
  var ErrorModel;

  beforeEach(module('app'));

  beforeEach(inject(function (_ErrorModel_) {
    ErrorModel = _ErrorModel_;
  }));

  it('should apply defaults when properties are missing', function () {
    // Act
    var error = new ErrorModel();

    // Assert
    expect(error.code).toBe('');
    expect(error.message).toBe('');
    expect(error.httpStatus).toBe(0);
    expect(error.type).toBe('unknown');
    expect(error.retryable).toBe(false);
    expect(error.correlationId).toBe('');
  });

  it('should set provided properties and enforce types', function () {
    // Arrange
    var props = {
      code: 'SUMMARY_NOT_FOUND',
      message: 'Not found',
      httpStatus: 404,
      type: 'not_found',
      retryable: true,
      correlationId: 'cid-123'
    };

    // Act
    var error = new ErrorModel(props);

    // Assert
    expect(error.code).toBe('SUMMARY_NOT_FOUND');
    expect(error.message).toBe('Not found');
    expect(error.httpStatus).toBe(404);
    expect(error.type).toBe('not_found');
    expect(error.retryable).toBe(true);
    expect(error.correlationId).toBe('cid-123');
  });

  it('should default httpStatus when non-number is provided', function () {
    // Act
    var error = new ErrorModel({ httpStatus: '500' });

    // Assert
    expect(error.httpStatus).toBe(0);
  });

  it('should default retryable when non-boolean is provided', function () {
    // Act
    var error = new ErrorModel({ retryable: 'yes' });

    // Assert
    expect(error.retryable).toBe(false);
  });
});

/*
Test Documentation:
- Test Name: ErrorModel defaults and type enforcement
- Purpose: Ensure ErrorModel correctly applies defaults and respects provided properties with type checks.
- Scenario: Instantiate with missing, valid, and invalid typed properties.
- Expected Result: Defaults used when expected; provided properties set when valid; invalid types fall back to defaults.
*/

/*
Coverage Report:
- Functions tested: ErrorModel constructor.
- Statements covered: Property assignments and type/undefined checks.
- Branches covered: httpStatus numeric check; retryable boolean check.
- Error scenarios covered: Non-numeric httpStatus; non-boolean retryable.
- Uncovered scenarios: Extremely large httpStatus values; additional metadata fields.
*/