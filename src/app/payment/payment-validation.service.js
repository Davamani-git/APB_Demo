(function() {
  'use strict';
  angular.module('shoppingPlatform').service('PaymentValidationService', [function() {
    this.validateCardNumber = function(cardNumber) {
      var cleaned = (cardNumber || '').replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cleaned)) {
        return { valid: false, error: 'Invalid card number length' };
      }
      var sum = 0;
      var shouldDouble = false;
      for (var i = cleaned.length - 1; i >= 0; i--) {
        var digit = parseInt(cleaned.charAt(i));
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return { valid: sum % 10 === 0, error: sum % 10 === 0 ? null : 'Invalid card number' };
    };
    this.validateCVV = function(cvv) {
      if (!/^\d{3,4}$/.test(cvv)) {
        return { valid: false, error: 'CVV must be 3 or 4 digits' };
      }
      return { valid: true, error: null };
    };
    this.validateExpiry = function(month, year) {
      var m = parseInt(month);
      var y = parseInt(year);
      if (isNaN(m) || isNaN(y) || m < 1 || m > 12) {
        return { valid: false, error: 'Invalid expiry date' };
      }
      var now = new Date();
      var expiry = new Date(y, m - 1);
      if (expiry <= now) {
        return { valid: false, error: 'Card has expired' };
      }
      return { valid: true, error: null };
    };
    this.validatePaymentDetails = function(paymentDetails) {
      var errors = [];
      var cardValidation = this.validateCardNumber(paymentDetails.cardNumber);
      if (!cardValidation.valid) {
        errors.push(cardValidation.error);
      }
      var cvvValidation = this.validateCVV(paymentDetails.cvv);
      if (!cvvValidation.valid) {
        errors.push(cvvValidation.error);
      }
      var expiryValidation = this.validateExpiry(paymentDetails.expiryMonth, paymentDetails.expiryYear);
      if (!expiryValidation.valid) {
        errors.push(expiryValidation.error);
      }
      return {
        valid: errors.length === 0,
        errors: errors
      };
    };
  }]);
})();