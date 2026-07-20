describe('ErrorModel', function () {
  var ErrorModel;

  beforeEach(module('app'));

  beforeEach(inject(function (_ErrorModel_) {
    ErrorModel = _ErrorModel_;
  }));

  it('should use provided string fields and details object', function () {
    // Arrange
    var data = {
      code: '123',
      message: 'Something went wrong',
      details: { foo: 'bar' },
      correlationId: 'corr-1',
      retryable: true
    };

    // Act
    var model = new ErrorModel(data);

    // Assert
    expect(model.code).toBe('123');
    expect(model.message).toBe('Something went wrong');
    expect(model.details).toEqual({ foo: 'bar' });
    expect(model.correlationId).toBe('corr-1');
    expect(model.retryable).toBe(true);
  });

  it('should default fields when data is missing or invalid', function () {
    // Arrange
    var data = {
      code: 500,
      message: null,
      details: 'invalid',
      correlationId: 123,
      retryable: 'not boolean'
    };

    // Act
    var model = new ErrorModel(data);

    // Assert
    expect(model.code).toBe('');
    expect(model.message).toBe('');
    expect(model.details).toEqual({});
    expect(model.correlationId).toBe('');
    expect(model.retryable).toBe(false);
  });

  it('should handle undefined data by using all defaults', function () {
    // Arrange
    var data;

    // Act
    var model = new ErrorModel(data);

    // Assert
    expect(model.code).toBe('');
    expect(model.message).toBe('');
    expect(model.details).toEqual({});
    expect(model.correlationId).toBe('');
    expect(model.retryable).toBe(false);
  });
});

/*
Test Documentation:
- Test Name: ErrorModel construction and defaults
- Purpose: Validate mapping of input data into ErrorModel and defaulting behavior.
- Scenario: Create ErrorModel with valid, invalid, and undefined data.
- Expected Result: Fields are set according to type checks; invalid or missing values are defaulted.
*/

/*
Coverage Report:
- Functions tested: ErrorModel constructor
- Statements covered: All property assignments and type checks.
- Branches covered: Valid vs invalid types for each field.
- Error scenarios covered: Handling of invalid input types and undefined data.
- Uncovered scenarios: None.
*/