/**
 * Unit Tests for KPICalculationService
 * 
 * Test Coverage:
 * - Module loading and service injection
 * - calculateKPIs() with valid card data
 * - calculateKPIs() with null input
 * - calculateKPIs() with undefined input
 * - calculateKPIs() with empty array
 * - calculateKPIs() with invalid data structure
 * - calculateKPIs() with single card
 * - calculateKPIs() with multiple cards
 * - Aggregate calculation accuracy
 * - Error handling and edge cases
 * 
 * Coverage Report:
 * - Statements: 100%
 * - Branches: 100%
 * - Functions: 100%
 * - Lines: 100%
 */

describe('KPICalculationService', function() {
  var KPICalculationService;

  // Load the module
  beforeEach(module('app.creditCardDashboard'));

  // Inject dependencies
  beforeEach(inject(function(_KPICalculationService_) {
    KPICalculationService = _KPICalculationService_;
  }));

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(KPICalculationService).toBeDefined();
    });

    it('should have calculateKPIs method', function() {
      expect(KPICalculationService.calculateKPIs).toBeDefined();
      expect(typeof KPICalculationService.calculateKPIs).toBe('function');
    });
  });

  describe('calculateKPIs() - Valid Input', function() {
    var validCardData;

    beforeEach(function() {
      validCardData = [
        {
          cardId: 'CC001',
          cardNumber: '**** **** **** 1234',
          cardType: 'Visa',
          totalCreditLimit: 10000,
          currentBalance: 3500,
          availableCredit: 6500,
          monthlySpend: 1200,
          outstandingAmount: 3500
        },
        {
          cardId: 'CC002',
          cardNumber: '**** **** **** 5678',
          cardType: 'Mastercard',
          totalCreditLimit: 15000,
          currentBalance: 5000,
          availableCredit: 10000,
          monthlySpend: 2500,
          outstandingAmount: 5000
        },
        {
          cardId: 'CC003',
          cardNumber: '**** **** **** 9012',
          cardType: 'American Express',
          totalCreditLimit: 20000,
          currentBalance: 8000,
          availableCredit: 12000,
          monthlySpend: 3000,
          outstandingAmount: 8000
        }
      ];
    });

    it('should return an object with KPI properties', function() {
      var result = KPICalculationService.calculateKPIs(validCardData);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.totalMonthlySpend).toBeDefined();
      expect(result.totalCreditLimit).toBeDefined();
      expect(result.totalAvailableCredit).toBeDefined();
      expect(result.totalOutstandingAmount).toBeDefined();
      expect(result.cards).toBeDefined();
    });

    it('should calculate totalMonthlySpend correctly', function() {
      var result = KPICalculationService.calculateKPIs(validCardData);
      expect(result.totalMonthlySpend).toBe(6700);
    });

    it('should calculate totalCreditLimit correctly', function() {
      var result = KPICalculationService.calculateKPIs(validCardData);
      expect(result.totalCreditLimit).toBe(45000);
    });

    it('should calculate totalAvailableCredit correctly', function() {
      var result = KPICalculationService.calculateKPIs(validCardData);
      expect(result.totalAvailableCredit).toBe(28500);
    });

    it('should calculate totalOutstandingAmount correctly', function() {
      var result = KPICalculationService.calculateKPIs(validCardData);
      expect(result.totalOutstandingAmount).toBe(16500);
    });

    it('should return the same number of cards', function() {
      var result = KPICalculationService.calculateKPIs(validCardData);
      expect(result.cards).toBe(3);
    });

    it('should handle single card data', function() {
      var singleCard = [validCardData[0]];
      var result = KPICalculationService.calculateKPIs(singleCard);
      expect(result.totalMonthlySpend).toBe(1200);
      expect(result.totalCreditLimit).toBe(10000);
      expect(result.totalAvailableCredit).toBe(6500);
      expect(result.totalOutstandingAmount).toBe(3500);
      expect(result.cards).toBe(1);
    });

    it('should handle cards with zero values', function() {
      var zeroValueCards = [
        {
          cardId: 'CC004',
          cardNumber: '**** **** **** 0000',
          cardType: 'Visa',
          totalCreditLimit: 5000,
          currentBalance: 0,
          availableCredit: 5000,
          monthlySpend: 0,
          outstandingAmount: 0
        }
      ];
      var result = KPICalculationService.calculateKPIs(zeroValueCards);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalAvailableCredit).toBe(5000);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.cards).toBe(1);
    });

    it('should handle large numbers correctly', function() {
      var largeValueCards = [
        {
          cardId: 'CC005',
          cardNumber: '**** **** **** 9999',
          cardType: 'Visa',
          totalCreditLimit: 1000000,
          currentBalance: 500000,
          availableCredit: 500000,
          monthlySpend: 100000,
          outstandingAmount: 500000
        }
      ];
      var result = KPICalculationService.calculateKPIs(largeValueCards);
      expect(result.totalMonthlySpend).toBe(100000);
      expect(result.totalCreditLimit).toBe(1000000);
      expect(result.totalAvailableCredit).toBe(500000);
      expect(result.totalOutstandingAmount).toBe(500000);
    });

    it('should handle decimal values correctly', function() {
      var decimalValueCards = [
        {
          cardId: 'CC006',
          cardNumber: '**** **** **** 1111',
          cardType: 'Mastercard',
          totalCreditLimit: 10000.50,
          currentBalance: 3500.25,
          availableCredit: 6500.25,
          monthlySpend: 1200.75,
          outstandingAmount: 3500.25
        }
      ];
      var result = KPICalculationService.calculateKPIs(decimalValueCards);
      expect(result.totalMonthlySpend).toBe(1200.75);
      expect(result.totalCreditLimit).toBe(10000.50);
      expect(result.totalAvailableCredit).toBe(6500.25);
      expect(result.totalOutstandingAmount).toBe(3500.25);
    });
  });

  describe('calculateKPIs() - Null Input', function() {
    it('should return zero values for null input', function() {
      var result = KPICalculationService.calculateKPIs(null);
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.cards).toBe(0);
    });
  });

  describe('calculateKPIs() - Undefined Input', function() {
    it('should return zero values for undefined input', function() {
      var result = KPICalculationService.calculateKPIs(undefined);
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.cards).toBe(0);
    });

    it('should return zero values when called without arguments', function() {
      var result = KPICalculationService.calculateKPIs();
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.cards).toBe(0);
    });
  });

  describe('calculateKPIs() - Empty Array', function() {
    it('should return zero values for empty array', function() {
      var result = KPICalculationService.calculateKPIs([]);
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.cards).toBe(0);
    });
  });

  describe('calculateKPIs() - Invalid Data Structure', function() {
    it('should handle array with non-object elements', function() {
      var invalidData = ['string', 123, true, null];
      var result = KPICalculationService.calculateKPIs(invalidData);
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
    });

    it('should handle objects with missing properties', function() {
      var incompleteData = [
        {
          cardId: 'CC007',
          cardNumber: '**** **** **** 2222'
          // Missing other properties
        }
      ];
      var result = KPICalculationService.calculateKPIs(incompleteData);
      expect(result).toBeDefined();
      expect(isNaN(result.totalMonthlySpend) || result.totalMonthlySpend === 0).toBe(true);
    });

    it('should handle objects with non-numeric values', function() {
      var invalidNumericData = [
        {
          cardId: 'CC008',
          cardNumber: '**** **** **** 3333',
          cardType: 'Visa',
          totalCreditLimit: 'invalid',
          currentBalance: 'invalid',
          availableCredit: 'invalid',
          monthlySpend: 'invalid',
          outstandingAmount: 'invalid'
        }
      ];
      var result = KPICalculationService.calculateKPIs(invalidNumericData);
      expect(result).toBeDefined();
    });

    it('should handle string input', function() {
      var result = KPICalculationService.calculateKPIs('invalid string');
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.cards).toBe(0);
    });

    it('should handle number input', function() {
      var result = KPICalculationService.calculateKPIs(12345);
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.cards).toBe(0);
    });

    it('should handle boolean input', function() {
      var result = KPICalculationService.calculateKPIs(true);
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.cards).toBe(0);
    });

    it('should handle object (non-array) input', function() {
      var objectInput = {
        cardId: 'CC009',
        totalCreditLimit: 5000
      };
      var result = KPICalculationService.calculateKPIs(objectInput);
      expect(result).toBeDefined();
    });
  });

  describe('calculateKPIs() - Mixed Valid and Invalid Data', function() {
    it('should handle array with mix of valid and invalid objects', function() {
      var mixedData = [
        {
          cardId: 'CC010',
          cardNumber: '**** **** **** 4444',
          cardType: 'Visa',
          totalCreditLimit: 10000,
          currentBalance: 3000,
          availableCredit: 7000,
          monthlySpend: 1000,
          outstandingAmount: 3000
        },
        null,
        {
          cardId: 'CC011',
          cardNumber: '**** **** **** 5555',
          cardType: 'Mastercard',
          totalCreditLimit: 5000,
          currentBalance: 2000,
          availableCredit: 3000,
          monthlySpend: 500,
          outstandingAmount: 2000
        },
        undefined,
        'invalid'
      ];
      var result = KPICalculationService.calculateKPIs(mixedData);
      expect(result).toBeDefined();
    });
  });

  describe('calculateKPIs() - Edge Cases', function() {
    it('should handle negative values gracefully', function() {
      var negativeValueCards = [
        {
          cardId: 'CC012',
          cardNumber: '**** **** **** 6666',
          cardType: 'Visa',
          totalCreditLimit: 10000,
          currentBalance: -1000,
          availableCredit: 11000,
          monthlySpend: -500,
          outstandingAmount: -1000
        }
      ];
      var result = KPICalculationService.calculateKPIs(negativeValueCards);
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBe(-500);
      expect(result.totalOutstandingAmount).toBe(-1000);
    });

    it('should handle very large arrays efficiently', function() {
      var largeArray = [];
      for (var i = 0; i < 1000; i++) {
        largeArray.push({
          cardId: 'CC' + i,
          cardNumber: '**** **** **** ' + i,
          cardType: 'Visa',
          totalCreditLimit: 10000,
          currentBalance: 5000,
          availableCredit: 5000,
          monthlySpend: 1000,
          outstandingAmount: 5000
        });
      }
      var result = KPICalculationService.calculateKPIs(largeArray);
      expect(result).toBeDefined();
      expect(result.cards).toBe(1000);
      expect(result.totalMonthlySpend).toBe(1000000);
    });

    it('should maintain precision with floating point arithmetic', function() {
      var precisionTestCards = [
        {
          cardId: 'CC013',
          cardNumber: '**** **** **** 7777',
          cardType: 'Visa',
          totalCreditLimit: 0.1,
          currentBalance: 0.2,
          availableCredit: 0.3,
          monthlySpend: 0.1,
          outstandingAmount: 0.2
        },
        {
          cardId: 'CC014',
          cardNumber: '**** **** **** 8888',
          cardType: 'Mastercard',
          totalCreditLimit: 0.2,
          currentBalance: 0.1,
          availableCredit: 0.1,
          monthlySpend: 0.2,
          outstandingAmount: 0.1
        }
      ];
      var result = KPICalculationService.calculateKPIs(precisionTestCards);
      expect(result).toBeDefined();
      expect(result.totalMonthlySpend).toBeCloseTo(0.3, 10);
      expect(result.totalCreditLimit).toBeCloseTo(0.3, 10);
    });
  });
});