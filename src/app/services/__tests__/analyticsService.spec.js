/*
Test Documentation:
- Test Name: analyticsService - calculateSpendBreakdown
- Purpose: Validate spend breakdown calculation across multiple transactions and cards
- Scenario: Normal operation with multiple transactions, single card, empty array, edge cases
- Expected Result: Correctly aggregated spend data by cardId with totals and counts
*/

(function() {
  'use strict';

  describe('analyticsService', function() {
    var analyticsService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_analyticsService_) {
      analyticsService = _analyticsService_;
    }));

    describe('calculateSpendBreakdown', function() {
      /*
      Test Documentation:
      - Test Name: should return empty array for empty transactions
      - Purpose: Validate handling of empty input
      - Scenario: Pass empty array to calculateSpendBreakdown
      - Expected Result: Returns empty array
      */
      it('should return empty array for empty transactions', function() {
        var result = analyticsService.calculateSpendBreakdown([]);
        expect(result).toEqual([]);
      });

      /*
      Test Documentation:
      - Test Name: should calculate breakdown for single transaction
      - Purpose: Validate calculation with minimal data
      - Scenario: Single transaction for one card
      - Expected Result: Returns breakdown with correct totals
      */
      it('should calculate breakdown for single transaction', function() {
        var transactions = [
          { cardId: 'card1', amount: 100, currency: 'USD' }
        ];
        var result = analyticsService.calculateSpendBreakdown(transactions);
        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('card1');
        expect(result[0].totalSpend).toBe(100);
        expect(result[0].transactionCount).toBe(1);
        expect(result[0].currency).toBe('USD');
      });

      /*
      Test Documentation:
      - Test Name: should aggregate multiple transactions for same card
      - Purpose: Validate aggregation logic for single card
      - Scenario: Multiple transactions for same cardId
      - Expected Result: Single breakdown entry with summed amounts and correct count
      */
      it('should aggregate multiple transactions for same card', function() {
        var transactions = [
          { cardId: 'card1', amount: 100, currency: 'USD' },
          { cardId: 'card1', amount: 50, currency: 'USD' },
          { cardId: 'card1', amount: 25, currency: 'USD' }
        ];
        var result = analyticsService.calculateSpendBreakdown(transactions);
        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('card1');
        expect(result[0].totalSpend).toBe(175);
        expect(result[0].transactionCount).toBe(3);
        expect(result[0].currency).toBe('USD');
      });

      /*
      Test Documentation:
      - Test Name: should calculate breakdown for multiple cards
      - Purpose: Validate separation of data by cardId
      - Scenario: Transactions for multiple different cards
      - Expected Result: Separate breakdown entries for each card with correct totals
      */
      it('should calculate breakdown for multiple cards', function() {
        var transactions = [
          { cardId: 'card1', amount: 100, currency: 'USD' },
          { cardId: 'card2', amount: 200, currency: 'EUR' },
          { cardId: 'card1', amount: 50, currency: 'USD' },
          { cardId: 'card3', amount: 75, currency: 'GBP' }
        ];
        var result = analyticsService.calculateSpendBreakdown(transactions);
        expect(result.length).toBe(3);
        
        var card1Data = result.find(function(item) { return item.cardId === 'card1'; });
        expect(card1Data.totalSpend).toBe(150);
        expect(card1Data.transactionCount).toBe(2);
        expect(card1Data.currency).toBe('USD');
        
        var card2Data = result.find(function(item) { return item.cardId === 'card2'; });
        expect(card2Data.totalSpend).toBe(200);
        expect(card2Data.transactionCount).toBe(1);
        expect(card2Data.currency).toBe('EUR');
        
        var card3Data = result.find(function(item) { return item.cardId === 'card3'; });
        expect(card3Data.totalSpend).toBe(75);
        expect(card3Data.transactionCount).toBe(1);
        expect(card3Data.currency).toBe('GBP');
      });

      /*
      Test Documentation:
      - Test Name: should handle zero amount transactions
      - Purpose: Validate handling of zero values
      - Scenario: Transactions with zero amounts
      - Expected Result: Correctly includes zero amounts in calculation
      */
      it('should handle zero amount transactions', function() {
        var transactions = [
          { cardId: 'card1', amount: 0, currency: 'USD' },
          { cardId: 'card1', amount: 100, currency: 'USD' }
        ];
        var result = analyticsService.calculateSpendBreakdown(transactions);
        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(100);
        expect(result[0].transactionCount).toBe(2);
      });

      /*
      Test Documentation:
      - Test Name: should handle negative amounts (refunds)
      - Purpose: Validate handling of negative transaction amounts
      - Scenario: Mix of positive and negative amounts
      - Expected Result: Net total reflects refunds correctly
      */
      it('should handle negative amounts (refunds)', function() {
        var transactions = [
          { cardId: 'card1', amount: 100, currency: 'USD' },
          { cardId: 'card1', amount: -25, currency: 'USD' },
          { cardId: 'card1', amount: 50, currency: 'USD' }
        ];
        var result = analyticsService.calculateSpendBreakdown(transactions);
        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(125);
        expect(result[0].transactionCount).toBe(3);
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: calculateSpendBreakdown
- Scenarios covered:
  * Empty transactions array
  * Single transaction
  * Multiple transactions for same card
  * Multiple cards with mixed transactions
  * Zero amount transactions
  * Negative amounts (refunds)
- Edge cases covered: empty input, zero values, negative values, aggregation logic
- Uncovered scenarios: none - all primary paths and edge cases tested
*/