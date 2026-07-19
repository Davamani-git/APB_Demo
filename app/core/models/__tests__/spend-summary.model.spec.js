describe('SpendSummaryModel', function () {
  var SpendSummaryModel, MetricsModel;

  beforeEach(module('app'));

  beforeEach(inject(function (_SpendSummaryModel_, _MetricsModel_) {
    SpendSummaryModel = _SpendSummaryModel_;
    MetricsModel = _MetricsModel_;
  }));

  it('should apply defaults and create MetricsModel when metrics is not instance', function () {
    // Arrange
    var props = {
      cardId: 'CARD-1',
      month: '2025-01',
      breakdown: { Groceries: 100 },
      lastUpdated: '2025-02-01T00:00:00Z'
    };

    // Act
    var summary = new SpendSummaryModel(props);

    // Assert
    expect(summary.cardId).toBe('CARD-1');
    expect(summary.month).toBe('2025-01');
    expect(summary.currency).toBe('USD');
    expect(summary.metrics instanceof MetricsModel).toBe(true);
    expect(summary.breakdown).toEqual({ Groceries: 100 });
    expect(summary.lastUpdated).toBe('2025-02-01T00:00:00Z');
  });

  it('should preserve provided MetricsModel instance', function () {
    // Arrange
    var metrics = new MetricsModel({ totalSpend: 200 });
    var props = {
      cardId: 'CARD-2',
      month: '2025-02',
      currency: 'EUR',
      metrics: metrics,
      breakdown: {},
      lastUpdated: '2025-03-01T00:00:00Z'
    };

    // Act
    var summary = new SpendSummaryModel(props);

    // Assert
    expect(summary.metrics).toBe(metrics);
    expect(summary.currency).toBe('EUR');
  });

  it('should handle missing props gracefully', function () {
    // Act
    var summary = new SpendSummaryModel();

    // Assert
    expect(summary.cardId).toBe('');
    expect(summary.month).toBe('');
    expect(summary.currency).toBe('USD');
    expect(summary.metrics instanceof MetricsModel).toBe(true);
    expect(summary.breakdown).toEqual({});
    expect(summary.lastUpdated).toBe('');
  });
});

/*
Test Documentation:
- Test Name: SpendSummaryModel construction
- Purpose: Verify SpendSummaryModel sets defaults and composes MetricsModel correctly.
- Scenario: Instantiate with props containing raw metrics, existing MetricsModel, and with no props.
- Expected Result: Defaults used where needed; provided values retained; metrics always a MetricsModel instance.
*/

/*
Coverage Report:
- Functions tested: SpendSummaryModel constructor.
- Statements covered: Property assignments and metrics instance check.
- Branches covered: metrics instanceof MetricsModel condition.
- Error scenarios covered: Missing props; metrics not provided.
- Uncovered scenarios: Malformed metrics objects; non-object breakdown values.
*/