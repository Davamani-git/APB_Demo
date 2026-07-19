describe('TransactionModel', function () {
  var TransactionModel;

  beforeEach(module('app'));

  beforeEach(inject(function (_TransactionModel_) {
    TransactionModel = _TransactionModel_;
  }));

  it('should apply defaults when props are missing', function () {
    // Act
    var tx = new TransactionModel();

    // Assert
    expect(tx.id).toBe('');
    expect(tx.cardId).toBe('');
    expect(tx.amount).toBe(0);
    expect(tx.currency).toBe('USD');
    expect(tx.transactionDate).toBe('');
    expect(tx.category).toBe('');
    expect(tx.isRefund).toBe(false);
    expect(tx.isReversal).toBe(false);
    expect(tx.isAdjustment).toBe(false);
  });

  it('should set provided props and coerce flags to booleans', function () {
    // Arrange
    var props = {
      id: 'TX-1',
      cardId: 'CARD-1',
      amount: 10.5,
      currency: 'EUR',
      transactionDate: '2025-01-01',
      category: 'Groceries',
      isRefund: 'truthy',
      isReversal: 0,
      isAdjustment: 1
    };

    // Act
    var tx = new TransactionModel(props);

    // Assert
    expect(tx.id).toBe('TX-1');
    expect(tx.cardId).toBe('CARD-1');
    expect(tx.amount).toBe(10.5);
    expect(tx.currency).toBe('EUR');
    expect(tx.transactionDate).toBe('2025-01-01');
    expect(tx.category).toBe('Groceries');
    expect(tx.isRefund).toBe(true);
    expect(tx.isReversal).toBe(false);
    expect(tx.isAdjustment).toBe(true);
  });

  it('should default amount when non-number provided', function () {
    // Act
    var tx = new TransactionModel({ amount: '10.5' });

    // Assert
    expect(tx.amount).toBe(0);
  });
});

/*
Test Documentation:
- Test Name: TransactionModel defaults and coercion
- Purpose: Ensure TransactionModel sets sensible defaults and coerces flag fields to booleans.
- Scenario: Instantiate with no props, with full props including truthy/falsy values, and with non-numeric amount.
- Expected Result: Defaults applied; flags coerced; invalid amount replaced with 0.
*/

/*
Coverage Report:
- Functions tested: TransactionModel constructor.
- Statements covered: Property assignments and flag coercion.
- Branches covered: amount typeof check; isRefund/isReversal/isAdjustment truthiness handling.
- Error scenarios covered: Non-numeric amount.
- Uncovered scenarios: NaN amount; extremely large numbers.
*/