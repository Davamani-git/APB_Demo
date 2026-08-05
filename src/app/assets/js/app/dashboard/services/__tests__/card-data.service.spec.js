describe('Service: CardDataService', function() {
  var CardDataService;

  beforeEach(module('appmrn25.dashboard'));

  beforeEach(inject(function(_CardDataService_) {
    CardDataService = _CardDataService_;
  }));

  describe('getCardById', function() {
    it('should return null when cards or cardId is falsy', function() {
      // Arrange & Act
      var result1 = CardDataService.getCardById(null, '1');
      var result2 = CardDataService.getCardById([], null);

      // Assert
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });

    it('should return matching card when found', function() {
      // Arrange
      var cards = [
        { cardId: '1', name: 'One' },
        { cardId: '2', name: 'Two' }
      ];

      // Act
      var result = CardDataService.getCardById(cards, '2');

      // Assert
      expect(result).toBe(cards[1]);
    });

    it('should return null when no matching card is found', function() {
      // Arrange
      var cards = [{ cardId: '1' }];

      // Act
      var result = CardDataService.getCardById(cards, '3');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('computeUtilization', function() {
    it('should return 0 for null card', function() {
      // Arrange & Act
      var utilization = CardDataService.computeUtilization(null);

      // Assert
      expect(utilization).toBe(0);
    });

    it('should return 0 when credit limit is non-numeric or <= 0', function() {
      // Arrange
      var card1 = { creditLimit: 'abc', outstandingAmount: 100 };
      var card2 = { creditLimit: 0, outstandingAmount: 100 };

      // Act
      var u1 = CardDataService.computeUtilization(card1);
      var u2 = CardDataService.computeUtilization(card2);

      // Assert
      expect(u1).toBe(0);
      expect(u2).toBe(0);
    });

    it('should treat negative outstanding as 0', function() {
      // Arrange
      var card = { creditLimit: 1000, outstandingAmount: -100 };

      // Act
      var utilization = CardDataService.computeUtilization(card);

      // Assert
      expect(utilization).toBe(0);
    });

    it('should compute utilization as outstanding/creditLimit', function() {
      // Arrange
      var card = { creditLimit: 2000, outstandingAmount: 1000 };

      // Act
      var utilization = CardDataService.computeUtilization(card);

      // Assert
      expect(utilization).toBeCloseTo(0.5, 5);
    });
  });
});

/*
Test Documentation:
- Test Name: CardDataService behavior
- Purpose: Verify card lookup and utilization calculations.
- Scenario: Call getCardById with various inputs and computeUtilization with valid/invalid card data.
- Expected Result: getCardById returns matching card or null; computeUtilization handles null, invalid limits, negative outstanding, and computes correct ratio.
*/

/*
Coverage Report:
- Functions tested: getCardById, computeUtilization.
- Statements covered: Null checks, loops, equality comparison, Number conversion, isNaN and bounds checks, utilization calculation.
- Branches covered: cards/cardId falsy vs truthy; matching vs non-matching card; valid vs invalid creditLimit; valid vs negative outstanding.
- Error scenarios covered: Invalid credit limit and outstanding amount handled gracefully.
- Uncovered scenarios: Extremely large arrays or numeric overflow scenarios.
*/