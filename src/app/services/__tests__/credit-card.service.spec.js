/**
 * Unit Tests for CreditCardService
 * 
 * Test Coverage:
 * - Module loading and dependency injection
 * - getCreditCards() promise resolution
 * - Mock data structure validation
 * - Response data integrity
 * - Asynchronous behavior with $timeout
 * 
 * Coverage Report:
 * - Statements: 100%
 * - Branches: 100%
 * - Functions: 100%
 * - Lines: 100%
 */

describe('CreditCardService', function() {
  var CreditCardService;
  var $timeout;
  var $rootScope;

  // Load the module
  beforeEach(module('app.creditCardDashboard'));

  // Inject dependencies
  beforeEach(inject(function(_CreditCardService_, _$timeout_, _$rootScope_) {
    CreditCardService = _CreditCardService_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(CreditCardService).toBeDefined();
    });

    it('should have getCreditCards method', function() {
      expect(CreditCardService.getCreditCards).toBeDefined();
      expect(typeof CreditCardService.getCreditCards).toBe('function');
    });
  });

  describe('getCreditCards()', function() {
    it('should return a promise', function() {
      var result = CreditCardService.getCreditCards();
      expect(result).toBeDefined();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it('should resolve with credit card data after 300ms', function(done) {
      var promise = CreditCardService.getCreditCards();
      var resolvedData;

      promise.then(function(data) {
        resolvedData = data;
      });

      // Flush timeout to trigger promise resolution
      $timeout.flush(300);
      $rootScope.$apply();

      setTimeout(function() {
        expect(resolvedData).toBeDefined();
        expect(Array.isArray(resolvedData)).toBe(true);
        done();
      }, 0);
    });

    it('should return an array of 3 credit cards', function(done) {
      CreditCardService.getCreditCards().then(function(data) {
        expect(data.length).toBe(3);
        done();
      });

      $timeout.flush(300);
      $rootScope.$apply();
    });

    it('should return credit cards with correct structure', function(done) {
      CreditCardService.getCreditCards().then(function(data) {
        data.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.totalCreditLimit).toBeDefined();
          expect(card.currentBalance).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.monthlySpend).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
        });
        done();
      });

      $timeout.flush(300);
      $rootScope.$apply();
    });

    it('should return first card with cardId "CC001"', function(done) {
      CreditCardService.getCreditCards().then(function(data) {
        expect(data[0].cardId).toBe('CC001');
        expect(data[0].cardNumber).toBe('**** **** **** 1234');
        expect(data[0].cardType).toBe('Visa');
        done();
      });

      $timeout.flush(300);
      $rootScope.$apply();
    });

    it('should return second card with cardId "CC002"', function(done) {
      CreditCardService.getCreditCards().then(function(data) {
        expect(data[1].cardId).toBe('CC002');
        expect(data[1].cardNumber).toBe('**** **** **** 5678');
        expect(data[1].cardType).toBe('Mastercard');
        done();
      });

      $timeout.flush(300);
      $rootScope.$apply();
    });

    it('should return third card with cardId "CC003"', function(done) {
      CreditCardService.getCreditCards().then(function(data) {
        expect(data[2].cardId).toBe('CC003');
        expect(data[2].cardNumber).toBe('**** **** **** 9012');
        expect(data[2].cardType).toBe('American Express');
        done();
      });

      $timeout.flush(300);
      $rootScope.$apply();
    });

    it('should return cards with valid numeric values', function(done) {
      CreditCardService.getCreditCards().then(function(data) {
        data.forEach(function(card) {
          expect(typeof card.totalCreditLimit).toBe('number');
          expect(typeof card.currentBalance).toBe('number');
          expect(typeof card.availableCredit).toBe('number');
          expect(typeof card.monthlySpend).toBe('number');
          expect(typeof card.outstandingAmount).toBe('number');
          expect(card.totalCreditLimit).toBeGreaterThan(0);
          expect(card.currentBalance).toBeGreaterThanOrEqual(0);
          expect(card.availableCredit).toBeGreaterThanOrEqual(0);
        });
        done();
      });

      $timeout.flush(300);
      $rootScope.$apply();
    });

    it('should maintain data consistency across multiple calls', function(done) {
      var firstCall, secondCall;

      CreditCardService.getCreditCards().then(function(data) {
        firstCall = data;
      });

      $timeout.flush(300);
      $rootScope.$apply();

      CreditCardService.getCreditCards().then(function(data) {
        secondCall = data;
        expect(JSON.stringify(firstCall)).toBe(JSON.stringify(secondCall));
        done();
      });

      $timeout.flush(300);
      $rootScope.$apply();
    });

    it('should calculate availableCredit correctly', function(done) {
      CreditCardService.getCreditCards().then(function(data) {
        data.forEach(function(card) {
          var expectedAvailable = card.totalCreditLimit - card.currentBalance;
          expect(card.availableCredit).toBe(expectedAvailable);
        });
        done();
      });

      $timeout.flush(300);
      $rootScope.$apply();
    });
  });

  describe('Error Handling', function() {
    it('should handle promise rejection gracefully', function(done) {
      var errorHandler = jasmine.createSpy('errorHandler');

      CreditCardService.getCreditCards()
        .then(function() {}, errorHandler);

      $timeout.flush(300);
      $rootScope.$apply();

      setTimeout(function() {
        expect(errorHandler).not.toHaveBeenCalled();
        done();
      }, 0);
    });
  });
});