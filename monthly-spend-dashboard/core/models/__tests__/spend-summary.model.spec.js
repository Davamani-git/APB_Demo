describe('SpendSummaryModel', function () {
  var SpendSummaryModel;

  beforeEach(module('app'));

  beforeEach(inject(function (_SpendSummaryModel_) {
    SpendSummaryModel = _SpendSummaryModel_;
  }));

  it('should map valid summary data', function () {
    // Arrange
    var data = {
      month: '2026-01',
      customerId: 'C1',
      cardId: 'CARD1',
      totalSpend: 500.25,
      currency: 'GBP',
      transactionCount: 10,
      generatedAt: '2026-02-01T00:00:00Z'
    };

    // Act
    var model = new SpendSummaryModel(data);

    // Assert
    expect(model.month).toBe('2026-01');
    expect(model.customerId).toBe('C1');
    expect(model.cardId).toBe('CARD1');
    expect(model.totalSpend).toBe(500.25);
    expect(model.currency).toBe('GBP');
    expect(model.transactionCount).toBe(10);
    expect(model.generatedAt).toBe('2026-02-01T00:00:00Z');
  });

  it('should default invalid numeric and string fields', function () {
    // Arrange
    var data = {
      month: 2026,
      customerId: 123,
      cardId: null,
      totalSpend: -1,
      currency: 999,
      transactionCount: -10,
      generatedAt: 10
    };

    // Act
    var model = new SpendSummaryModel(data);

    // Assert
    expect(model.month).toBe('');
    expect(model.customerId).toBe('');
    expect(model.cardId).toBe('');
    expect(model.totalSpend).toBe(0);
    expect(model.currency).toBe('USD');
    expect(model.transactionCount).toBe(0);
    expect(model.generatedAt).toBe('');
  });

  it('should handle undefined data by defaulting all properties', function () {
    // Arrange
    var data;

    // Act
    var model = new SpendSummaryModel(data);

    // Assert
    expect(model.month).toBe('');
    expect(model.customerId).toBe('');
    expect(model.cardId).toBe('');
    expect(model.totalSpend).toBe(0);
    expect(model.currency).toBe('USD');
    expect(model.transactionCount).toBe(0);
    expect(model.generatedAt).toBe('');
  });
});

/*
Test Documentation:
- Test Name: SpendSummaryModel mapping and defaults
- Purpose: Validate that spend summary model correctly maps fields and handles invalid input.
- Scenario: Instantiate SpendSummaryModel with valid, invalid, and undefined data.
- Expected Result: Fields are correctly mapped and defaulted; negative totals and counts are coerced to 0.
*/

/*
Coverage Report:
- Functions tested: SpendSummaryModel constructor
- Statements covered: All property assignments and type checks.
- Branches covered: Valid vs invalid string and numeric values.
- Error scenarios covered: Handling of negative totals and invalid types.
- Uncovered scenarios: None.
*/