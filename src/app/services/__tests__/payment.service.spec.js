/*
Test Documentation:
- Test Name: PaymentService processPayment success
- Purpose: Validates successful payment processing
- Scenario: Valid payment details with future expiry date
- Expected Result: Payment is processed with transaction ID
*/
/*
Test Documentation:
- Test Name: PaymentService processPayment missing details
- Purpose: Validates rejection for incomplete payment details
- Scenario: Missing card number, CVV, or expiry date
- Expected Result: Promise is rejected with error message
*/
/*
Test Documentation:
- Test Name: PaymentService processPayment expired card
- Purpose: Validates rejection for expired card
- Scenario: Card expiry date is in the past
- Expected Result: Promise is rejected with expiry error message
*/
/*
Coverage Report:
- Functions tested: processPayment
- Scenarios covered: successful payment, missing details, expired card, current month expiry
- Uncovered scenarios: none
*/

describe('PaymentService', function() {
  'use strict';
  
  beforeEach(module('onlineShoppingApp'));
  
  var PaymentService, $timeout;
  
  beforeEach(inject(function(_PaymentService_, _$timeout_) {
    PaymentService = _PaymentService_;
    $timeout = _$timeout_;
  }));
  
  describe('processPayment', function() {
    it('should process payment successfully with valid details', function(done) {
      var paymentDetails = {
        cardNumber: '4111111111111111',
        cvv: '123',
        expiryDate: '12/2025',
        amount: 1999
      };
      
      PaymentService.processPayment(paymentDetails).then(function(result) {
        expect(result.transactionId).toContain('TXN-');
        expect(result.status).toBe('success');
        expect(result.amount).toBe(1999);
        done();
      });
      
      $timeout.flush();
    });
    
    it('should reject payment with missing card number', function(done) {
      var paymentDetails = {
        cvv: '123',
        expiryDate: '12/2025',
        amount: 1999
      };
      
      PaymentService.processPayment(paymentDetails).catch(function(error) {
        expect(error.message).toBe('Invalid payment details');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should reject payment with missing CVV', function(done) {
      var paymentDetails = {
        cardNumber: '4111111111111111',
        expiryDate: '12/2025',
        amount: 1999
      };
      
      PaymentService.processPayment(paymentDetails).catch(function(error) {
        expect(error.message).toBe('Invalid payment details');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should reject payment with missing expiry date', function(done) {
      var paymentDetails = {
        cardNumber: '4111111111111111',
        cvv: '123',
        amount: 1999
      };
      
      PaymentService.processPayment(paymentDetails).catch(function(error) {
        expect(error.message).toBe('Invalid payment details');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should reject payment with expired card', function(done) {
      var paymentDetails = {
        cardNumber: '4111111111111111',
        cvv: '123',
        expiryDate: '01/2020',
        amount: 1999
      };
      
      PaymentService.processPayment(paymentDetails).catch(function(error) {
        expect(error.message).toBe('Card expired. Please update payment method.');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should reject payment with card expiring in past month of current year', function(done) {
      var currentDate = new Date();
      var pastMonth = currentDate.getMonth();
      var currentYear = currentDate.getFullYear() % 100;
      
      if (pastMonth === 0) {
        pastMonth = 12;
        currentYear -= 1;
      }
      
      var expiryDate = ('0' + pastMonth).slice(-2) + '/' + currentYear;
      
      var paymentDetails = {
        cardNumber: '4111111111111111',
        cvv: '123',
        expiryDate: expiryDate,
        amount: 1999
      };
      
      PaymentService.processPayment(paymentDetails).catch(function(error) {
        expect(error.message).toBe('Card expired. Please update payment method.');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should accept payment with current month and year', function(done) {
      var currentDate = new Date();
      var currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
      var currentYear = currentDate.getFullYear() % 100;
      var expiryDate = currentMonth + '/' + currentYear;
      
      var paymentDetails = {
        cardNumber: '4111111111111111',
        cvv: '123',
        expiryDate: expiryDate,
        amount: 1999
      };
      
      PaymentService.processPayment(paymentDetails).then(function(result) {
        expect(result.status).toBe('success');
        done();
      });
      
      $timeout.flush();
    });
  });
});