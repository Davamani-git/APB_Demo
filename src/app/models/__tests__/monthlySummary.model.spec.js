describe('MonthlySummaryModel', function() {
    var MonthlySummaryModel;

    beforeEach(module('app'));

    beforeEach(inject(function(_MonthlySummaryModel_) {
        MonthlySummaryModel = _MonthlySummaryModel_;
    }));

    it('should initialize with default values when dto is missing', function() {
        // Arrange / Act
        var model = new MonthlySummaryModel();

        // Assert
        expect(model.cardId).toBe('');
        expect(model.month).toBe('');
        expect(model.totalSpend).toBe(0);
        expect(model.currency).toBe('USD');
        expect(model.statementType).toBe('statement');
        expect(model.dataFreshness).toBe('');
    });

    it('should use dto values and enforce numeric totalSpend type', function() {
        // Arrange
        var dto = {
            cardId: 'CARD123',
            month: '2026-07',
            totalSpend: '123.45',
            currency: 'EUR',
            statementType: 'summary',
            dataFreshness: 'fresh'
        };

        // Act
        var model = new MonthlySummaryModel(dto);

        // Assert
        expect(model.cardId).toBe('CARD123');
        expect(model.month).toBe('2026-07');
        expect(model.totalSpend).toBe(0); // non-number defaults to 0
        expect(model.currency).toBe('EUR');
        expect(model.statementType).toBe('summary');
        expect(model.dataFreshness).toBe('fresh');
    });

    it('should be valid when cardId, month, totalSpend non-negative and currency present', function() {
        // Arrange
        var model = new MonthlySummaryModel({
            cardId: 'CARD123',
            month: '2026-07',
            totalSpend: 10,
            currency: 'USD'
        });

        // Act / Assert
        expect(model.isValid()).toBe(true);
    });

    it('should be invalid when required fields missing or totalSpend negative', function() {
        // Arrange
        var noCard = new MonthlySummaryModel({ month: '2026-07', totalSpend: 10, currency: 'USD' });
        var noMonth = new MonthlySummaryModel({ cardId: 'CARD123', totalSpend: 10, currency: 'USD' });
        var negativeSpend = new MonthlySummaryModel({ cardId: 'CARD123', month: '2026-07', totalSpend: -1, currency: 'USD' });
        var noCurrency = new MonthlySummaryModel({ cardId: 'CARD123', month: '2026-07', totalSpend: 10 });

        // Act / Assert
        expect(noCard.isValid()).toBe(false);
        expect(noMonth.isValid()).toBe(false);
        expect(negativeSpend.isValid()).toBe(false);
        expect(noCurrency.isValid()).toBe(false);
    });
});

/*
Test Documentation:
- Test Name: Default MonthlySummaryModel initialization
- Purpose: Ensure constructor uses defaults when dto is missing.
- Scenario: new MonthlySummaryModel().
- Expected Result: Fields set to default values.

- Test Name: DTO-based initialization and type enforcement
- Purpose: Verify constructor assigns dto properties and enforces numeric type for totalSpend.
- Scenario: dto with string totalSpend.
- Expected Result: totalSpend=0; other fields from dto.

- Test Name: Valid summary detection
- Purpose: Confirm isValid returns true when all required fields present and totalSpend non-negative.
- Scenario: MonthlySummaryModel with cardId, month, totalSpend>=0, and currency.
- Expected Result: isValid() true.

- Test Name: Invalid summary cases
- Purpose: Ensure isValid detects missing fields and negative totalSpend.
- Scenario: Models missing cardId, month, currency, or with negative totalSpend.
- Expected Result: isValid() false.
*/

/*
Coverage Report:
- Functions tested:
  - MonthlySummaryModel constructor
  - MonthlySummaryModel.prototype.isValid
- Statements covered:
  - DTO normalization and assignments
  - Numeric type check for totalSpend
  - Validity predicate logic
- Branches covered:
  - dto provided vs missing
  - typeof dto.totalSpend is 'number' vs otherwise
  - cardId/month/currency truthy vs falsy
  - totalSpend >= 0 vs negative
- Error scenarios covered:
  - N/A
- Uncovered scenarios:
  - Extremely large totalSpend values
*/