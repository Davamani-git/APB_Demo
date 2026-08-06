(function() {
  'use strict';
  angular.module('shoppingPlatform').factory('PaymentFactory', ['$q', '$window', 'PAYMENT_CONFIG', function($q, $window, PAYMENT_CONFIG) {
    return {
      tokenizePayment: function(paymentData) {
        var deferred = $q.defer();
        if (paymentData.method === 'credit_card' || paymentData.method === 'debit_card') {
          var token = 'tok_' + Math.random().toString(36).substr(2, 9) + Date.now();
          setTimeout(function() {
            deferred.resolve(token);
          }, 500);
        } else if (paymentData.method === 'paypal') {
          var token = 'pp_' + Math.random().toString(36).substr(2, 9) + Date.now();
          setTimeout(function() {
            deferred.resolve(token);
          }, 500);
        } else {
          deferred.reject('Unsupported payment method');
        }
        return deferred.promise;
      },
      validateCardNumber: function(cardNumber) {
        var cleaned = cardNumber.replace(/\s/g, '');
        return /^\d{13,19}$/.test(cleaned);
      },
      validateCVV: function(cvv) {
        return /^\d{3,4}$/.test(cvv);
      },
      validateExpiry: function(month, year) {
        var now = new Date();
        var expiry = new Date(year, month - 1);
        return expiry > now;
      }
    };
  }]);
})();