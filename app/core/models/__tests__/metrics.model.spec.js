describe('MetricsModel', function () {
  var MetricsModel;

  beforeEach(module('app'));

  beforeEach(inject(function (_MetricsModel_) {
    MetricsModel = _MetricsModel_;
  }));

  it('should default metrics to zero when props are missing', function () {
    // Act
    var metrics = new MetricsModel();

    // Assert
    expect(metrics.totalSpend).toBe(0);
    expect(metrics.transactionCount).toBe(0);
    expect(metrics.averageTransactionAmount).toBe(0);
    expect(metrics.activeDaysCount).toBe(0);
  });

  it('should apply valid numeric props', function () {
    // Arrange
    var props = {
      totalSpend: 100.5,
      transactionCount: 10,
      averageTransactionAmount: 10.05,
      activeDaysCount: 5
    };

    // Act
    var metrics = new MetricsModel(props);

    // Assert
    expect(metrics.totalSpend).toBe(100.5);
    expect(metrics.transactionCount).toBe(10);
    expect(metrics.averageTransactionAmount).toBe(10.05);
    expect(metrics.activeDaysCount).toBe(5);
  });

  it('should clamp negative or invalid metrics to zero', function () {
    // Arrange
    var props = {
      totalSpend: -1,
      transactionCount: -5,
      averageTransactionAmount: -10,
      activeDaysCount: -2
    };

    // Act
    var metrics = new MetricsModel(props);

    // Assert
    expect(metrics.totalSpend).toBe(0);
    expect(metrics.transactionCount).toBe(0);
    expect(metrics.averageTransactionAmount).toBe(0);
    expect(metrics.activeDaysCount).toBe(0);
  });

  it('should default transactionCount and activeDaysCount when non-integers provided', function () {
    // Act
    var metrics = new MetricsModel({ transactionCount: 3.5, activeDaysCount: '10' });

    // Assert
    expect(metrics.transactionCount).toBe(0);
    expect(metrics.activeDaysCount).toBe(0);
  });
});

/*
Test Documentation:
- Test Name: MetricsModel defaulting and validation
- Purpose: Ensure MetricsModel enforces non-negative numeric constraints and integer requirements.
- Scenario: Instantiate with missing, valid, negative, and non-integer values.
- Expected Result: Valid inputs preserved; invalid/negative/non-integers default to zero.
*/

/*
Coverage Report:
- Functions tested: MetricsModel constructor.
- Statements covered: All property assignment paths.
- Branches covered: totalSpend non-negative check; transactionCount integer/non-negative check; averageTransactionAmount non-negative check; activeDaysCount integer/non-negative check.
- Error scenarios covered: Negative and non-integer values.
- Uncovered scenarios: Extremely large numeric values; NaN inputs.
*/