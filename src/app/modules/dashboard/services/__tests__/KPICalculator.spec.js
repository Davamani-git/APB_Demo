/*
Test Documentation:
- Test Name: KPICalculator - computeKPIs returns correct cardCount
- Purpose: Validate that the number of cards is correctly counted.
- Scenario: Array of 2 cards is passed.
- Expected Result: kpis.cardCount equals 2.

- Test Name: KPICalculator - computeKPIs sums totalCreditLimit correctly
- Purpose: Validate that all card credit limits are summed.
- Scenario: Two cards with known credit limits.
- Expected Result: kpis.totalCreditLimit equals the sum of both limits.

- Test Name: KPICalculator - computeKPIs sums totalAvailableCredit correctly
- Purpose: Validate that available credit across all cards is summed.
- Scenario: Two cards with known available credit values.
- Expected Result: kpis.totalAvailableCredit equals the sum.

- Test Name: KPICalculator - computeKPIs sums totalOutstanding correctly
- Purpose: Validate that outstanding amounts across all cards are summed.
- Scenario: Two cards with known outstanding amounts.
- Expected Result: kpis.totalOutstanding equals the sum.

- Test Name: KPICalculator - computeKPIs calculates monthlySpend for current month only
- Purpose: Validate that only transactions from the current month/year are included in monthlySpend.
- Scenario: Mix of current-month and past-month transactions.
- Expected Result: kpis.monthlySpend equals sum of current-month transactions only.

- Test Name: KPICalculator - computeKPIs handles empty cards and transactions
- Purpose: Validate graceful handling of empty input arrays.
- Scenario: Both cards and transactions are empty arrays.
- Expected Result: All KPI values are 0 and cardCount is 0.

- Test Name: KPICalculator - computeKPIs handles missing card fields (undefined)
- Purpose: Validate that missing/undefined card fields default to 0.
- Scenario: Card objects with undefined creditLimit, availableCredit, outstandingAmount.
- Expected Result: KPI sums treat undefined as 0.

Coverage Report:
- Functions tested: computeKPIs
- Scenarios covered: normal multi-card input, empty arrays, missing fields, monthly spend filtering, current vs past month transactions
- Uncovered scenarios: future-dated transactions, leap year edge cases
*/

describe('KPICalculator', function() {
  'use strict';

  var KPICalculator;

  beforeEach(module('dashboard'));

  beforeEach(inject(function(_KPICalculator_) {
    KPICalculator = _KPICalculator_;
  }));

  var mockCards = [
    { creditLimit: 5000, availableCredit: 2000, outstandingAmount: 3000 },
    { creditLimit: 8000, availableCredit: 4000, outstandingAmount: 4000 }
  ];

  function getCurrentMonthTransaction(amount) {
    var now = new Date();
    return { transactionDate: now.toISOString(), amount: amount };
  }

  function getPastMonthTransaction(amount) {
    var past = new Date();
    past.setMonth(past.getMonth() - 2);
    return { transactionDate: past.toISOString(), amount: amount };
  }

  describe('computeKPIs()', function() {

    it('should return correct cardCount for given cards array', function() {
      var result = KPICalculator.computeKPIs(mockCards, []);
      expect(result.cardCount).toBe(2);
    });

    it('should correctly sum totalCreditLimit across all cards', function() {
      var result = KPICalculator.computeKPIs(mockCards, []);
      expect(result.totalCreditLimit).toBe(13000);
    });

    it('should correctly sum totalAvailableCredit across all cards', function() {
      var result = KPICalculator.computeKPIs(mockCards, []);
      expect(result.totalAvailableCredit).toBe(6000);
    });

    it('should correctly sum totalOutstanding across all cards', function() {
      var result = KPICalculator.computeKPIs(mockCards, []);
      expect(result.totalOutstanding).toBe(7000);
    });

    it('should calculate monthlySpend only from current month transactions', function() {
      var transactions = [
        getCurrentMonthTransaction(100),
        getCurrentMonthTransaction(200),
        getPastMonthTransaction(500)
      ];
      var result = KPICalculator.computeKPIs(mockCards, transactions);
      expect(result.monthlySpend).toBe(300);
    });

    it('should return monthlySpend of 0 when all transactions are from past months', function() {
      var transactions = [
        getPastMonthTransaction(300),
        getPastMonthTransaction(700)
      ];
      var result = KPICalculator.computeKPIs(mockCards, transactions);
      expect(result.monthlySpend).toBe(0);
    });

    it('should return all zeros and cardCount 0 for empty cards and transactions', function() {
      var result = KPICalculator.computeKPIs([], []);
      expect(result.cardCount).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.monthlySpend).toBe(0);
    });

    it('should treat undefined card fields as 0', function() {
      var cardsWithMissingFields = [
        { creditLimit: undefined, availableCredit: undefined, outstandingAmount: undefined }
      ];
      var result = KPICalculator.computeKPIs(cardsWithMissingFields, []);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
    });

    it('should treat undefined transaction amount as 0 in monthlySpend', function() {
      var transactions = [
        { transactionDate: new Date().toISOString(), amount: undefined }
      ];
      var result = KPICalculator.computeKPIs([], transactions);
      expect(result.monthlySpend).toBe(0);
    });

    it('should handle a single card correctly', function() {
      var singleCard = [{ creditLimit: 3000, availableCredit: 1500, outstandingAmount: 1500 }];
      var result = KPICalculator.computeKPIs(singleCard, []);
      expect(result.cardCount).toBe(1);
      expect(result.totalCreditLimit).toBe(3000);
      expect(result.totalAvailableCredit).toBe(1500);
      expect(result.totalOutstanding).toBe(1500);
    });

    it('should include all current-month transactions in monthlySpend', function() {
      var transactions = [
        getCurrentMonthTransaction(50),
        getCurrentMonthTransaction(75),
        getCurrentMonthTransaction(25)
      ];
      var result = KPICalculator.computeKPIs([], transactions);
      expect(result.monthlySpend).toBe(150);
    });

  });

});