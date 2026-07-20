describe('KpiSummaryModel', function () {
  var KpiSummaryModel;

  beforeEach(module('app'));

  beforeEach(inject(function (_KpiSummaryModel_) {
    KpiSummaryModel = _KpiSummaryModel_;
  }));

  it('should map valid numeric and string fields', function () {
    // Arrange
    var data = {
      month: '2026-01',
      totalSpend: 1000.5,
      transactionCount: 20,
      averageTransactionAmount: 50.025,
      maxTransactionAmount: 300
    };

    // Act
    var model = new KpiSummaryModel(data);

    // Assert
    expect(model.month).toBe('2026-01');
    expect(model.totalSpend).toBe(1000.5);
    expect(model.transactionCount).toBe(20);
    expect(model.averageTransactionAmount).toBe(50.025);
    expect(model.maxTransactionAmount).toBe(300);
  });

  it('should default invalid or negative numeric values to 0', function () {
    // Arrange
    var data = {
      month: 2026,
      totalSpend: -10,
      transactionCount: -1,
      averageTransactionAmount: 'not number',
      maxTransactionAmount: null
    };

    // Act
    var model = new KpiSummaryModel(data);

    // Assert
    expect(model.month).toBe('');
    expect(model.totalSpend).toBe(0);
    expect(model.transactionCount).toBe(0);
    expect(model.averageTransactionAmount).toBe(0);
    expect(model.maxTransactionAmount).toBe(0);
  });

  it('should handle undefined data by defaulting all properties', function () {
    // Arrange
    var data;

    // Act
    var model = new KpiSummaryModel(data);

    // Assert
    expect(model.month).toBe('');
    expect(model.totalSpend).toBe(0);
    expect(model.transactionCount).toBe(0);
    expect(model.averageTransactionAmount).toBe(0);
    expect(model.maxTransactionAmount).toBe(0);
  });
});

/*
Test Documentation:
- Test Name: KpiSummaryModel mapping and defaults
- Purpose: Ensure KPI summary model correctly maps data and defaults invalid values.
- Scenario: Instantiate KpiSummaryModel with valid, invalid, and missing data.
- Expected Result: Numeric properties are non-negative; invalid inputs are defaulted.
*/

/*
Coverage Report:
- Functions tested: KpiSummaryModel constructor
- Statements covered: All assignments and type checks for each property.
- Branches covered: Valid vs invalid numeric values; valid vs invalid month string.
- Error scenarios covered: Handling of invalid input types and negative values.
- Uncovered scenarios: None.
*/