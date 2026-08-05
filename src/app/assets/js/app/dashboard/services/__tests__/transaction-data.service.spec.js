describe('Service: TransactionDataService', function() {
  var TransactionDataService;

  beforeEach(module('appmrn25.dashboard'));

  beforeEach(inject(function(_TransactionDataService_) {
    TransactionDataService = _TransactionDataService_;
  }));

  it('should return empty array when summary is null', function() {
    // Arrange & Act
    var series = TransactionDataService.buildMonthlySpendSeries(null);

    // Assert
    expect(series).toEqual([]);
  });

  it('should build series array from summary', function() {
    // Arrange
    var summary = { monthLabel: 'Jan', monthlySpend: 123, currency: 'INR' };

    // Act
    var series = TransactionDataService.buildMonthlySpendSeries(summary);

    // Assert
    expect(series.length).toBe(1);
    expect(series[0].label).toBe('Jan');
    expect(series[0].value).toBe(123);
    expect(series[0].currency).toBe('INR');
  });
});

/*
Test Documentation:
- Test Name: TransactionDataService behavior
- Purpose: Ensure monthly spend series is generated correctly.
- Scenario: Call buildMonthlySpendSeries with null and valid summary.
- Expected Result: Returns [] for null; returns single-element array with label, value, and currency for valid summary.
*/

/*
Coverage Report:
- Functions tested: buildMonthlySpendSeries.
- Statements covered: Null check, returned array construction.
- Branches covered: summary null vs non-null.
- Error scenarios covered: None.
- Uncovered scenarios: Multiple months or more complex data series (not part of current implementation).
*/